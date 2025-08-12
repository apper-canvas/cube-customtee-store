import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Orders = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activeFilter, setActiveFilter] = React.useState('All Orders');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateRange, setDateRange] = React.useState({
    start: '',
    end: ''
  });

  const statusFilters = ['All Orders', 'Processing', 'In Production', 'Shipped', 'Delivered'];

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { checkoutService } = await import('@/services/api/checkoutService');
      const ordersData = await checkoutService.getOrders();
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      const { checkoutService } = await import('@/services/api/checkoutService');
      await checkoutService.reorderItems(orderId);
      const { toast } = await import('react-toastify');
      toast.success('Items added to cart successfully!');
    } catch (err) {
      const { toast } = await import('react-toastify');
      toast.error('Failed to reorder items');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Production':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeFilter === 'All Orders' || order.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesDateRange = true;
    if (dateRange.start || dateRange.end) {
      const orderDate = new Date(order.createdAt);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      
      matchesDateRange = (!startDate || orderDate >= startDate) && 
                        (!endDate || orderDate <= endDate);
    }
    
    return matchesStatus && matchesSearch && matchesDateRange;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-secondary mb-4">{error}</p>
          <Button onClick={loadOrders}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Order History</h1>
        <p className="text-secondary">Track your orders and manage your purchases</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search and Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Start date"
          />
          
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="End date"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <ApperIcon name="Package" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-secondary mb-6">
            {activeFilter !== 'All Orders' || searchTerm || dateRange.start || dateRange.end
              ? 'Try adjusting your filters to find more orders.'
              : 'Start shopping to see your orders here.'}
          </p>
          <Button onClick={() => window.location.href = '/'}>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.Id} className="bg-white rounded-xl p-6 shadow-sm card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="mb-4 lg:mb-0">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="DollarSign" className="w-4 h-4" />
                      ${order.total?.toFixed(2) || '0.00'}
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Package" className="w-4 h-4" />
                      {order.items?.length || 0} items
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order.Id)}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="RotateCcw" className="w-4 h-4" />
                    Reorder
                  </Button>
                  {order.status === 'Shipped' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="Truck" className="w-4 h-4" />
                      Track
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Items Preview */}
              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Shirt" className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.name || 'Custom T-Shirt'}
                          </p>
                          <p className="text-xs text-secondary">
                            Qty: {item.quantity} • ${item.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-secondary">
                          +{order.items.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Information */}
              {order.estimatedDelivery && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <ApperIcon name="Truck" className="w-4 h-4" />
                    <span>
                      Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;