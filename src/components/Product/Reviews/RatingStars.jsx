
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating, size = 5, className = "" }) => {
  // rating can be 0..5 (e.g., 4.3)
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = size - full - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(full)].map((_, i) => (
        <Star key={`f-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalf && <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e-${i}`} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
      ))}
    </div>
  );
};


export default RatingStars