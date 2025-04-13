
import React from 'react';
import PaymentOptions from './PaymentOptions';
import { PaymentMethodForms } from './PaymentMethodForms';
import { PaymentStatusMessage } from './PaymentStatusMessage';
import { PaymentMethod } from '@/types/checkout';

interface PaymentMethodContentProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data?: any) => void;
  isSubmitting: boolean;
  buttonColor: string;
  buttonText: string;
  productPrice?: number;
  paymentSuccess: boolean;
  paymentError: boolean;
  hasValidCustomerData: boolean;
}

export const PaymentMethodContent: React.FC<PaymentMethodContentProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  isSubmitting,
  buttonColor,
  buttonText,
  productPrice,
  paymentSuccess,
  paymentError,
  hasValidCustomerData
}) => {
  return (
    <>
      <PaymentOptions 
        paymentMethod={paymentMethod} 
        onPaymentMethodChange={onPaymentMethodChange} 
      />
      
      <PaymentMethodForms
        paymentMethod={paymentMethod}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
        buttonColor={buttonColor}
        buttonText={buttonText}
        productPrice={productPrice}
        showQrCode={paymentSuccess}
        hasValidCustomerData={hasValidCustomerData}
      />
      
      <PaymentStatusMessage
        success={paymentSuccess}
        error={paymentError}
        paymentMethod={paymentMethod}
      />
    </>
  );
};
