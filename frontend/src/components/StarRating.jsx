import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ currentRating, onRatingSubmit }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none transition-transform hover:scale-110"
          onClick={() => onRatingSubmit(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            className={`w-8 h-8 ${
              star <= (hover || currentRating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
            } transition-colors duration-150 drop-shadow-sm`}
          />
        </button>
      ))}
    </div>
  );
};
