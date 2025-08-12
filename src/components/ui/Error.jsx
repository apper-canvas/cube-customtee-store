import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-full mb-6">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-secondary text-center mb-8 max-w-md">
        {message}. We're sorry for the inconvenience. Please try again.
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center space-x-2">
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};

export default Error;