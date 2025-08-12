import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DesignGallery = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-12 rounded-2xl mb-8">
          <ApperIcon name="Palette" className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gradient mb-4">Design Gallery</h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Browse thousands of pre-made templates and designs created by our community of talented designers.
          </p>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-secondary mb-6">
              We're working hard to bring you an amazing collection of design templates. 
              Stay tuned for updates!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="flex items-center space-x-2">
                <ApperIcon name="Bell" className="w-4 h-4" />
                <span>Notify Me</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                <span>Browse Products</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Zap" className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Templates</h3>
            <p className="text-sm text-secondary">
              Ready-to-use designs that you can customize with your own text and colors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community Designs</h3>
            <p className="text-sm text-secondary">
              Discover unique designs created and shared by other CustomTee users.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Star" className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Collection</h3>
            <p className="text-sm text-secondary">
              High-quality designs from professional artists and illustrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignGallery;