import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, X, Star, CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface DetailsTabProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onComplete: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function DetailsTab({ data, updateData, onComplete }: DetailsTabProps) {
  const [localData, setLocalData] = useState({
    highlights: data.highlights || [],
    inclusions: data.inclusions || [],
    exclusions: data.exclusions || [],
    faqs: data.faqs || []
  });

  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setLocalData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_: string, i: number) => i !== index)
    }));
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setLocalData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusion.trim()]
      }));
      setNewInclusion("");
    }
  };

  const removeInclusion = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_: string, i: number) => i !== index)
    }));
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setLocalData(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, newExclusion.trim()]
      }));
      setNewExclusion("");
    }
  };

  const removeExclusion = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_: string, i: number) => i !== index)
    }));
  };

  const addFAQ = () => {
    const newFAQ: FAQ = {
      id: `faq-${Date.now()}`,
      question: "",
      answer: ""
    };
    setLocalData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFAQ]
    }));
  };

  const updateFAQ = (faqId: string, field: string, value: string) => {
    setLocalData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq: FAQ) => 
        faq.id === faqId ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFAQ = (faqId: string) => {
    setLocalData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((faq: FAQ) => faq.id !== faqId)
    }));
  };

  const isFormValid = () => {
    return localData.highlights.length > 0 && 
           localData.inclusions.length > 0 && 
           localData.exclusions.length > 0;
  };

  useEffect(() => {
    updateData("details", localData);
    if (isFormValid()) {
      onComplete();
    }
  }, [localData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trip Details</h3>
          <p className="text-sm text-muted-foreground">
            Add comprehensive details about what's included and what to expect
          </p>
        </div>
        <Badge variant="outline">
          {(localData.highlights.length > 0 ? 1 : 0) + 
           (localData.inclusions.length > 0 ? 1 : 0) + 
           (localData.exclusions.length > 0 ? 1 : 0) + 
           (localData.faqs.length > 0 ? 1 : 0)} / 4 sections completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip Highlights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Trip Highlights *
            </CardTitle>
            <Badge variant={localData.highlights.length > 0 ? "default" : "secondary"}>
              {localData.highlights.length} items
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add Highlight</Label>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="e.g., Visit to iconic Taj Mahal"
                  onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                />
                <Button onClick={addHighlight} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {localData.highlights.length > 0 && (
              <div className="space-y-2">
                <Label>Current Highlights:</Label>
                <div className="space-y-2">
                  {localData.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 text-sm">{highlight}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {localData.highlights.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No highlights added yet. Add key attractions and experiences.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inclusions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Inclusions *
            </CardTitle>
            <Badge variant={localData.inclusions.length > 0 ? "default" : "secondary"}>
              {localData.inclusions.length} items
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add Inclusion</Label>
              <div className="flex gap-2">
                <Input
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  placeholder="e.g., 4 nights accommodation"
                  onKeyPress={(e) => e.key === 'Enter' && addInclusion()}
                />
                <Button onClick={addInclusion} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {localData.inclusions.length > 0 && (
              <div className="space-y-2">
                <Label>What's Included:</Label>
                <div className="space-y-2">
                  {localData.inclusions.map((inclusion: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 text-sm">{inclusion}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInclusion(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {localData.inclusions.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No inclusions added yet. Add what's covered in the trip price.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Exclusions *
            </CardTitle>
            <Badge variant={localData.exclusions.length > 0 ? "default" : "secondary"}>
              {localData.exclusions.length} items
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add Exclusion</Label>
              <div className="flex gap-2">
                <Input
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  placeholder="e.g., Personal expenses"
                  onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
                />
                <Button onClick={addExclusion} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {localData.exclusions.length > 0 && (
              <div className="space-y-2">
                <Label>What's Not Included:</Label>
                <div className="space-y-2">
                  {localData.exclusions.map((exclusion: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 text-sm">{exclusion}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExclusion(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {localData.exclusions.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No exclusions added yet. Add what's not covered in the trip price.
              </div>
            )}
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              FAQs (Optional)
            </CardTitle>
            <Button onClick={addFAQ} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </CardHeader>
          <CardContent>
            {localData.faqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No FAQs added yet. Click "Add FAQ" to address common questions.
              </div>
            ) : (
              <Accordion type="multiple" className="space-y-2">
                {localData.faqs.map((faq: FAQ, index: number) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <Card>
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <span className="text-left font-medium">
                            {faq.question || `FAQ ${index + 1}`}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFAQ(faq.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="pt-0 space-y-4">
                          <div>
                            <Label>Question *</Label>
                            <Input
                              value={faq.question}
                              onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                              placeholder="e.g., What is the cancellation policy?"
                            />
                          </div>
                          <div>
                            <Label>Answer *</Label>
                            <Textarea
                              value={faq.answer}
                              onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                              placeholder="Provide a detailed answer..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Section Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {localData.highlights.length}
              </div>
              <div className="text-sm text-muted-foreground">Highlights</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {localData.inclusions.length}
              </div>
              <div className="text-sm text-muted-foreground">Inclusions</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {localData.exclusions.length}
              </div>
              <div className="text-sm text-muted-foreground">Exclusions</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {localData.faqs.length}
              </div>
              <div className="text-sm text-muted-foreground">FAQs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Status */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Details Status</p>
              <p className="text-sm text-muted-foreground">
                {isFormValid() 
                  ? "All required sections completed with details" 
                  : "Please add highlights, inclusions, and exclusions"
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