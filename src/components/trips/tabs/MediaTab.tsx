import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, X, Eye, Settings } from "lucide-react";

interface MediaTabProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onComplete: () => void;
}

export function MediaTab({ data, updateData, onComplete }: MediaTabProps) {
  const [localData, setLocalData] = useState({
    heroImage: data.heroImage || null,
    gallery: data.gallery || []
  });

  const handleHeroImageUpload = () => {
    // Simulate file upload
    setLocalData(prev => ({
      ...prev,
      heroImage: "hero-image-placeholder.jpg"
    }));
  };

  const removeHeroImage = () => {
    setLocalData(prev => ({
      ...prev,
      heroImage: null
    }));
  };

  const handleGalleryUpload = () => {
    // Simulate adding multiple images to gallery
    const newImages = [
      `gallery-image-${localData.gallery.length + 1}.jpg`,
      `gallery-image-${localData.gallery.length + 2}.jpg`,
      `gallery-image-${localData.gallery.length + 3}.jpg`
    ];
    
    setLocalData(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...newImages]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_: any, i: number) => i !== index)
    }));
  };

  const isFormValid = () => {
    return localData.heroImage !== null;
  };

  useEffect(() => {
    updateData("media", localData);
    if (isFormValid()) {
      onComplete();
    }
  }, [localData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Media Assets</h3>
          <p className="text-sm text-muted-foreground">
            Upload images that will showcase your trip package
          </p>
        </div>
        <Badge variant="outline">
          {(localData.heroImage ? 1 : 0) + localData.gallery.length} media files
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Image / Thumbnail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Hero Image / Thumbnail *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This image will be the main thumbnail for your trip package. It should be eye-catching and represent your destination well.
            </div>
            
            {!localData.heroImage ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-medium mb-2">Upload Hero Image</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Recommended size: 1920x1080px (16:9 ratio)
                </p>
                <Button onClick={handleHeroImageUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Hero Image Uploaded</p>
                      <p className="text-xs text-muted-foreground">{localData.heroImage}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeHeroImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleHeroImageUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Replace
                  </Button>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              <p className="font-medium mb-1">Tips for great hero images:</p>
              <ul className="space-y-1">
                <li>• Use high-quality, professional photos</li>
                <li>• Ensure good lighting and clear visibility</li>
                <li>• Avoid overly crowded or cluttered images</li>
                <li>• Consider the emotional appeal to travelers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Image Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Image Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Add multiple images to showcase different aspects of your trip package. These will be displayed in a gallery format.
            </div>

            <Button onClick={handleGalleryUpload} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Add Images to Gallery
            </Button>

            {localData.gallery.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Gallery Images ({localData.gallery.length})</p>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {localData.gallery.map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-muted rounded border flex items-center justify-center">
                        <div className="text-center">
                          <Image className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                          <p className="text-xs font-medium">Image {index + 1}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                        <Button variant="secondary" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              <p className="font-medium mb-1">Gallery best practices:</p>
              <ul className="space-y-1">
                <li>• Upload 5-10 high-quality images</li>
                <li>• Show different attractions and activities</li>
                <li>• Include both landscape and close-up shots</li>
                <li>• Maintain consistent quality and style</li>
                <li>• Recommended size: 1200x800px minimum</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Media Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {localData.heroImage ? 1 : 0}
              </div>
              <div className="text-sm text-muted-foreground">Hero Image</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {localData.gallery.length}
              </div>
              <div className="text-sm text-muted-foreground">Gallery Images</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {(localData.heroImage ? 1 : 0) + localData.gallery.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Media Files</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Status */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Media Status</p>
              <p className="text-sm text-muted-foreground">
                {isFormValid() 
                  ? "Hero image uploaded - ready to proceed" 
                  : "Please upload a hero image to continue"
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