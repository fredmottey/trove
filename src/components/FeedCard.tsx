
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, MapPin } from "lucide-react";
import RatingBar from "./RatingBar";

interface FeedCardProps {
  post: {
    id: number;
    user: { name: string; avatar: string; username: string };
    restaurant: string;
    image: string;
    location: string;
    tags: string[];
    ratings: { food: number; ambiance: number; service: number; vibe: number };
    review: string;
    timestamp: string;
    likes: number;
    comments: number;
  };
}

const FeedCard = ({ post }: FeedCardProps) => {
  return (
    <Card className="mx-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border-orange-100">
      <CardContent className="p-0">
        {/* User Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-orange-100 to-red-100 text-orange-700">
                {post.user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-gray-900">{post.user.name}</p>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
            Follow
          </Button>
        </div>

        {/* Restaurant Info */}
        <div className="px-4 pb-3">
          <h3 className="font-bold text-lg text-gray-900">{post.restaurant}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {post.location}
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src={post.image}
            alt={post.restaurant}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-black/70 text-white text-xs hover:bg-black/80">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <RatingBar label="Food" rating={post.ratings.food} />
            <RatingBar label="Ambiance" rating={post.ratings.ambiance} />
            <RatingBar label="Service" rating={post.ratings.service} />
            <RatingBar label="Vibe" rating={post.ratings.vibe} />
          </div>
        </div>

        {/* Review Text */}
        <div className="px-4 pb-3">
          <p className="text-gray-800 text-sm leading-relaxed">{post.review}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500 hover:bg-red-50 p-2">
              <Heart className="w-5 h-5 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500 hover:bg-blue-50 p-2">
              <MessageCircle className="w-5 h-5 mr-1" />
              {post.comments}
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 p-2">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
