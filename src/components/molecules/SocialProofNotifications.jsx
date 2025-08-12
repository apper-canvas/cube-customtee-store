import React, { useState, useEffect } from 'react';
import { socialProofService } from '@/services/api/socialProofService';
import ApperIcon from '@/components/ApperIcon';

function SocialProofNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    // Then show notifications every 15-25 seconds
    const interval = setInterval(() => {
      showRandomNotification();
    }, Math.random() * 10000 + 15000); // 15-25 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const showRandomNotification = () => {
    const purchase = socialProofService.getRandomRecentPurchase();
    const notification = {
      id: Date.now(),
      ...purchase,
      timestamp: new Date()
    };

    setCurrentNotification(notification);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
      setCurrentNotification(null);
    }, 4000);
  };

  if (!currentNotification) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ApperIcon name="ShoppingBag" size={20} className="text-green-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                Recent Order
              </span>
            </div>
            
            <p className="text-sm font-medium text-gray-900 mt-1">
              <span className="font-semibold">{currentNotification.customerId}</span> from{' '}
              <span className="text-gray-600">{currentNotification.location}</span>
            </p>
            
            <p className="text-sm text-gray-600">
              Ordered "{currentNotification.design}" design on {currentNotification.product}
            </p>
            
            <p className="text-xs text-gray-500 mt-1">
              {currentNotification.timeAgo} minutes ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialProofNotifications;