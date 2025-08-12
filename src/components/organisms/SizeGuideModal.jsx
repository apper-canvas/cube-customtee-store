import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const sizeData = {
  "Classic Fit": {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    measurements: {
      XS: { chest: "31-34", length: "27", shoulder: "16.5" },
      S: { chest: "34-37", length: "28", shoulder: "17.5" },
      M: { chest: "38-41", length: "29", shoulder: "18.5" },
      L: { chest: "42-45", length: "30", shoulder: "19.5" },
      XL: { chest: "46-49", length: "31", shoulder: "20.5" },
      XXL: { chest: "50-53", length: "32", shoulder: "21.5" }
    }
  },
  "Slim Fit": {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    measurements: {
      XS: { chest: "30-33", length: "26.5", shoulder: "16" },
      S: { chest: "33-36", length: "27.5", shoulder: "17" },
      M: { chest: "37-40", length: "28.5", shoulder: "18" },
      L: { chest: "41-44", length: "29.5", shoulder: "19" },
      XL: { chest: "45-48", length: "30.5", shoulder: "20" },
      XXL: { chest: "49-52", length: "31.5", shoulder: "21" }
    }
  },
  "Oversized": {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    measurements: {
      XS: { chest: "38-41", length: "28", shoulder: "18" },
      S: { chest: "42-45", length: "29", shoulder: "19" },
      M: { chest: "46-49", length: "30", shoulder: "20" },
      L: { chest: "50-53", length: "31", shoulder: "21" },
      XL: { chest: "54-57", length: "32", shoulder: "22" },
      XXL: { chest: "58-61", length: "33", shoulder: "23" }
    }
  },
  "Tank Top": {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    measurements: {
      XS: { chest: "31-34", length: "25", shoulder: "14" },
      S: { chest: "34-37", length: "26", shoulder: "15" },
      M: { chest: "38-41", length: "27", shoulder: "16" },
      L: { chest: "42-45", length: "28", shoulder: "17" },
      XL: { chest: "46-49", length: "29", shoulder: "18" },
      XXL: { chest: "50-53", length: "30", shoulder: "19" }
    }
  }
};

const SizeGuideModal = ({ isOpen, onClose }) => {
// Lock body scroll when modal opens
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
                <p className="text-sm text-gray-600 mt-1">
                  All measurements are in inches
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-8">
                {Object.entries(sizeData).map(([style, data]) => (
                  <div key={style} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {style}
                    </h3>
                    
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">
                              Size
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">
                              Chest (in)
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">
                              Length (in)
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">
                              Shoulder (in)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.sizes.map((size) => (
                            <tr key={size} className="border-b border-gray-200 hover:bg-white">
                              <td className="py-3 px-4 font-medium text-gray-900">
                                {size}
                              </td>
                              <td className="py-3 px-4 text-gray-700">
                                {data.measurements[size].chest}
                              </td>
                              <td className="py-3 px-4 text-gray-700">
                                {data.measurements[size].length}
                              </td>
                              <td className="py-3 px-4 text-gray-700">
                                {data.measurements[size].shoulder}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {data.sizes.map((size) => (
                        <div key={size} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-semibold text-gray-900 mb-3 text-lg">
                            Size {size}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Chest</div>
                              <div className="font-medium text-gray-900">
                                {data.measurements[size].chest}"
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Length</div>
                              <div className="font-medium text-gray-900">
                                {data.measurements[size].length}"
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Shoulder</div>
                              <div className="font-medium text-gray-900">
                                {data.measurements[size].shoulder}"
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Measurement Guide */}
              <div className="mt-8 bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">
                  How to Measure
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                  <div>
                    <div className="font-medium mb-2">Chest</div>
                    <p>Measure around the fullest part of your chest, under your armpits.</p>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Length</div>
                    <p>Measure from the highest point of the shoulder to the bottom hem.</p>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Shoulder</div>
                    <p>Measure from shoulder seam to shoulder seam across the back.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <Button onClick={onClose} variant="primary">
                Got it, thanks!
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideModal;