import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Plus, X, IndianRupee, Users, Calendar as CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PricingTabProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onComplete: () => void;
}

interface DateSlot {
  id: string;
  fromDate: Date | null;
  toDate: Date | null;
  availableSlots: number;
}

interface PricingPackage {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  discount: number;
  finalPrice: number;
  bookingAmount: number;
  gstPercentage: number;
}

export function PricingTab({ data, updateData, onComplete }: PricingTabProps) {
  const [localData, setLocalData] = useState({
    pricingModel: data.pricingModel || "fixed",
    // Fixed Departure
    dateSlots: data.dateSlots || [],
    packages: data.packages || [],
    // Customized Trip
    priceType: data.priceType || "person",
    basePrice: data.basePrice || 0,
    discountedPrice: data.discountedPrice || 0,
    finalPrice: data.finalPrice || 0
  });

  const addDateSlot = () => {
    const newSlot: DateSlot = {
      id: `slot-${Date.now()}`,
      fromDate: null,
      toDate: null,
      availableSlots: 10
    };
    setLocalData(prev => ({
      ...prev,
      dateSlots: [...prev.dateSlots, newSlot]
    }));
  };

  const updateDateSlot = (slotId: string, field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      dateSlots: prev.dateSlots.map((slot: DateSlot) => 
        slot.id === slotId ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeDateSlot = (slotId: string) => {
    setLocalData(prev => ({
      ...prev,
      dateSlots: prev.dateSlots.filter((slot: DateSlot) => slot.id !== slotId)
    }));
  };

  const addPackage = () => {
    const newPackage: PricingPackage = {
      id: `package-${Date.now()}`,
      title: "",
      description: "",
      basePrice: 0,
      discount: 0,
      finalPrice: 0,
      bookingAmount: 0,
      gstPercentage: 18
    };
    setLocalData(prev => ({
      ...prev,
      packages: [...prev.packages, newPackage]
    }));
  };

  const updatePackage = (packageId: string, field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg: PricingPackage) => {
        if (pkg.id === packageId) {
          const updated = { ...pkg, [field]: value };
          
          // Auto-calculate final price when base price or discount changes
          if (field === 'basePrice' || field === 'discount') {
            updated.finalPrice = updated.basePrice - updated.discount;
          }
          
          return updated;
        }
        return pkg;
      })
    }));
  };

  const removePackage = (packageId: string) => {
    setLocalData(prev => ({
      ...prev,
      packages: prev.packages.filter((pkg: PricingPackage) => pkg.id !== packageId)
    }));
  };

  const updateCustomizedPrice = (field: string, value: number) => {
    setLocalData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate final price
      if (field === 'basePrice' || field === 'discountedPrice') {
        updated.finalPrice = updated.basePrice - updated.discountedPrice;
      }
      
      return updated;
    });
  };

  const isFormValid = () => {
    if (localData.pricingModel === "fixed") {
      return localData.dateSlots.length > 0 && 
             localData.packages.length > 0 &&
             localData.dateSlots.every((slot: DateSlot) => slot.fromDate && slot.toDate) &&
             localData.packages.every((pkg: PricingPackage) => pkg.title && pkg.basePrice > 0);
    } else {
      return localData.basePrice > 0 && localData.finalPrice > 0;
    }
  };

  useEffect(() => {
    updateData("pricing", localData);
    if (isFormValid()) {
      onComplete();
    }
  }, [localData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pricing Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Set up pricing model and packages for your trip
          </p>
        </div>
        <Badge variant="outline">
          {localData.pricingModel === "fixed" ? "Fixed Departure" : "Customized Trip"}
        </Badge>
      </div>

      {/* Pricing Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Model *</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={localData.pricingModel}
            onValueChange={(value) => setLocalData(prev => ({ ...prev, pricingModel: value }))}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="fixed" id="fixed" />
              <div className="flex-1">
                <Label htmlFor="fixed" className="font-medium">Fixed Departure</Label>
                <p className="text-sm text-muted-foreground">Set specific dates with group bookings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="customized" id="customized" />
              <div className="flex-1">
                <Label htmlFor="customized" className="font-medium">Customized Trip</Label>
                <p className="text-sm text-muted-foreground">Flexible dates based on customer preference</p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Fixed Departure Pricing */}
      {localData.pricingModel === "fixed" && (
        <div className="space-y-6">
          {/* Date Slots */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Available Slots
              </CardTitle>
              <Button onClick={addDateSlot} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Slot
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {localData.dateSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No date slots added yet. Click "Add Slot" to create your first departure date.
                </div>
              ) : (
                <div className="space-y-4">
                  {localData.dateSlots.map((slot: DateSlot, index: number) => (
                    <div key={slot.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Slot {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeDateSlot(slot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>From Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !slot.fromDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {slot.fromDate ? format(slot.fromDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={slot.fromDate || undefined}
                                onSelect={(date) => updateDateSlot(slot.id, "fromDate", date)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label>To Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !slot.toDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {slot.toDate ? format(slot.toDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={slot.toDate || undefined}
                                onSelect={(date) => updateDateSlot(slot.id, "toDate", date)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label>Available Slots *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={slot.availableSlots}
                            onChange={(e) => updateDateSlot(slot.id, "availableSlots", parseInt(e.target.value) || 0)}
                            placeholder="Number of slots"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Packages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Costing Packages
              </CardTitle>
              <Button onClick={addPackage} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {localData.packages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No packages added yet. Click "Add Package" to create your first pricing package.
                </div>
              ) : (
                <div className="space-y-6">
                  {localData.packages.map((pkg: PricingPackage, index: number) => (
                    <div key={pkg.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Package {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removePackage(pkg.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Package Title *</Label>
                          <Input
                            value={pkg.title}
                            onChange={(e) => updatePackage(pkg.id, "title", e.target.value)}
                            placeholder="e.g., Triple Occupancy"
                          />
                        </div>
                        
                        <div>
                          <Label>Base Price (₹) *</Label>
                          <Input
                            type="number"
                            min="0"
                            value={pkg.basePrice}
                            onChange={(e) => updatePackage(pkg.id, "basePrice", parseFloat(e.target.value) || 0)}
                            placeholder="15000"
                          />
                        </div>
                        
                        <div>
                          <Label>Discount (₹)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={pkg.discount}
                            onChange={(e) => updatePackage(pkg.id, "discount", parseFloat(e.target.value) || 0)}
                            placeholder="2000"
                          />
                        </div>
                        
                        <div>
                          <Label>Final Price (₹)</Label>
                          <Input
                            type="number"
                            value={pkg.finalPrice}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        
                        <div>
                          <Label>Booking Amount (₹)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={pkg.bookingAmount}
                            onChange={(e) => updatePackage(pkg.id, "bookingAmount", parseFloat(e.target.value) || 0)}
                            placeholder="8000"
                          />
                        </div>
                        
                        <div>
                          <Label>GST Percentage (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={pkg.gstPercentage}
                            onChange={(e) => updatePackage(pkg.id, "gstPercentage", parseFloat(e.target.value) || 0)}
                            placeholder="18"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label>Description</Label>
                        <Textarea
                          value={pkg.description}
                          onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                          placeholder="e.g., Deluxe room that can occupy 4 members"
                          rows={2}
                        />
                      </div>
                      
                      <div className="mt-4 p-3 bg-muted/50 rounded">
                        <div className="flex justify-between text-sm">
                          <span>Final Price + GST:</span>
                          <span className="font-medium">
                            ₹{(pkg.finalPrice + (pkg.finalPrice * pkg.gstPercentage / 100)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customized Trip Pricing */}
      {localData.pricingModel === "customized" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Customized Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Type Selection */}
            <div>
              <Label className="text-base font-medium">Pricing Type *</Label>
              <RadioGroup
                value={localData.priceType}
                onValueChange={(value) => setLocalData(prev => ({ ...prev, priceType: value }))}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="person" id="person" />
                  <Label htmlFor="person" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Price Per Person
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="package" id="package" />
                  <Label htmlFor="package" className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    Price Per Package
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Pricing Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Base Price (₹) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={localData.basePrice}
                  onChange={(e) => updateCustomizedPrice("basePrice", parseFloat(e.target.value) || 0)}
                  placeholder="15000"
                />
              </div>
              
              <div>
                <Label>Discount (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={localData.discountedPrice}
                  onChange={(e) => updateCustomizedPrice("discountedPrice", parseFloat(e.target.value) || 0)}
                  placeholder="2000"
                />
              </div>
              
              <div>
                <Label>Final Price (₹)</Label>
                <Input
                  type="number"
                  value={localData.finalPrice}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Price Display Preview */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Display Price</p>
                <p className="text-2xl font-bold text-primary">
                  Starting From ₹{localData.finalPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {localData.priceType === "person" ? "Per Person" : "Per Package"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Status */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pricing Status</p>
              <p className="text-sm text-muted-foreground">
                {isFormValid() 
                  ? "Pricing configuration is complete" 
                  : `Please complete ${localData.pricingModel === "fixed" ? "date slots and packages" : "pricing details"}`
                }
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