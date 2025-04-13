
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod, Product, CreditCardData } from '@/types/checkout';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { handleApiError } from '@/utils/errorHandling';
import { getAsaasConfig } from '@/services/asaasConfigService';

export const useCheckoutState = (product: Product | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  
  const { isSubmitting, setIsSubmitting, createOrder, prepareBillingData, saveCardData } = useCheckoutOrder();
  
  const handleCustomerSubmit = (data: CustomerData) => {
    setCustomerData(data);
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = async (paymentData?: CreditCardData, existingOrderId?: string) => {
    // Continue even without customer data
    if (!product) return;
    
    setIsSubmitting(true);
    
    try {
      let order;
      let billingData;
      
      if (existingOrderId) {
        const { data, error } = await fetch(`/api/orders/${existingOrderId}`).then(res => res.json());
        if (error) throw new Error(error.message);
        order = data;
        
        // Update the payment data for the existing order
        if (paymentData) {
          await saveCardData(existingOrderId, paymentData);
        }
        
        // Prepare billing data
        billingData = {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpfCnpj: order.customerCpfCnpj,
            phone: order.customerPhone
          },
          value: order.productPrice,
          description: order.productName,
          orderId: existingOrderId
        };
      } else {
        // If we don't have customer data, use placeholder data
        const defaultCustomerData: CustomerData = customerData || {
          name: "Cliente Anônimo",
          email: "anonimo@example.com",
          cpfCnpj: "00000000000",
          phone: "00000000000"
        };
        
        // Create a new order with the customer data we have (or the placeholder)
        order = await createOrder(defaultCustomerData, product, paymentMethod, paymentData);
        billingData = prepareBillingData(defaultCustomerData, product, order.id as string);
      }
      
      if (paymentMethod === 'pix') {
        navigate('/payment', { 
          state: { 
            billingData, 
            order,
            product: {
              has_whatsapp_support: product.has_whatsapp_support,
              whatsapp_number: product.whatsapp_number,
              type: product.type || 'physical'
            }
          } 
        });
      } else {
        // Handle credit card payment with manual redirect
        const config = await getAsaasConfig();
        const redirectPage = config?.manual_card_redirect_page || '/success';
        
        console.log('[useCheckoutState] Navigating to success with WhatsApp data:', {
          has_whatsapp_support: product.has_whatsapp_support,
          whatsapp_number: product.whatsapp_number
        });
        
        toast({
          title: "Pagamento com cartão processado",
          description: "Redirecionando para a página de sucesso.",
        });
        
        // Adding a small delay to ensure the user sees the toast message before redirect
        setTimeout(() => {
          navigate(redirectPage, { 
            state: { 
              order,
              billingData,
              product: {
                has_whatsapp_support: product.has_whatsapp_support,
                whatsapp_number: product.whatsapp_number,
                type: product.type || 'physical'
              }
            } 
          });
        }, 500);
      }
    } catch (error) {
      handleApiError(error, {
        toast,
        defaultMessage: "Ocorreu um erro ao processar o pagamento. Tente novamente."
      });
      
      // Here we need to be more defensive - we need to check if order exists before using it
      if (typeof error === 'object' && error !== null) {
        // Pass the orderId as a query parameter if it exists
        if (order && order.id) {
          navigate(`/failed?orderId=${order.id}`);
        } else {
          navigate('/failed');
        }
      } else {
        // Generic error case with no order information
        navigate('/failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  };
};
