import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, DollarSign, MessageSquare, Mail, Edit, Save, X, Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  name: string;
  email: string;
  mobile: string;
  destination_type: string;
  pickup: string;
  drop_location: string;
  travel_date_from: string;
  travel_date_to: string;
  no_of_adults: number;
  no_of_children: number;
  status: string;
  priority: string;
  assigned_to: string;
  follow_up_date: string;
  source: string;
  budget: string;
  hotel_category: string;
  comments: string;
  created_at: string;
}

interface Comment {
  id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

interface LeadDetailViewProps {
  lead: Lead;
  onUpdate: () => void;
}

export function LeadDetailView({ lead, onUpdate }: LeadDetailViewProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editedLead, setEditedLead] = useState(lead);

  const statusColors = {
    new: "bg-blue-500",
    contacted: "bg-yellow-500",
    quoted: "bg-purple-500", 
    booked: "bg-green-500",
    awaiting_payment: "bg-orange-500",
    failed: "bg-red-500"
  };

  const priorityColors = {
    low: "bg-gray-500",
    medium: "bg-yellow-500",
    high: "bg-red-500"
  };

  useEffect(() => {
    fetchComments();
    fetchDocuments();
  }, [lead.id]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("lead_comments")
        .select("*")
        .eq("lead_id", lead.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("lead_documents")
        .select("*")
        .eq("lead_id", lead.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          name: editedLead.name,
          email: editedLead.email,
          mobile: editedLead.mobile,
          destination_type: editedLead.destination_type,
          pickup: editedLead.pickup,
          drop_location: editedLead.drop_location,
          travel_date_from: editedLead.travel_date_from || null,
          travel_date_to: editedLead.travel_date_to || null,
          no_of_adults: editedLead.no_of_adults,
          no_of_children: editedLead.no_of_children,
          status: editedLead.status,
          priority: editedLead.priority,
          assigned_to: editedLead.assigned_to,
          follow_up_date: editedLead.follow_up_date || null,
          budget: editedLead.budget,
          hotel_category: editedLead.hotel_category,
          comments: editedLead.comments
        })
        .eq("id", lead.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead updated successfully",
      });

      setEditing(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to update lead",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from("lead_comments")
        .insert([{
          lead_id: lead.id,
          user_name: "Current User", // In real app, get from auth
          comment: newComment
        }]);

      if (error) throw error;

      setNewComment("");
      fetchComments();
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{lead.name}</h3>
          <p className="text-sm text-muted-foreground">Lead ID: {lead.id.slice(0, 8)}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button size="sm" onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details">Lead Management</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  {editing ? (
                    <Select value={editedLead.status} onValueChange={(value) => setEditedLead({...editedLead, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="quoted">Quotation Sent</SelectItem>
                        <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${statusColors[lead.status as keyof typeof statusColors]} text-white`}>
                      {lead.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label>Priority</Label>
                  {editing ? (
                    <Select value={editedLead.priority} onValueChange={(value) => setEditedLead({...editedLead, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${priorityColors[lead.priority as keyof typeof priorityColors]} text-white`}>
                      {lead.priority}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assigned To</Label>
                  {editing ? (
                    <Input
                      value={editedLead.assigned_to}
                      onChange={(e) => setEditedLead({...editedLead, assigned_to: e.target.value})}
                      placeholder="Assign to team member"
                    />
                  ) : (
                    <p className="text-sm">{lead.assigned_to || 'Unassigned'}</p>
                  )}
                </div>

                <div>
                  <Label>Follow-up Date</Label>
                  {editing ? (
                    <Input
                      type="date"
                      value={editedLead.follow_up_date}
                      onChange={(e) => setEditedLead({...editedLead, follow_up_date: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{lead.follow_up_date ? formatDate(lead.follow_up_date) : 'Not set'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Destination Type</Label>
                  {editing ? (
                    <Input
                      value={editedLead.destination_type}
                      onChange={(e) => setEditedLead({...editedLead, destination_type: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{lead.destination_type}</p>
                  )}
                </div>

                <div>
                  <Label>Number of Travelers</Label>
                  <p className="text-sm">{lead.no_of_adults} Adults, {lead.no_of_children} Children</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Travel Date From</Label>
                  <p className="text-sm">{lead.travel_date_from ? formatDate(lead.travel_date_from) : 'Not specified'}</p>
                </div>

                <div>
                  <Label>Travel Date To</Label>
                  <p className="text-sm">{lead.travel_date_to ? formatDate(lead.travel_date_to) : 'Not specified'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pickup</Label>
                  <p className="text-sm">{lead.pickup || 'Not specified'}</p>
                </div>

                <div>
                  <Label>Drop</Label>
                  <p className="text-sm">{lead.drop_location || 'Not specified'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hotel Category</Label>
                  <p className="text-sm">{lead.hotel_category || 'Not specified'}</p>
                </div>

                <div>
                  <Label>Budget</Label>
                  <p className="text-sm">{lead.budget || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client Name</Label>
                  {editing ? (
                    <Input
                      value={editedLead.name}
                      onChange={(e) => setEditedLead({...editedLead, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{lead.name}</p>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  {editing ? (
                    <Input
                      value={editedLead.email}
                      onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{lead.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mobile</Label>
                  {editing ? (
                    <Input
                      value={editedLead.mobile}
                      onChange={(e) => setEditedLead({...editedLead, mobile: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm">{lead.mobile}</p>
                  )}
                </div>

                <div>
                  <Label>Source</Label>
                  <p className="text-sm capitalize">{lead.source}</p>
                </div>
              </div>

              <div>
                <Label>Created On</Label>
                <p className="text-sm">{formatDate(lead.created_at)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <Button onClick={addComment} disabled={!newComment.trim()}>
                  Add
                </Button>
              </div>

              <Separator />

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No comments yet. Add the first comment above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileSpreadsheet className="h-6 w-6" />
                  <span>Create Quotation</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Create Invoice</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Send WhatsApp</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Mail className="h-6 w-6" />
                  <span>Send Email</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Linked Documents</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.file_type} • {formatDate(doc.created_at)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {documents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents attached yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}