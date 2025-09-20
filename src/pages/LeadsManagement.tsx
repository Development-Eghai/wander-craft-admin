import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit, Trash2, MessageSquare, Mail, FileSpreadsheet, DollarSign, Plus, Search, Filter, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddLeadForm } from "@/components/crm/AddLeadForm";
import { LeadDetailView } from "@/components/crm/LeadDetailView";

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

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const { toast } = useToast();

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
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.mobile.includes(searchTerm) ||
        lead.destination_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      
      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const handleCreateQuotation = (lead: Lead) => {
    // Navigate to quotation creation with lead data
    toast({
      title: "Feature Coming Soon",
      description: "Quotation creation will be available soon",
    });
  };

  const handleCreateInvoice = (lead: Lead) => {
    // Navigate to invoice creation with lead data
    toast({
      title: "Feature Coming Soon", 
      description: "Invoice creation will be available soon",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const KanbanView = () => {
    const statuses = ['new', 'contacted', 'quoted', 'awaiting_payment', 'booked', 'failed'];
    
    return (
      <div className="grid grid-cols-6 gap-4 h-full">
        {statuses.map(status => (
          <Card key={status} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-center capitalize">
                {status.replace('_', ' ')}
              </CardTitle>
              <div className="text-xs text-muted-foreground text-center">
                {filteredLeads.filter(lead => lead.status === status).length} leads
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-2">
              <div className="space-y-2">
                {filteredLeads
                  .filter(lead => lead.status === status)
                  .map(lead => (
                    <Card key={lead.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowLeadDetails(true);
                          }}>
                      <div className="space-y-2">
                        <div className="font-medium text-sm">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                        <div className="text-xs">{lead.destination_type}</div>
                        <div className="flex justify-between items-center">
                          <Badge className={`${priorityColors[lead.priority as keyof typeof priorityColors]} text-white text-xs`}>
                            {lead.priority}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(lead.created_at)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <AddLeadForm onSuccess={() => {
                setShowAddForm(false);
                fetchLeads();
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      {viewMode === "kanban" ? (
        <KanbanView />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Lead Info</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Follow-up Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow key={lead.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.email}</div>
                        <div className="text-sm text-muted-foreground">{lead.mobile}</div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.destination_type}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[lead.status as keyof typeof statusColors]} text-white`}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${priorityColors[lead.priority as keyof typeof priorityColors]} text-white`}>
                        {lead.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.assigned_to || 'Unassigned'}</TableCell>
                    <TableCell>{lead.follow_up_date ? formatDate(lead.follow_up_date) : '-'}</TableCell>
                    <TableCell>{formatDate(lead.created_at)}</TableCell>
                    <TableCell className="capitalize">{lead.source}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowLeadDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateQuotation(lead)}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateInvoice(lead)}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLead(lead.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Lead Details Dialog */}
      <Dialog open={showLeadDetails} onOpenChange={setShowLeadDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <LeadDetailView 
              lead={selectedLead} 
              onUpdate={() => {
                fetchLeads();
                setShowLeadDetails(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}