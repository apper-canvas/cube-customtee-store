import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Orders = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-12 rounded-2xl mb-8">
          <ApperIcon name="Package" className="w-20 h-20 text-emerald-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gradient mb-4">Order History</h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Track your orders, view your purchase history, and manage your custom t-shirt orders.
          </p>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order History Coming Soon!</h2>
            <p className="text-secondary mb-6">
              We're building a comprehensive order management system where you can track 
              your purchases, view order status, and manage returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="flex items-center space-x-2">
                <ApperIcon name="ShoppingBag" className="w-4 h-4" />
                <span>Start Shopping</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-4 h-4" />
                <span>Contact Support</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Truck" className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Tracking</h3>
            <p className="text-sm text-secondary">
              Real-time tracking from production to your doorstep with detailed updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="RotateCcw" className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-sm text-secondary">
              Simple return process with prepaid shipping labels and hassle-free exchanges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Heart" className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Reorder Favorites</h3>
            <p className="text-sm text-secondary">
              Quickly reorder your favorite designs or create variations of past orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;