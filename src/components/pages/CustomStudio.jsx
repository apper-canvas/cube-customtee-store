import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CustomStudio = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="bg-gradient-to-br from-orange-100 to-red-100 p-12 rounded-2xl mb-8">
          <ApperIcon name="Paintbrush" className="w-20 h-20 text-accent mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gradient mb-4">Custom Design Studio</h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Create your own unique designs with our powerful design tools and customization options.
          </p>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Design Studio Coming Soon!</h2>
            <p className="text-secondary mb-6">
              We're building an amazing design studio with drag-and-drop tools, text editors, 
              image uploads, and much more. Get ready to unleash your creativity!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="flex items-center space-x-2">
                <ApperIcon name="Sparkles" className="w-4 h-4" />
                <span>Get Early Access</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <ApperIcon name="Play" className="w-4 h-4" />
                <span>Watch Demo</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Type" className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Text Editor</h3>
            <p className="text-sm text-secondary">
              Add custom text with hundreds of fonts, colors, and effects.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-green-100 to-teal-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Image" className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Image Upload</h3>
            <p className="text-sm text-secondary">
              Upload your own images and logos to create personalized designs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Layers" className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Layer System</h3>
            <p className="text-sm text-secondary">
              Organize your design elements with a professional layer system.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="bg-gradient-to-br from-red-100 to-orange-100 p-3 rounded-lg w-fit mb-4">
              <ApperIcon name="Palette" className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Color Tools</h3>
            <p className="text-sm text-secondary">
              Advanced color picker with gradients, patterns, and color matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomStudio;