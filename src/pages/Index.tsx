
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Filter, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import FeedCard from "@/components/FeedCard";
import FilterSheet from "@/components/FilterSheet";

const Index = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const feedData = [
    {
      id: 1,
      user: { name: "Alex Chen", avatar: "/placeholder.svg", username: "@alexeats" },
      restaurant: "Nobu Malibu",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=400&fit=crop",
      location: "Malibu, CA",
      tags: ["Japanese", "Sushi", "Date Night"],
      ratings: { food: 5, ambiance: 4, service: 5, value: 3, vibe: 5 },
      review: "Absolutely incredible omakase experience! The yellowtail sashimi was perfection. Book the sunset table if you can - the view is unmatched.",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      user: { name: "Maria Rodriguez", avatar: "/placeholder.svg", username: "@mariafoodie" },
      restaurant: "Republique",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop",
      location: "Los Angeles, CA",
      tags: ["French", "Brunch", "Coffee"],
      ratings: { food: 4, ambiance: 5, service: 4, value: 4, vibe: 4 },
      review: "Perfect brunch spot! The pastries are house-made and the coffee is exceptional. Gets busy on weekends but worth the wait.",
      timestamp: "1 day ago",
      likes: 18,
      comments: 5
    }
  ];

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            TastePal
          </h1>
          <p className="text-gray-600 text-sm">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(true)}
            className="rounded-full border-orange-200 hover:bg-orange-50"
          >
            <Filter className="h-4 w-4 text-orange-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSignOut}
            className="rounded-full border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>

      {/* Stories Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Discoveries</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {['Sarah', 'Mike', 'Jenny', 'David', 'Lisa'].map((name, i) => (
            <div key={name} className="flex flex-col items-center space-y-1 min-w-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-100 to-red-100 text-orange-700">
                      {name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {feedData.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>

      <FilterSheet open={showFilters} onOpenChange={setShowFilters} />
    </div>
  );
};

export default Index;
