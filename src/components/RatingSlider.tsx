
import { Slider } from "@/components/ui/slider";

interface RatingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingSlider = ({ label, value, onChange }: RatingSliderProps) => {
  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Great";
      case 5: return "Excellent";
      default: return "Good";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-orange-600">
          {value} - {getRatingText(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={5}
        min={1}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default RatingSlider;
