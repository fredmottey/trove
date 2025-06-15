import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Star, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RatingSlider from "@/components/RatingSlider";

const AddReview = () => {
  const { toast } = useToast();
  const [restaurantName, setRestaurantName] = useState("");
  const [location, setLocation] = useState("");
  const [review, setReview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [ratings, setRatings] = useState({
    food: 3,
    ambiance: 3,
    service: 3,
    vibe: 3
  });

  const suggestedTags = [
    "Date Night", "Brunch", "Quick Bite", "Family Friendly", "Romantic",
    "Casual", "Upscale", "Good for Groups", "Outdoor Seating", "Great View",
    "Vegetarian Options", "Spicy", "Sweet", "Instagram-worthy", "Hidden Gem"
  ];

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleSubmit = () => {
    if (!restaurantName || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in the restaurant name and location.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Review Posted!",
      description: "Your review has been shared with your friends.",
    });

    // Reset form
    setRestaurantName("");
    setLocation("");
    setReview("");
    setTags([]);
    setRatings({ food: 3, ambiance: 3, service: 3, vibe: 3 });
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h1>

      <div className="space-y-6">
        {/* Photo Upload */}
        <Card className="border-dashed border-2 border-orange-200 hover:border-orange-300 transition-colors">
          <CardContent className="p-8 text-center">
            <Camera className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Add photos of your experience</p>
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              Choose Photos
            </Button>
          </CardContent>
        </Card>

        {/* Restaurant Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              Restaurant Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Restaurant name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="border-orange-200 focus:border-orange-500"
            />
            <Input
              placeholder="Location (City, State)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-orange-200 focus:border-orange-500"
            />
          </CardContent>
        </Card>

        {/* Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Star className="w-5 h-5 mr-2 text-orange-500" />
              Rate Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RatingSlider
              label="Food Quality"
              value={ratings.food}
              onChange={(value) => setRatings({...ratings, food: value})}
            />
            <RatingSlider
              label="Ambiance"
              value={ratings.ambiance}
              onChange={(value) => setRatings({...ratings, ambiance: value})}
            />
            <RatingSlider
              label="Service"
              value={ratings.service}
              onChange={(value) => setRatings({...ratings, service: value})}
            />
            <RatingSlider
              label="Vibe"
              value={ratings.vibe}
              onChange={(value) => setRatings({...ratings, vibe: value})}
            />
          </CardContent>
        </Card>

        {/* Review Text */}
        <Card>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Share your thoughts... What made this place special? Any tips for other diners?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-24 border-orange-200 focus:border-orange-500 resize-none"
            />
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Tags ({tags.length}/5)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white pr-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Custom Tag */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add custom tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="border-orange-200 focus:border-orange-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNewTag()}
              />
              <Button
                onClick={handleAddNewTag}
                disabled={!newTag.trim() || tags.length >= 5}
                size="icon"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Suggested Tags */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Suggested:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags
                  .filter(tag => !tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer border-orange-200 hover:bg-orange-50 text-orange-700"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg"
        >
          Share Review
        </Button>
      </div>
    </div>
  );
};

export default AddReview;
