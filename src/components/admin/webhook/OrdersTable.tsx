
import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import OrderRow from './OrderRow';
import { WebhookEventType } from '@/hooks/admin/webhook/types';

interface OrdersTableProps {
  orders: any[] | null;
  isLoading: boolean;
  processingOrders: Record<string, boolean>;
  onSimulatePayment: (asaasPaymentId: string | null, orderId: string, isManualCard?: boolean) => Promise<void>;
  selectedEvent: WebhookEventType;
  paymentMethod: 'pix' | 'creditCard';
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  isLoading, 
  processingOrders, 
  onSimulatePayment,
  selectedEvent,
  paymentMethod
}) => {
  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <td colSpan={7} className="p-2">
                  <Skeleton className="h-12 w-full" />
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Handle empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <td colSpan={7} className="h-24 text-center">
                Nenhum pedido encontrado.
              </td>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  // Render orders table
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isProcessing={processingOrders[order.id] || false}
              onSimulatePayment={onSimulatePayment}
              selectedEvent={selectedEvent}
              currentTabPaymentMethod={paymentMethod}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
