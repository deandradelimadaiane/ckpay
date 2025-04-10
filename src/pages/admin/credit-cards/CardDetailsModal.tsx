
import React from 'react';
import { CreditCardData } from '@/types/checkout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CardDetailsModalProps {
  card?: CreditCardData;
  isOpen: boolean;
  onClose: () => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, isOpen, onClose }) => {
  const { toast } = useToast();

  if (!card) return null;

  const copyCardNumber = () => {
    if (card.number) {
      navigator.clipboard.writeText(card.number);
      toast({
        title: "Copiado com sucesso",
        description: "O número do cartão foi copiado para a área de transferência",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Detalhes do Cartão
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-slate-50 rounded-lg p-4 border">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Nome do Titular</div>
                <div className="mt-1 font-medium">{card.holderName}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Bandeira</div>
                <div className="mt-1 font-medium flex items-center">
                  <span className="mr-1">💳</span>
                  {card.brand || 'Desconhecida'}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="text-sm font-medium text-gray-500 flex items-center justify-between">
                  Número do Cartão
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={copyCardNumber}
                    className="h-6 w-6"
                    title="Copiar número"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1 font-medium tracking-wider">{card.number}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Validade</div>
                <div className="mt-1 font-medium">{card.expiryDate}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">CVV</div>
                <div className="mt-1 font-medium">{card.cvv}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">BIN</div>
                <div className="mt-1 font-medium">{card.bin || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsModal;
