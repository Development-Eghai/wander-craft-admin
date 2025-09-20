-- Create Travel CRM database schema

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  destination_type TEXT,
  pickup TEXT,
  drop_location TEXT,
  travel_date_from DATE,
  travel_date_to DATE,
  no_of_adults INTEGER DEFAULT 1,
  no_of_children INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'awaiting_payment', 'failed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to TEXT,
  follow_up_date DATE,
  source TEXT DEFAULT 'website',
  budget TEXT,
  hotel_category TEXT,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotations table
CREATE TABLE public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id TEXT UNIQUE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_mobile TEXT NOT NULL,
  agent_name TEXT,
  agent_email TEXT,
  agent_contact TEXT,
  company_name TEXT,
  company_email TEXT,
  company_mobile TEXT,
  company_website TEXT,
  company_licence TEXT,
  trip_title TEXT,
  trip_overview TEXT,
  trip_type TEXT CHECK (trip_type IN ('fixed', 'customized')),
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'invoiced')),
  quotation_design TEXT DEFAULT 'modern' CHECK (quotation_design IN ('modern', 'professional', 'basic')),
  itinerary JSONB,
  costing JSONB,
  policies JSONB,
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_no TEXT UNIQUE NOT NULL,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_mobile TEXT NOT NULL,
  client_gst TEXT,
  client_address TEXT,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  due_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount - paid_amount) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  is_interstate BOOLEAN DEFAULT false,
  items JSONB NOT NULL,
  terms_conditions TEXT,
  payment_terms TEXT,
  cancellation_policy TEXT,
  notes TEXT,
  template TEXT DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for leads
CREATE TABLE public.lead_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table for leads
CREATE TABLE public.lead_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - can be restricted based on user roles later)
CREATE POLICY "Allow all operations on leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on quotations" ON public.quotations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on lead_comments" ON public.lead_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on lead_documents" ON public.lead_documents FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_quotations_lead_id ON public.quotations(lead_id);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_invoices_lead_id ON public.invoices(lead_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_payments_invoice_id ON public.payments(invoice_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Generate quote_id function
CREATE OR REPLACE FUNCTION generate_quote_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'QT' || TO_CHAR(NOW(), 'YYYY') || LPAD(NEXTVAL('quote_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate invoice_no function
CREATE OR REPLACE FUNCTION generate_invoice_no()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INV' || TO_CHAR(NOW(), 'YYYY') || LPAD(NEXTVAL('invoice_no_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequences for auto-generating IDs
CREATE SEQUENCE quote_id_seq START 1;
CREATE SEQUENCE invoice_no_seq START 1;

-- Set default values using the functions
ALTER TABLE public.quotations ALTER COLUMN quote_id SET DEFAULT generate_quote_id();
ALTER TABLE public.invoices ALTER COLUMN invoice_no SET DEFAULT generate_invoice_no();