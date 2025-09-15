import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, FileText, Shield, CreditCard, Settings } from "lucide-react";

interface PoliciesTabProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onComplete: () => void;
}

interface CustomPolicy {
  id: string;
  title: string;
  content: string;
}

export function PoliciesTab({ data, updateData, onComplete }: PoliciesTabProps) {
  const [localData, setLocalData] = useState({
    termsConditions: data.termsConditions || "",
    privacyPolicy: data.privacyPolicy || "",
    paymentTerms: data.paymentTerms || "",
    customPolicies: data.customPolicies || []
  });

  const addCustomPolicy = () => {
    const newPolicy: CustomPolicy = {
      id: `policy-${Date.now()}`,
      title: "",
      content: ""
    };
    setLocalData(prev => ({
      ...prev,
      customPolicies: [...prev.customPolicies, newPolicy]
    }));
  };

  const updateCustomPolicy = (policyId: string, field: string, value: string) => {
    setLocalData(prev => ({
      ...prev,
      customPolicies: prev.customPolicies.map((policy: CustomPolicy) => 
        policy.id === policyId ? { ...policy, [field]: value } : policy
      )
    }));
  };

  const removeCustomPolicy = (policyId: string) => {
    setLocalData(prev => ({
      ...prev,
      customPolicies: prev.customPolicies.filter((policy: CustomPolicy) => policy.id !== policyId)
    }));
  };

  const handleFieldUpdate = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return localData.termsConditions.length > 0 && 
           localData.privacyPolicy.length > 0 && 
           localData.paymentTerms.length > 0;
  };

  useEffect(() => {
    updateData("policies", localData);
    if (isFormValid()) {
      onComplete();
    }
  }, [localData]);

  // Default content templates
  const defaultTermsConditions = `1. BOOKING CONFIRMATION
- All bookings are subject to availability and confirmation
- A booking confirmation will be sent via email within 24 hours

2. CANCELLATION POLICY
- Cancellations made 30+ days before departure: 10% penalty
- Cancellations made 15-29 days before departure: 25% penalty
- Cancellations made 7-14 days before departure: 50% penalty
- Cancellations made less than 7 days: 100% penalty

3. PAYMENT TERMS
- 25% advance payment required at the time of booking
- Balance payment must be completed 15 days before departure
- All payments are non-refundable except as per cancellation policy

4. TRAVEL DOCUMENTS
- Valid passport/ID required for all travelers
- Guests responsible for obtaining necessary visas
- Travel insurance is recommended

5. LIABILITY
- Company not liable for delays due to weather, political situations, or natural disasters
- Travelers participate at their own risk`;

  const defaultPrivacyPolicy = `1. INFORMATION COLLECTION
We collect personal information including name, contact details, passport information, and travel preferences to process your booking and provide our services.

2. USE OF INFORMATION
Your information is used to:
- Process and confirm bookings
- Communicate important travel updates
- Provide customer support
- Send promotional offers (with consent)

3. INFORMATION SHARING
We do not sell or share your personal information with third parties except:
- Travel service providers (hotels, airlines, etc.)
- Legal requirements
- With your explicit consent

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. YOUR RIGHTS
You have the right to:
- Access your personal information
- Request corrections to your data
- Opt-out of marketing communications
- Request deletion of your data

6. CONTACT
For privacy-related queries, contact us at privacy@wandercraft.com`;

  const defaultPaymentTerms = `1. PAYMENT METHODS
We accept the following payment methods:
- Credit/Debit Cards (Visa, MasterCard, American Express)
- Bank Transfer
- Digital Wallets (PayPal, Google Pay, etc.)
- Cash (for local bookings only)

2. PAYMENT SCHEDULE
- Booking Amount: 25% of total package cost at confirmation
- Balance Payment: 75% due 15 days before departure
- Last-minute bookings: Full payment required immediately

3. CURRENCY
All prices are quoted in Indian Rupees (INR) unless otherwise specified.

4. PRICE CHANGES
Prices are subject to change due to:
- Fuel surcharges
- Government taxes
- Currency fluctuations
- Hotel/service provider rate changes

5. REFUND POLICY
Refunds will be processed according to our cancellation policy and may take 7-14 business days to reflect in your account.

6. FAILED PAYMENTS
Bookings with failed payments will be automatically cancelled after 24 hours unless payment is received.`;

  const loadDefaultContent = (field: string, defaultContent: string) => {
    handleFieldUpdate(field, defaultContent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Policies & Terms</h3>
          <p className="text-sm text-muted-foreground">
            Define the legal and operational policies for your travel packages
          </p>
        </div>
        <Badge variant="outline">
          {(localData.termsConditions ? 1 : 0) + 
           (localData.privacyPolicy ? 1 : 0) + 
           (localData.paymentTerms ? 1 : 0) + 
           localData.customPolicies.length} policies
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Terms and Conditions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms and Conditions *
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadDefaultContent("termsConditions", defaultTermsConditions)}
              >
                Load Template
              </Button>
              <Badge variant={localData.termsConditions ? "default" : "secondary"}>
                {localData.termsConditions ? "Complete" : "Required"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Terms and Conditions Content</Label>
              <ScrollArea className="h-64 w-full border rounded-md">
                <Textarea
                  value={localData.termsConditions}
                  onChange={(e) => handleFieldUpdate("termsConditions", e.target.value)}
                  placeholder="Enter your terms and conditions..."
                  className="min-h-60 border-0 resize-none"
                />
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                {localData.termsConditions.length} characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Policy *
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadDefaultContent("privacyPolicy", defaultPrivacyPolicy)}
              >
                Load Template
              </Button>
              <Badge variant={localData.privacyPolicy ? "default" : "secondary"}>
                {localData.privacyPolicy ? "Complete" : "Required"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Privacy Policy Content</Label>
              <ScrollArea className="h-64 w-full border rounded-md">
                <Textarea
                  value={localData.privacyPolicy}
                  onChange={(e) => handleFieldUpdate("privacyPolicy", e.target.value)}
                  placeholder="Enter your privacy policy..."
                  className="min-h-60 border-0 resize-none"
                />
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                {localData.privacyPolicy.length} characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Terms *
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadDefaultContent("paymentTerms", defaultPaymentTerms)}
              >
                Load Template
              </Button>
              <Badge variant={localData.paymentTerms ? "default" : "secondary"}>
                {localData.paymentTerms ? "Complete" : "Required"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Payment Terms Content</Label>
              <ScrollArea className="h-64 w-full border rounded-md">
                <Textarea
                  value={localData.paymentTerms}
                  onChange={(e) => handleFieldUpdate("paymentTerms", e.target.value)}
                  placeholder="Enter your payment terms..."
                  className="min-h-60 border-0 resize-none"
                />
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                {localData.paymentTerms.length} characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Policies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Custom Policies
            </CardTitle>
            <Button onClick={addCustomPolicy} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </CardHeader>
          <CardContent>
            {localData.customPolicies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No custom policies added yet. Click "Add New" to create custom policy sections.
              </div>
            ) : (
              <div className="space-y-4">
                {localData.customPolicies.map((policy: CustomPolicy, index: number) => (
                  <Card key={policy.id} className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <h4 className="font-medium">Custom Policy {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomPolicy(policy.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Policy Title *</Label>
                        <Input
                          value={policy.title}
                          onChange={(e) => updateCustomPolicy(policy.id, "title", e.target.value)}
                          placeholder="e.g., Health and Safety Guidelines"
                        />
                      </div>
                      <div>
                        <Label>Policy Content *</Label>
                        <Textarea
                          value={policy.content}
                          onChange={(e) => updateCustomPolicy(policy.id, "content", e.target.value)}
                          placeholder="Enter the policy details..."
                          rows={6}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Policy Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {localData.termsConditions ? "✓" : "✗"}
              </div>
              <div className="text-sm text-muted-foreground">Terms & Conditions</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {localData.privacyPolicy ? "✓" : "✗"}
              </div>
              <div className="text-sm text-muted-foreground">Privacy Policy</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {localData.paymentTerms ? "✓" : "✗"}
              </div>
              <div className="text-sm text-muted-foreground">Payment Terms</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {localData.customPolicies.length}
              </div>
              <div className="text-sm text-muted-foreground">Custom Policies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Status */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Policies Status</p>
              <p className="text-sm text-muted-foreground">
                {isFormValid() 
                  ? "All required policies are complete" 
                  : "Please complete all required policy sections"
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