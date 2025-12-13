
import { Truck, RotateCcw, Shield } from 'lucide-react'

const ProductFeatures = () => {
  return (
      <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Free Delivery</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Orders over $50</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Easy Returns</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">7 days policy</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">100% Original</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Guaranteed</p>
                </div>
              </div>
              
            </div>
      </>
  )
}

export default ProductFeatures