import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Star, Download, Share2, Phone } from "lucide-react";
import { toast } from "sonner";

// Mock data structure - in real app this would come from a database/API
const mockTripData = {
  id: "1",
  basicInfo: {
    title: "7 Days Adventure Bali Trip Package",
    overview: "Experience the magic of Bali with our comprehensive 7-day adventure package featuring stunning beaches, cultural temples, and thrilling water sports activities.",
    destination: "Bali, Indonesia",
    destinationType: "International",
    categories: ["Honeymoon Packages", "Friends", "Adventure"],
    tripTheme: ["Adventure", "Nature", "Water Activities"],
    hotelCategory: "4",
    pickupLocation: "Denpasar Airport",
    dropLocation: "Denpasar Airport",
    days: 7,
    nights: 6
  },
  itinerary: [
    {
      day: 1,
      title: "Arrival at Denpasar Airport",
      image: "/placeholder-image.jpg",
      description: "Welcome to Bali! Upon arrival at Ngurah Rai International Airport, you'll be transferred to your hotel. Check-in and relax after your journey. Evening at leisure to explore nearby areas.",
      activities: ["Airport Transfer", "Hotel Check-in", "Welcome Briefing"],
      accommodation: {
        hotelName: "Grand Hyatt Bali",
        mealPlan: ["Breakfast"]
      }
    }
  ],
  media: {
    heroImage: "/placeholder-hero.jpg",
    gallery: ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg"]
  },
  pricing: {
    model: "customized", // "fixed" or "customized"
    priceType: "per-person", // "per-person" or "per-package"
    basePrice: 25000,
    discountedPrice: 21999,
    finalPrice: 21999,
    slots: [],
    packages: []
  },
  details: {
    highlights: ["Temple visits", "Beach activities", "Cultural experiences", "Adventure sports"],
    inclusions: ["Accommodation", "Meals as per itinerary", "Transportation", "Guide services"],
    exclusions: ["International flights", "Personal expenses", "Tips", "Travel insurance"],
    faqs: [
      {
        question: "What is the best time to visit Bali?",
        answer: "April to October is considered the best time to visit Bali due to dry weather."
      }
    ]
  },
  policies: {
    termsAndConditions: "Terms and conditions apply for all bookings...",
    privacyPolicy: "Your privacy is important to us...",
    paymentTerms: "Payment terms and conditions...",
    customFields: []
  }
};

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showEnquiryDialog, setShowEnquiryDialog] = useState(false);
  
  // In real app, fetch trip data based on ID
  const trip = mockTripData;

  const handleDownloadItinerary = () => {
    toast.success("Itinerary download started!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Trip link copied to clipboard!");
  };

  const handleBookingSubmit = () => {
    toast.success("Booking request submitted successfully!");
    setShowBookingDialog(false);
  };

  const handleEnquirySubmit = () => {
    toast.success("Enquiry submitted successfully! We'll contact you soon.");
    setShowEnquiryDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white space-y-4 max-w-4xl">
            <div className="flex justify-center gap-4 mb-4">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleDownloadItinerary}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Itinerary
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Info Bar */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-3xl font-bold text-foreground">{trip.basicInfo.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Pickup & Drop</span>
                </div>
                <span className="text-foreground font-medium">
                  {trip.basicInfo.pickupLocation} - {trip.basicInfo.dropLocation}
                </span>
                
                <div className="flex items-center gap-1 ml-6">
                  <Clock className="h-4 w-4" />
                  <span>Duration</span>
                </div>
                <span className="text-foreground font-medium">
                  {trip.basicInfo.nights}N - {trip.basicInfo.days}D
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {trip.basicInfo.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">{category}</Badge>
                ))}
                {trip.basicInfo.tripTheme.map((theme, index) => (
                  <Badge key={index} variant="outline">{theme}</Badge>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="lg:text-right">
              {trip.pricing.model === "customized" ? (
                <div className="space-y-3">
                  <Badge className="bg-accent text-accent-foreground">Customised</Badge>
                  <p className="text-sm text-muted-foreground">customise your trip with us!</p>
                  <Dialog open={showEnquiryDialog} onOpenChange={setShowEnquiryDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Get Quotes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Enquiry</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="Enter your full name" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="Enter your phone number" />
                        </div>
                        <div>
                          <Label htmlFor="travelers">Number of Travelers</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of travelers" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Person' : 'People'}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea id="message" placeholder="Tell us about your preferences..." />
                        </div>
                        <Button onClick={handleEnquirySubmit} className="w-full">
                          Submit Enquiry
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <div className="text-2xl font-bold text-accent">
                      ₹{trip.pricing.finalPrice.toLocaleString()}/-
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trip.pricing.priceType === "per-person" ? "per person" : "per package"}
                    </p>
                  </div>
                  <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Dates & Costing
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Book Your Trip</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Booking form for fixed departure would go here */}
                        <div className="text-center py-8 text-muted-foreground">
                          Detailed booking form with slots and pricing will be implemented here
                        </div>
                        <Button onClick={handleBookingSubmit} className="w-full">
                          Book Now
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview & Highlights</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
                <TabsTrigger value="info">Other Info</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Trip Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {trip.basicInfo.overview}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Trip Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trip.details.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-accent rounded-full" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-4">
                {trip.itinerary.map((day, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Day {day.day}: {day.title}</h3>
                      <p className="text-muted-foreground mb-4">{day.description}</p>
                      
                      {day.activities.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Activities:</h4>
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, i) => (
                              <Badge key={i} variant="outline">{activity}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        <p><strong>Accommodation:</strong> {day.accommodation.hotelName}</p>
                        <p><strong>Meals:</strong> {day.accommodation.mealPlan.join(", ")}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="inclusions">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                    <div className="space-y-2">
                      {trip.details.inclusions.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exclusions">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">What's Not Included</h3>
                    <div className="space-y-2">
                      {trip.details.exclusions.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-red-500 rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {trip.details.faqs.map((faq, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Policies</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Terms & Conditions</h4>
                        <p className="text-muted-foreground text-sm">{trip.policies.termsAndConditions}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Payment Terms</h4>
                        <p className="text-muted-foreground text-sm">{trip.policies.paymentTerms}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Wanderlust Calling?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Allow Us to Call You Back!
                </p>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Request Callback
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination:</span>
                    <span>{trip.basicInfo.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{trip.basicInfo.days}D/{trip.basicInfo.nights}N</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel Category:</span>
                    <div className="flex items-center">
                      {Array.from({ length: parseInt(trip.basicInfo.hotelCategory) }, (_, i) => (
                        <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{trip.basicInfo.destinationType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}