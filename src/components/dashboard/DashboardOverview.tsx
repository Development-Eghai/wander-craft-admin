import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Package,
  Building2,
  MapPin,
  Car,
  ArrowUp,
  ArrowDown,
  Plus,
  Eye
} from "lucide-react";

const stats = [
  {
    title: "Total Leads",
    value: "1,234",
    change: "+12% from last month",
    positive: true,
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Active Bookings", 
    value: "89",
    change: "+8% from last month",
    positive: true,
    icon: Calendar,
    color: "text-green-600"
  },
  {
    title: "Revenue (Month)",
    value: "₹5,67,890",
    change: "+15% from last month", 
    positive: true,
    icon: DollarSign,
    color: "text-purple-600"
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "+2.1% from last month",
    positive: true,
    icon: TrendingUp,
    color: "text-orange-600"
  }
];

const inventoryData = [
  { title: "Trip Packages", count: "142 active of 156 total", icon: Package },
  { title: "Hotels Listed", count: "83 active of 89 total", icon: Building2 },
  { title: "Activities", count: "221 active of 234 total", icon: MapPin },
  { title: "Cab Services", count: "62 active of 65 total", icon: Car }
];

const recentLeads = [
  { name: "Priya Sharma", status: "Hot", package: "Goa - Family Package", amount: "₹45,000", statusColor: "bg-red-500" },
  { name: "Rahul Kumar", status: "Warm", package: "Kerala - Honeymoon", amount: "₹75,000", statusColor: "bg-yellow-500" },
  { name: "Amit Patel", status: "Confirmed", package: "Rajasthan - Cultural Tour", amount: "₹1,20,000", statusColor: "bg-green-500" },
  { name: "Sneha Gupta", status: "Hot", package: "Himachal - Adventure", amount: "₹85,000", statusColor: "bg-red-500" }
];

const quickActions = [
  { title: "Add Trip", icon: Plus, color: "bg-blue-500" },
  { title: "Add Hotel", icon: Building2, color: "bg-green-500" },
  { title: "New Lead", icon: Users, color: "bg-purple-500" },
  { title: "Create Offer", icon: DollarSign, color: "bg-orange-500" },
  { title: "Send Quote", icon: Package, color: "bg-pink-500" },
  { title: "View Reports", icon: Eye, color: "bg-indigo-500" }
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">{stat.title}</p>
                  <p className="stat-value mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.positive ? (
                      <ArrowUp className="h-3 w-3 text-stat-positive mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-stat-negative mr-1" />
                    )}
                    <span className={`stat-change ${stat.positive ? 'text-stat-positive' : 'text-stat-negative'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-accent ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Inventory Overview</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Your travel inventory at a glance</p>
            {inventoryData.map((item) => (
              <div key={item.title} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.count}</p>
                  <Button variant="link" className="h-auto p-0 text-xs text-primary">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Latest inquiries and their status</p>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${lead.statusColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.package}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-medium">{lead.amount}</span>
                      <Button variant="link" className="h-auto p-0 text-xs text-primary">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}