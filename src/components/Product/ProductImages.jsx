
import { useState } from "react";
import { ZoomIn, X } from 'lucide-react';

const ProductImages = ({ images }) => {
      
    const [selectedImage, setSelectedImage] = useState(images[0] || '');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const openLightbox = () => setIsLightboxOpen(true);
    const closeLightbox = () => setIsLightboxOpen(false);

    return (

        <>
            
            {/* Main Image Section */}
            <div className="flex flex-col lg:flex-row gap-4">

                {/* Thumbnails */}
                <div className="flex lg:flex-col gap-3 order-2 lg:order-1 justify-center lg:justify-start overflow-x-auto lg:overflow-visible">

                    { images.map((img, idx) => (

                        <div
                            key={idx}
                            className="relative flex-shrink-0 group cursor-pointer"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                className={`w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-xl border-2 transition-all duration-300 hover:scale-105
                                    ${selectedImage === img 
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-400'
                                }`}
                            />

                            <div
                                className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                                    selectedImage === img ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                                }`}
                            />

                        </div>

                     ))}

                </div>

                {/* Main Image */}
                <div className="relative order-1 lg:order-2 flex-1 max-w-2xl mx-auto">

                    <div
                        onClick={openLightbox}
                        className="relative group cursor-zoom-in bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl"
                    >

                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="w-full h-[400px] lg:h-[600px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute bottom-6 right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>

                    </div>

                </div>

            </div>

            {/* Fullscreen Modal */}
            {isLightboxOpen && (

                <div
                    className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm flex justify-center items-center p-4"
                    onClick={closeLightbox}
                >
                    <img
                        src={selectedImage}
                        alt="Full"
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    />

                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
                    >
                        <X className="w-6 h-6" />
                    </button>

                </div>

            )}

        </>
        
    );  
      
};
export default ProductImages