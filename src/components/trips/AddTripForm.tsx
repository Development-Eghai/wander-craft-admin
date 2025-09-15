import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Save, 
  Eye, 
  Send,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import { toast } from "sonner";

// Import tab components
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { ItineraryTab } from "./tabs/ItineraryTab";
import { MediaTab } from "./tabs/MediaTab";
import { PricingTab } from "./tabs/PricingTab";
import { DetailsTab } from "./tabs/DetailsTab";
import { PoliciesTab } from "./tabs/PoliciesTab";

const tabs = [
  { id: "basic", label: "Basic Info", icon: Info },
  { id: "itinerary", label: "Itinerary", icon: CheckCircle2 },
  { id: "media", label: "Media", icon: Eye },
  { id: "pricing", label: "Pricing", icon: Save },
  { id: "details", label: "Details", icon: AlertCircle },
  { id: "policies", label: "Policies", icon: Send }
];

export function AddTripForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    tripTitle: "",
    tripOverview: "",
    destination: "",
    destinationType: "domestic",
    categories: [],
    tripTheme: [],
    hotelCategory: 3,
    pickupLocation: "",
    dropLocation: "",
    days: 5,
    nights: 4,
    
    // Itinerary
    itinerary: [],
    
    // Media
    heroImage: null,
    gallery: [],
    
    // Pricing
    pricingModel: "fixed",
    slots: [],
    packages: [],
    basePrice: 0,
    discountedPrice: 0,
    
    // Details
    highlights: [],
    inclusions: [],
    exclusions: [],
    faqs: [],
    
    // Policies
    termsConditions: "",
    privacyPolicy: "",
    paymentTerms: "",
    customPolicies: []
  });

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const markTabComplete = (tabId: string) => {
    if (!completedTabs.includes(tabId)) {
      setCompletedTabs(prev => [...prev, tabId]);
    }
  };

  const progress = (completedTabs.length / tabs.length) * 100;

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save trip data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a unique trip ID (in real app, this would come from the API response)
      const tripId = Math.random().toString(36).substring(2, 8);
      
      toast.success("Trip published successfully!");
      
      // Navigate to the published trip page
      navigate(`/trip/${tripId}`);
    } catch (error) {
      toast.error("Failed to publish trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add New Trip</h1>
          <p className="text-muted-foreground">Create a comprehensive travel package</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Progress</p>
            <p className="text-xs text-muted-foreground">{completedTabs.length} of {tabs.length} completed</p>
          </div>
          <div className="w-20">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid grid-cols-6 h-auto p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {completedTabs.includes(tab.id) && (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              <TabsContent value="basic" className="mt-0">
                <BasicInfoTab 
                  data={formData}
                  updateData={updateFormData}
                  onComplete={() => markTabComplete("basic")}
                />
              </TabsContent>

              <TabsContent value="itinerary" className="mt-0">
                <ItineraryTab 
                  data={formData}
                  updateData={updateFormData}
                  onComplete={() => markTabComplete("itinerary")}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <MediaTab 
                  data={formData}
                  updateData={updateFormData}
                  onComplete={() => markTabComplete("media")}
                />
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                <PricingTab 
                  data={formData}
                  updateData={updateFormData}
                  onComplete={() => markTabComplete("pricing")}
                />
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <DetailsTab 
                  data={formData}
                  updateData={updateFormData}
                  onComplete={() => markTabComplete("details")}
                />
              </TabsContent>

              <TabsContent value="policies" className="mt-0">
                <PoliciesTab 
                  data={formData}
                  updateData={updateFormData}
                  onComplete={() => markTabComplete("policies")}
                />
              </TabsContent>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{completedTabs.length}/{tabs.length} sections complete</Badge>
                {progress === 100 && (
                  <Badge className="bg-green-500">Ready to publish</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  disabled={progress < 100 || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handlePublish}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Publishing..." : "Publish Trip"}
                </Button>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}