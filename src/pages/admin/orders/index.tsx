
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";
import {
  CustomerModal,
  PaymentModal,
  StatusModal,
  DeleteConfirmModal,
  // Remove a importação de TestPaymentModal
} from "@/components/admin/orders/OrderModals";
import { useFilteredOrders } from "@/hooks/admin/useFilteredOrders";

const OrdersPage: React.FC = () => {
  const {
    // Order data and filters
    orders,
    loading,
    paymentMethod,
    statusFilter,
    dateRange,
    customDateRange,
    ordersSummary,
    setStatusFilter,
    setDateRange,
    setCustomDateRange,
    changePaymentMethod,
    
    // Modal state
    selectedOrder,
    showCustomerModal,
    showPaymentModal,
    showStatusModal,
    showDeleteConfirm,
    showDeleteAllConfirm,
    
    // Handler functions
    handleViewCustomer,
    handleViewPayment,
    handleEditStatus,
    handleChangeStatus,
    handleDeleteOrder,
    handleConfirmDelete,
    handleDeleteAll,
    handleConfirmDeleteAll,
    
    // Modal controls
    setShowCustomerModal,
    setShowPaymentModal,
    setShowStatusModal,
    setShowDeleteConfirm,
    setShowDeleteAllConfirm,
  } = useFilteredOrders();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button 
          variant="destructive" 
          onClick={handleDeleteAll}
          className="flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Apagar todos
        </Button>
      </div>

      {/* Remover esta linha */}
      {/* <TestPaymentModal /> */}

      <OrdersTabs 
        paymentMethod={paymentMethod}
        orders={orders}
        loading={loading}
        statusFilter={statusFilter}
        dateRange={dateRange}
        customDateRange={customDateRange}
        ordersSummary={ordersSummary}
        onChangePaymentMethod={changePaymentMethod}
        setStatusFilter={setStatusFilter}
        setDateRange={setDateRange}
        setCustomDateRange={setCustomDateRange}
        onViewCustomer={handleViewCustomer}
        onViewPayment={handleViewPayment}
        onEditStatus={handleEditStatus}
        onDeleteOrder={handleDeleteOrder}
      />

      {/* Modals */}
      <CustomerModal
        order={selectedOrder}
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
      
      <PaymentModal
        order={selectedOrder}
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
      
      <StatusModal
        order={selectedOrder}
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onChangeStatus={handleChangeStatus}
      />
      
      <DeleteConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        isDeleteAll={false}
      />
      
      <DeleteConfirmModal
        open={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={handleConfirmDeleteAll}
        isDeleteAll={true}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default OrdersPage;
