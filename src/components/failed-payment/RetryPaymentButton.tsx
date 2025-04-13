
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Order } from '@/types/checkout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { validateOrderData, logPaymentError } from '@/utils/paymentErrorHandler';

interface RetryPaymentButtonProps {
  order: Order | null;
  isLoading: boolean;
}

const RetryPaymentButton: React.FC<RetryPaymentButtonProps> = ({ order, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRetry = () => {
    const validation = validateOrderData(order);
    
    if (!validation.valid) {
      logPaymentError('RetryPaymentButton', validation.message, { orderId: order?.id });
      toast({
        title: "Erro",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    console.log('[RetryPaymentButton] Navigating to retry-payment with order ID:', order!.id);
    
    // Ensure the order object is complete with required fields
    const completeOrder: Order = {
      ...order!,
      id: order!.id,
      customerId: order!.customerId || '',
      customerName: order!.customerName,
      customerEmail: order!.customerEmail,
      customerCpfCnpj: order!.customerCpfCnpj || '',
      customerPhone: order!.customerPhone || '',
      productId: order!.productId || '',
      productName: order!.productName || '',
      productPrice: order!.productPrice,
      status: order!.status || 'PENDING',
      paymentMethod: order!.paymentMethod || 'creditCard',
      createdAt: order!.createdAt,
      updatedAt: order!.updatedAt,
      has_whatsapp_support: order!.has_whatsapp_support,
      whatsapp_number: order!.whatsapp_number
    };
    
    // Log the complete object for verification
    console.log('[RetryPaymentButton] Complete order object for retry:', completeOrder);
    
    // Navigate with the complete order object in state AND include orderId in URL
    navigate(`/retry-payment?orderId=${order!.id}`, { 
      state: { 
        order: completeOrder
      } 
    });
  };

  return (
    <Button 
      onClick={handleRetry} 
      className="w-full flex items-center gap-2"
      variant="default"
      disabled={isLoading}
    >
      <RefreshCcw className="h-5 w-5" />
      Tentar com outro cartão
    </Button>
  );
};

export default RetryPaymentButton;
