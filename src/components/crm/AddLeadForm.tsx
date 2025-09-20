import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddLeadFormProps {
  onSuccess: () => void;
}

export function AddLeadForm({ onSuccess }: AddLeadFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    destination_type: "",
    pickup: "",
    drop_location: "",
    travel_date_from: "",
    travel_date_to: "",
    no_of_adults: 1,
    no_of_children: 0,
    budget: "",
    hotel_category: "",
    comments: "",
    priority: "medium",
    source: "website"
  });

  const destinationTypes = [
    "Beach Destinations",
    "Hill Stations", 
    "Adventure Tourism",
    "Cultural Heritage",
    "Wildlife Safari",
    "Spiritual Tourism",
    "International Destinations",
    "Honeymoon Packages",
    "Family Packages",
    "Corporate Tours"
  ];

  const hotelCategories = [
    "Budget (1-2 Star)",
    "Standard (3 Star)",
    "Deluxe (4 Star)",
    "Luxury (5 Star)",
    "Heritage Hotels",
    "Resorts"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("leads")
        .insert([{
          ...formData,
          travel_date_from: formData.travel_date_from || null,
          travel_date_to: formData.travel_date_to || null,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead added successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add lead",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Client Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="destination_type">Destination Type</Label>
          <Select value={formData.destination_type} onValueChange={(value) => handleInputChange("destination_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination type" />
            </SelectTrigger>
            <SelectContent>
              {destinationTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickup">Pickup Location</Label>
          <Input
            id="pickup"
            value={formData.pickup}
            onChange={(e) => handleInputChange("pickup", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="drop_location">Drop Location</Label>
          <Input
            id="drop_location"
            value={formData.drop_location}
            onChange={(e) => handleInputChange("drop_location", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="travel_date_from">Travel Date From</Label>
          <Input
            id="travel_date_from"
            type="date"
            value={formData.travel_date_from}
            onChange={(e) => handleInputChange("travel_date_from", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="travel_date_to">Travel Date To</Label>
          <Input
            id="travel_date_to"
            type="date"
            value={formData.travel_date_to}
            onChange={(e) => handleInputChange("travel_date_to", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="no_of_adults">Number of Adults</Label>
          <Input
            id="no_of_adults"
            type="number"
            min="1"
            value={formData.no_of_adults}
            onChange={(e) => handleInputChange("no_of_adults", parseInt(e.target.value))}
          />
        </div>
        
        <div>
          <Label htmlFor="no_of_children">Number of Children</Label>
          <Input
            id="no_of_children"
            type="number"
            min="0"
            value={formData.no_of_children}
            onChange={(e) => handleInputChange("no_of_children", parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => handleInputChange("budget", e.target.value)}
            placeholder="e.g., ₹50,000 - ₹75,000"
          />
        </div>
        
        <div>
          <Label htmlFor="hotel_category">Hotel Category</Label>
          <Select value={formData.hotel_category} onValueChange={(value) => handleInputChange("hotel_category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select hotel category" />
            </SelectTrigger>
            <SelectContent>
              {hotelCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="source">Source</Label>
          <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="walk_in">Walk-in</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => handleInputChange("comments", e.target.value)}
          placeholder="Any additional notes or requirements..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding Lead..." : "Add Lead"}
        </Button>
      </div>
    </form>
  );
}