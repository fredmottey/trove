
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MapPin, Users, Trophy, Heart } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("reviews");

  const userStats = {
    reviews: 47,
    saved: 127,
    followers: 234,
    following: 189,
    badges: ["Foodie Explorer", "Local Guide", "Photo Pro"]
  };

  const recentReviews = [
    {
      id: 1,
      restaurant: "Nobu Malibu",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
      rating: 4.8,
      date: "2 days ago"
    },
    {
      id: 2,
      restaurant: "Republique",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
      rating: 4.5,
      date: "1 week ago"
    }
  ];

  const tasteProfile = [
    { cuisine: "Japanese", percentage: 85 },
    { cuisine: "Italian", percentage: 78 },
    { cuisine: "Mexican", percentage: 65 },
    { cuisine: "Thai", percentage: 58 },
    { cuisine: "French", percentage: 52 }
  ];

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <Button variant="outline" size="icon" className="rounded-full border-orange-200 hover:bg-orange-50">
            <Settings className="h-4 w-4 text-orange-600" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-br from-orange-100 to-red-100 text-orange-700 text-2xl">
              AC
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Alex Chen</h2>
            <p className="text-gray-600">@alexeats</p>
            <p className="text-sm text-gray-500 mt-1">
              🍜 Food explorer • 📍 Los Angeles, CA
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">{userStats.reviews}</div>
            <div className="text-xs text-gray-600">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{userStats.saved}</div>
            <div className="text-xs text-gray-600">Saved</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{userStats.followers}</div>
            <div className="text-xs text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{userStats.following}</div>
            <div className="text-xs text-gray-600">Following</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {userStats.badges.map((badge) => (
            <Badge key={badge} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <Trophy className="w-3 h-3 mr-1" />
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="taste">Taste Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          {recentReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <img
                    src={review.image}
                    alt={review.restaurant}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.restaurant}</h3>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm font-bold text-orange-600">{review.rating}</div>
                        <Heart className="w-4 h-4 text-red-500 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <p className="text-gray-600">Your saved spots will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Taste Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasteProfile.map((item) => (
                <div key={item.cuisine} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.cuisine}</span>
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
