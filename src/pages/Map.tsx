
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, List, Filter } from "lucide-react";
import FilterSheet from "@/components/FilterSheet";

const Map = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(false);

  const savedSpots = [
    {
      id: 1,
      name: "Nobu Malibu",
      cuisine: "Japanese",
      location: "Malibu, CA",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop",
      rating: 4.8,
      tags: ["Sushi", "Date Night", "Ocean View"],
      visited: true
    },
    {
      id: 2,
      name: "Republique",
      cuisine: "French",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
      rating: 4.5,
      tags: ["Brunch", "Coffee", "Pastries"],
      visited: true
    },
    {
      id: 3,
      name: "Night + Market",
      cuisine: "Thai",
      location: "West Hollywood, CA",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop",
      rating: 4.6,
      tags: ["Spicy", "Casual", "Group Dining"],
      visited: false
    }
  ];

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Spots</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(true)}
            className="rounded-full border-orange-200 hover:bg-orange-50"
          >
            <Filter className="h-4 w-4 text-orange-600" />
          </Button>
          <div className="flex bg-gray-100 rounded-full p-1">
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className={`rounded-full px-3 ${viewMode === 'map' ? 'bg-gradient-to-r from-orange-500 to-red-500' : ''}`}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Map
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-full px-3 ${viewMode === 'list' ? 'bg-gradient-to-r from-orange-500 to-red-500' : ''}`}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around px-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">127</div>
          <div className="text-sm text-gray-600">Saved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">89</div>
          <div className="text-sm text-gray-600">Visited</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">38</div>
          <div className="text-sm text-gray-600">To Try</div>
        </div>
      </div>

      {viewMode === 'map' ? (
        /* Map View */
        <div className="mx-4 mb-6">
          <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <p className="text-gray-600">Interactive map coming soon!</p>
              <p className="text-sm text-gray-500 mt-1">Your saved spots will be plotted here</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* List View */}
      <div className="space-y-3 px-4">
        {savedSpots.map((spot) => (
          <Card key={spot.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-orange-100">
            <CardContent className="p-0">
              <div className="flex">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                      <p className="text-sm text-gray-600">{spot.cuisine} • {spot.location}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm font-bold text-orange-600">{spot.rating}</div>
                      <div className="w-2 h-2 rounded-full bg-orange-400 ml-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {spot.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-orange-50 text-orange-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Badge 
                      variant={spot.visited ? "default" : "outline"}
                      className={spot.visited 
                        ? "bg-green-100 text-green-700 hover:bg-green-100" 
                        : "border-orange-200 text-orange-600"
                      }
                    >
                      {spot.visited ? "Visited" : "To Try"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FilterSheet open={showFilters} onOpenChange={setShowFilters} />
    </div>
  );
};

export default Map;
