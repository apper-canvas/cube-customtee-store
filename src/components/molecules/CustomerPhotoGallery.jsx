import React, { useState, useEffect } from 'react';
import { socialProofService } from '@/services/api/socialProofService';
import ApperIcon from '@/components/ApperIcon';
import StarRating from '@/components/molecules/StarRating';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

function CustomerPhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadCustomerPhotos();
  }, []);

  const loadCustomerPhotos = async () => {
    try {
      setLoading(true);
      const customerPhotos = await socialProofService.getCustomerPhotos();
      setPhotos(customerPhotos);
    } catch (err) {
      setError('Failed to load customer photos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCustomerPhotos} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real Customers, Real Results</h2>
        <p className="text-gray-600">See how our customers are rocking their custom designs!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={photo.image} 
                alt={`${photo.customerName} wearing custom shirt`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <ApperIcon name="Heart" size={16} className="text-red-500" />
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{photo.customerName}</h3>
                  <p className="text-sm text-gray-600">{photo.location}</p>
                </div>
                <StarRating rating={photo.rating} size="xs" />
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Shirt" size={16} />
                <span>"{photo.design}" design</span>
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-2">
                "{photo.testimonial}"
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {new Date(photo.orderDate).toLocaleDateString()}
                </span>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View Design
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for expanded view */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedPhoto.image} 
                alt={`${selectedPhoto.customerName} wearing custom shirt`}
                className="w-full h-80 object-cover"
              />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPhoto.customerName}</h3>
                  <p className="text-gray-600">{selectedPhoto.location}</p>
                </div>
                <div className="text-right">
                  <StarRating rating={selectedPhoto.rating} size="sm" />
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedPhoto.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <ApperIcon name="Shirt" size={20} />
                <span className="font-medium">"{selectedPhoto.design}" design</span>
              </div>
              
              <blockquote className="text-gray-700 italic border-l-4 border-blue-500 pl-4">
                "{selectedPhoto.testimonial}"
              </blockquote>
              
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img 
                    src={selectedPhoto.productImage} 
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Custom T-Shirt</p>
                  <p className="text-sm text-gray-600">High-quality printing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerPhotoGallery;