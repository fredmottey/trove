
import { Home, Map, User, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Feed" },
    { path: "/map", icon: Map, label: "Map" },
    { path: "/add-review", icon: Plus, label: "Add", isSpecial: true },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-orange-100 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl transition-all duration-200",
                item.isSpecial 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : isActive 
                    ? "bg-orange-100 text-orange-600" 
                    : "text-gray-500 hover:text-orange-500"
              )}
            >
              <Icon size={item.isSpecial ? 28 : 24} className={item.isSpecial ? "mb-1" : ""} />
              <span className={cn(
                "text-xs font-medium",
                item.isSpecial && "hidden"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
