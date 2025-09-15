import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Star } from "lucide-react";

interface BasicInfoTabProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onComplete: () => void;
}

const mockDestinations = [
  "Goa", "Kerala", "Rajasthan", "Himachal Pradesh", "Kashmir", "Uttarakhand",
  "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh"
];

const categoryOptions = [
  "Honeymoon Packages",
  "Family Packages", 
  "Friends",
  "Group Packages",
  "Solo Trips",
  "All-Girls Trips",
  "All-Boys Trips",
  "Volunteer Trips"
];

const themeOptions = [
  "Adventure",
  "Nature", 
  "Religious",
  "Wildlife",
  "Water Activities"
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur"
];

export function BasicInfoTab({ data, updateData, onComplete }: BasicInfoTabProps) {
  const [localData, setLocalData] = useState({
    tripTitle: data.tripTitle || "",
    tripOverview: data.tripOverview || "",
    destination: data.destination || "",
    destinationType: data.destinationType || "domestic",
    categories: data.categories || [],
    tripTheme: data.tripTheme || [],
    hotelCategory: data.hotelCategory || 3,
    pickupLocation: data.pickupLocation || "",
    dropLocation: data.dropLocation || "",
    days: data.days || 5,
    nights: data.nights || 4
  });

  const handleLocalUpdate = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    const updated = localData.categories.includes(category)
      ? localData.categories.filter((c: string) => c !== category)
      : [...localData.categories, category];
    handleLocalUpdate("categories", updated);
  };

  const handleThemeToggle = (theme: string) => {
    const updated = localData.tripTheme.includes(theme)
      ? localData.tripTheme.filter((t: string) => t !== theme)
      : [...localData.tripTheme, theme];
    handleLocalUpdate("tripTheme", updated);
  };

  const handleDaysChange = (days: number) => {
    handleLocalUpdate("days", days);
    // Automatically set nights to be one less than days
    if (days > 0) {
      handleLocalUpdate("nights", Math.max(0, days - 1));
    }
  };

  const isFormValid = () => {
    return localData.tripTitle.length > 0 &&
           localData.tripOverview.length > 0 &&
           localData.destination &&
           localData.categories.length > 0 &&
           localData.tripTheme.length > 0 &&
           localData.pickupLocation &&
           localData.dropLocation &&
           localData.days > 0;
  };

  useEffect(() => {
    updateData("basic", localData);
    if (isFormValid()) {
      onComplete();
    }
  }, [localData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tripTitle">Trip Title *</Label>
                <Input
                  id="tripTitle"
                  value={localData.tripTitle}
                  onChange={(e) => handleLocalUpdate("tripTitle", e.target.value)}
                  placeholder="Enter trip title (max 100 characters)"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {localData.tripTitle.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="tripOverview">Trip Overview *</Label>
                <Textarea
                  id="tripOverview"
                  value={localData.tripOverview}
                  onChange={(e) => handleLocalUpdate("tripOverview", e.target.value)}
                  placeholder="Describe the trip overview..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Select value={localData.destination} onValueChange={(value) => handleLocalUpdate("destination", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDestinations.map((dest) => (
                        <SelectItem key={dest} value={dest}>
                          {dest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Destination Type *</Label>
                  <RadioGroup
                    value={localData.destinationType}
                    onValueChange={(value) => handleLocalUpdate("destinationType", value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="domestic" id="domestic" />
                      <Label htmlFor="domestic">Domestic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="international" id="international" />
                      <Label htmlFor="international">International</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Select value={localData.pickupLocation} onValueChange={(value) => handleLocalUpdate("pickupLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dropLocation">Drop Location *</Label>
                  <Select value={localData.dropLocation} onValueChange={(value) => handleLocalUpdate("dropLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="days">Days *</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    value={localData.days}
                    onChange={(e) => handleDaysChange(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="nights">Nights *</Label>
                  <Input
                    id="nights"
                    type="number"
                    min="0"
                    value={localData.nights}
                    onChange={(e) => handleLocalUpdate("nights", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Example: 5 Days 4 Nights (Nights should be less than Days)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryOptions.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={localData.categories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={category} className="text-sm font-normal">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              {localData.categories.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {localData.categories.map((category: string) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleCategoryToggle(category)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Theme *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {themeOptions.map((theme) => (
                  <div key={theme} className="flex items-center space-x-2">
                    <Checkbox
                      id={theme}
                      checked={localData.tripTheme.includes(theme)}
                      onCheckedChange={() => handleThemeToggle(theme)}
                    />
                    <Label htmlFor={theme} className="text-sm font-normal">
                      {theme}
                    </Label>
                  </div>
                ))}
              </div>
              {localData.tripTheme.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected Themes:</p>
                  <div className="flex flex-wrap gap-2">
                    {localData.tripTheme.map((theme: string) => (
                      <Badge key={theme} variant="secondary" className="text-xs">
                        {theme}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleThemeToggle(theme)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hotel Category *</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={localData.hotelCategory.toString()}
                onValueChange={(value) => handleLocalUpdate("hotelCategory", parseInt(value))}
                className="space-y-3"
              >
                {[1, 2, 3, 4, 5].map((stars) => (
                  <div key={stars} className="flex items-center space-x-2">
                    <RadioGroupItem value={stars.toString()} id={`${stars}-star`} />
                    <Label htmlFor={`${stars}-star`} className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        {Array.from({ length: 5 - stars }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-300" />
                        ))}
                      </div>
                      <span>{stars} Star{stars > 1 ? 's' : ''}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Validation Status */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Form Status</p>
              <p className="text-sm text-muted-foreground">
                {isFormValid() ? "All required fields completed" : "Please complete all required fields"}
              </p>
            </div>
            <Badge variant={isFormValid() ? "default" : "secondary"}>
              {isFormValid() ? "Complete" : "Incomplete"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}