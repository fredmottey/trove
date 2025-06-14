
interface RatingBarProps {
  label: string;
  rating: number;
  maxRating?: number;
}

const RatingBar = ({ label, rating, maxRating = 5 }: RatingBarProps) => {
  const percentage = (rating / maxRating) * 100;
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium text-gray-600 w-16">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-800 w-6">{rating}</span>
    </div>
  );
};

export default RatingBar;
