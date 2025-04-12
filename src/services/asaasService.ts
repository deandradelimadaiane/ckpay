
import { BillingData, PaymentStatus, PixPaymentData } from "@/types/checkout";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate a PIX payment through Netlify function or local mock
 */
export const generatePixPayment = async (billingData: BillingData): Promise<PixPaymentData> => {
  try {
    // First, fetch Asaas configuration to determine which endpoint to use
    const { data: config, error: configError } = await supabase
      .from('asaas_config')
      .select('use_netlify_functions, sandbox')
      .maybeSingle();
      
    if (configError) {
      console.error("Error fetching Asaas config:", configError);
      throw new Error("Failed to fetch Asaas configuration");
    }

    const useNetlifyFunctions = config?.use_netlify_functions ?? false;
    console.log(`Using Netlify functions: ${useNetlifyFunctions}`);

    // Determine which endpoint to use based on configuration
    const endpoint = useNetlifyFunctions 
      ? '/.netlify/functions/create-asaas-customer' 
      : '/api/mock-asaas-payment';

    console.log(`Using payment endpoint: ${endpoint}`);

    // Prepare the payment request payload
    const paymentPayload = {
      name: billingData.customer.name,
      cpfCnpj: billingData.customer.cpfCnpj,
      email: billingData.customer.email,
      phone: billingData.customer.phone,
      orderId: billingData.orderId,
      value: billingData.value,
      description: billingData.description
    };

    // Make the API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload)
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from payment API:", errorText);
      throw new Error(`Error generating PIX payment: ${errorText.substring(0, 200)}`);
    }

    // Parse the response
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing response as JSON:", responseText);
      throw new Error("Invalid response from server. Could not process payment.");
    }

    console.log("Payment response data:", data);

    // Extract the payment ID correctly from the response
    const paymentId = data.payment?.id || data.paymentId || 'unknown_payment_id';
    console.log("Extracted payment ID:", paymentId);
    
    // Extract QR code image and improve logging
    let qrCodeImage = data.qrCodeImage || data.qrCodeImageUrl || data.pixQrCode?.encodedImage || '';
    
    // Log raw QR code data for debugging
    console.log("Raw QR code data received:", {
      qrCodeImage,
      qrCode: data.qrCode || data.pixQrCode?.payload,
      pixQrCode: data.pixQrCode
    });
    
    // Ensure QR code image is properly formatted
    if (qrCodeImage && !qrCodeImage.startsWith('data:image') && !qrCodeImage.startsWith('http')) {
      qrCodeImage = `data:image/png;base64,${qrCodeImage}`;
      console.log("Reformatted QR code image URL");
    }
    
    // Log the final QR code image for debugging
    console.log("QR code image to display:", qrCodeImage ? `${qrCodeImage.substring(0, 30)}...` : 'None');

    // Map response to a consistent format regardless of source (mock or Netlify function)
    return {
      paymentId: paymentId,
      qrCode: data.qrCode || data.pixQrCode?.payload || '',
      qrCodeImage: qrCodeImage,
      copyPasteKey: data.copyPasteKey || data.qrCode || data.pixQrCode?.payload || '',
      expirationDate: data.expirationDate || data.pixQrCode?.expirationDate || new Date(Date.now() + 30 * 60000).toISOString(),
      status: (data.status || 'PENDING') as PaymentStatus,
      value: billingData.value,
      description: billingData.description
    };
  } catch (error) {
    console.error("Error generating PIX payment:", error);
    throw new Error("Failed to generate PIX payment. Please try again.");
  }
};

/**
 * Check the status of an Asaas payment
 */
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  try {
    // Get Asaas configuration to determine which endpoint to use
    const { data: config, error: configError } = await supabase
      .from('asaas_config')
      .select('use_netlify_functions')
      .maybeSingle();
      
    if (configError) {
      console.error("Error fetching Asaas config:", configError);
      throw new Error("Failed to fetch Asaas configuration");
    }

    const useNetlifyFunctions = config?.use_netlify_functions ?? false;
    
    // Add a random cache busting parameter
    const cacheBuster = `cache_bust=${Date.now()}`;
    
    // Choose endpoint based on configuration
    const endpoint = useNetlifyFunctions
      ? `/.netlify/functions/check-payment-status?paymentId=${paymentId}&${cacheBuster}`
      : `/api/check-payment-status?paymentId=${paymentId}&${cacheBuster}`;
    
    console.log(`Checking payment status at: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from status API:", errorText);
      throw new Error(`Error checking payment status: ${errorText.substring(0, 200)}`);
    }
    
    // Log the raw response for debugging
    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing response as JSON:", responseText);
      throw new Error("Invalid response from server. Could not check payment status.");
    }
    
    if (!data.status) {
      console.error("Incomplete response:", data);
      throw new Error("Incomplete status data in server response.");
    }
    
    console.log("Successfully processed payment status:", data.status);
    return data.status as PaymentStatus;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw new Error("Failed to check payment status. Please try again.");
  }
};
