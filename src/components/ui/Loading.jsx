import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                ))}
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;