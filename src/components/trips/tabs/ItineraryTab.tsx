import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Upload, X, MapPin, Camera, Utensils } from "lucide-react";

interface ItineraryTabProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onComplete: () => void;
}

const mockActivities = [
  "Sightseeing", "Adventure Sports", "Cultural Tour", "Beach Activities", 
  "Trekking", "Wildlife Safari", "Temple Visit", "Shopping", 
  "Local Cuisine", "Photography", "Boating", "Museum Visit"
];

const mealOptions = ["Breakfast", "Lunch", "Dinner"];

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  images: string[];
  activities: string[];
  accommodation: {
    hotelName: string;
    gallery: string[];
    meals: string[];
  };
}

export function ItineraryTab({ data, updateData, onComplete }: ItineraryTabProps) {
  const [localData, setLocalData] = useState<ItineraryDay[]>([]);

  // Initialize itinerary based on number of days from basic info
  useEffect(() => {
    const days = data.days || 5;
    const initialItinerary: ItineraryDay[] = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      title: `Day ${index + 1}: ${index === 0 ? 'Arrival' : index === days - 1 ? 'Departure' : 'Exploration'}`,
      description: "",
      images: [],
      activities: [],
      accommodation: {
        hotelName: "",
        gallery: [],
        meals: []
      }
    }));

    setLocalData(data.itinerary?.length ? data.itinerary : initialItinerary);
  }, [data.days]);

  const updateDay = (dayIndex: number, field: string, value: any) => {
    const updated = [...localData];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentObj = updated[dayIndex][parent as keyof ItineraryDay] as any;
      updated[dayIndex] = {
        ...updated[dayIndex],
        [parent]: {
          ...parentObj,
          [child]: value
        }
      };
    } else {
      updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    }
    setLocalData(updated);
  };

  const addActivity = (dayIndex: number, activity: string) => {
    const updated = [...localData];
    if (!updated[dayIndex].activities.includes(activity)) {
      updated[dayIndex].activities.push(activity);
      setLocalData(updated);
    }
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...localData];
    updated[dayIndex].activities.splice(activityIndex, 1);
    setLocalData(updated);
  };

  const toggleMeal = (dayIndex: number, meal: string) => {
    const updated = [...localData];
    const meals = updated[dayIndex].accommodation.meals;
    if (meals.includes(meal)) {
      updated[dayIndex].accommodation.meals = meals.filter(m => m !== meal);
    } else {
      updated[dayIndex].accommodation.meals.push(meal);
    }
    setLocalData(updated);
  };

  const isFormValid = () => {
    return localData.every(day => 
      day.title.length > 0 && 
      day.description.length > 0 &&
      day.activities.length > 0
    );
  };

  useEffect(() => {
    updateData("itinerary", localData);
    if (isFormValid()) {
      onComplete();
    }
  }, [localData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trip Itinerary</h3>
          <p className="text-sm text-muted-foreground">
            Plan your {data.days || 5} day trip with detailed daily activities
          </p>
        </div>
        <Badge variant="outline">
          {localData.filter(day => day.title && day.description && day.activities.length > 0).length} / {localData.length} days completed
        </Badge>
      </div>

      <Accordion type="multiple" className="space-y-4" defaultValue={["day-1"]}>
        {localData.map((day, dayIndex) => (
          <AccordionItem key={day.day} value={`day-${day.day}`}>
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full mr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {day.day}
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">{day.title || `Day ${day.day}`}</h4>
                      <p className="text-sm text-muted-foreground">
                        {day.activities.length} activities • {day.accommodation.hotelName || "No accommodation set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {day.title && day.description && day.activities.length > 0 && (
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent>
                <CardContent className="pt-0 space-y-6">
                  {/* Day Title & Description */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor={`title-${day.day}`}>Day Title *</Label>
                      <Input
                        id={`title-${day.day}`}
                        value={day.title}
                        onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                        placeholder={`e.g., Day ${day.day}: Arrival at Delhi`}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`description-${day.day}`}>Description *</Label>
                      <Textarea
                        id={`description-${day.day}`}
                        value={day.description}
                        onChange={(e) => updateDay(dayIndex, "description", e.target.value)}
                        placeholder="Describe the day's activities and experiences..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <Label>Day Images (Optional)</Label>
                    <div className="mt-2 space-y-2">
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Images (Multiple allowed)
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 1200x800px for best quality
                      </p>
                      {day.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {day.images.map((image, index) => (
                            <Badge key={index} variant="secondary">
                              <Camera className="h-3 w-3 mr-1" />
                              Image {index + 1}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <Label>Select Activities *</Label>
                    <div className="mt-2 space-y-3">
                      <Select onValueChange={(value) => addActivity(dayIndex, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add an activity" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockActivities.filter(activity => !day.activities.includes(activity)).map((activity) => (
                            <SelectItem key={activity} value={activity}>
                              {activity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {day.activities.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Selected Activities:</p>
                          <div className="space-y-1">
                            {day.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <span className="text-sm">{activity}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeActivity(dayIndex, actIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Accommodation</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`hotel-${day.day}`}>Hotel Name</Label>
                        <Input
                          id={`hotel-${day.day}`}
                          value={day.accommodation.hotelName}
                          onChange={(e) => updateDay(dayIndex, "accommodation.hotelName", e.target.value)}
                          placeholder="Enter hotel name"
                        />
                      </div>
                      
                      <div>
                        <Label>Hotel Gallery</Label>
                        <Button variant="outline" className="w-full mt-2">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Hotel Images
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Meal Plan</Label>
                      <div className="flex gap-4 mt-2">
                        {mealOptions.map((meal) => (
                          <div key={meal} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`${meal}-${day.day}`}
                              checked={day.accommodation.meals.includes(meal)}
                              onChange={() => toggleMeal(dayIndex, meal)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`${meal}-${day.day}`} className="flex items-center gap-1">
                              <Utensils className="h-3 w-3" />
                              {meal}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {day.accommodation.meals.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {day.accommodation.meals.map((meal) => (
                              <Badge key={meal} variant="secondary" className="text-xs">
                                {meal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Form Status */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Itinerary Status</p>
              <p className="text-sm text-muted-foreground">
                {isFormValid() 
                  ? "All days have been planned with activities" 
                  : "Please complete all day descriptions and add activities"
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