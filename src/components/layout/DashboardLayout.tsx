import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  Building2, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", path: "/" },
  { 
    icon: Package, 
    label: "Trip Management", 
    id: "trips",
    children: [
      { label: "All Trips", id: "all-trips", path: "/trips" },
      { label: "Categories", id: "categories", path: "/trips/categories" },
      { label: "Add New Trip", id: "add-trip", path: "/trips/add" }
    ]
  },
  { icon: MapPin, label: "Destinations", id: "destinations", path: "/destinations" },
  { icon: Building2, label: "Hotels Listed", id: "hotels", path: "/hotels" },
  { icon: Calendar, label: "Activities", id: "activities", path: "/activities" },
  { icon: Package, label: "Cab Booking", id: "cab-booking", path: "/cab-booking" },
  { icon: Users, label: "Leads", id: "leads", path: "/leads" },
  { icon: MessageSquare, label: "Quotations", id: "quotations", path: "/quotations" },
  { icon: Settings, label: "Settings", id: "settings", path: "/settings" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["trips"]);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    
    // Check for exact matches first
    for (const item of sidebarItems) {
      if (item.path === path) return item.id;
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) return child.id;
        }
      }
    }
    
    // Default to dashboard
    return "dashboard";
  };

  const activeItem = getActiveItem();

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleNavigation = (item: any) => {
    if (item.path) {
      navigate(item.path);
    }
    
    if (item.children) {
      toggleExpanded(item.id);
    }
  };

  const getPageTitle = () => {
    switch(activeItem) {
      case "dashboard": return "Dashboard Overview";
      case "add-trip": return "Add New Trip";
      case "all-trips": return "All Trips";
      case "categories": return "Trip Categories";
      case "destinations": return "Destinations";
      case "hotels": return "Hotels Listed";
      case "activities": return "Activities";
      case "cab-booking": return "Cab Booking";
      case "leads": return "Leads";
      case "quotations": return "Quotations";
      case "settings": return "Settings";
      default: return "Dashboard";
    }
  };

  const getPageDescription = () => {
    switch(activeItem) {
      case "dashboard": return "Welcome back! Here's what's happening with your travel business today";
      case "add-trip": return "Create a new travel package with detailed information";
      case "all-trips": return "Manage all your travel packages and itineraries";
      case "categories": return "Organize your trips by categories and themes";
      default: return "Manage your travel business efficiently";
    }
  };

  return (
    <div className="flex h-screen bg-dashboard-bg">
      {/* Sidebar */}
      <div className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">WanderCraft</h1>
                <p className="text-xs text-sidebar-foreground/60">Travel Solutions</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleNavigation(item)}
                className={cn(
                  "navigation-item w-full justify-start",
                  activeItem === item.id ? "navigation-item-active" : "navigation-item-inactive"
                )}
              >
                <item.icon className={cn("h-4 w-4", collapsed && "mx-auto")} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children && (
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        expandedItems.includes(item.id) && "rotate-90"
                      )} />
                    )}
                  </>
                )}
              </button>
              
              {!collapsed && item.children && expandedItems.includes(item.id) && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleNavigation(child)}
                      className={cn(
                        "navigation-item w-full justify-start text-sm",
                        activeItem === child.id ? "navigation-item-active" : "navigation-item-inactive"
                      )}
                    >
                      {child.label === "Add New Trip" && <Plus className="h-3 w-3" />}
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {getPageTitle()}
              </h2>
              <p className="text-sm text-muted-foreground">
                {getPageDescription()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Download Report
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}