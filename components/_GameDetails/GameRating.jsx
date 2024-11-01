import { FaStar } from 'react-icons/fa';

const GameRating = ({
  isEditing,
  rating,
  hoverRating,
  handleRatingClick,
  handleRatingHover,
  handleRatingHoverOut,
}) => {
  return (
    <div className='flex items-center gap-4'>
      <strong className={isEditing ? 'text-red-600' : ''}>Rating:</strong>
      {isEditing ? (
        <div className='flex space-x-1'>
          {[...Array(10)].map((_, index) => {
            const starIndex = index + 1;
            return (
              <FaStar
                key={starIndex}
                className={`cursor-pointer ${
                  starIndex <= (hoverRating || rating)
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
                onClick={() => handleRatingClick(starIndex)}
                onMouseEnter={() => handleRatingHover(starIndex)}
                onMouseLeave={handleRatingHoverOut}
              />
            );
          })}
        </div>
      ) : (
        <div className='flex space-x-1'>
          {[...Array(10)].map((_, index) => {
            const starIndex = index + 1;
            return (
              <FaStar
                key={starIndex}
                className={`${
                  starIndex <= rating ? 'text-red-600' : 'text-gray-500'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GameRating;
