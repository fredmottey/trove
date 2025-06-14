
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilterSheet = ({ open, onOpenChange }: FilterSheetProps) => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([1, 4]);
  const [distance, setDistance] = useState([5]);

  const cuisines = [
    "Italian", "Japanese", "Mexican", "Thai", "Indian", "French", 
    "Chinese", "Mediterranean", "American", "Korean", "Vietnamese", "Greek"
  ];

  const occasions = [
    "Date Night", "Brunch", "Quick Bite", "Family Dinner", 
    "Business Lunch", "Late Night", "Happy Hour", "Celebration"
  ];

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Filter Discoveries
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto h-full pb-20">
          {/* Cuisine Types */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedCuisines.includes(cuisine)
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      : "border-orange-200 hover:bg-orange-50"
                  }`}
                  onClick={() => toggleCuisine(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="px-3">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>$</span>
                <span>$$</span>
                <span>$$$</span>
                <span>$$$$</span>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Distance: {distance[0]} miles
            </h3>
            <div className="px-3">
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={25}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Occasions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Perfect For</h3>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occasion) => (
                <Badge
                  key={occasion}
                  variant="outline"
                  className="cursor-pointer border-orange-200 hover:bg-orange-50"
                >
                  {occasion}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Clear All
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" onClick={() => onOpenChange(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
