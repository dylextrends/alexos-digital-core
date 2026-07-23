-- ============================================================
-- CRM V2 - CONTACTS FOUNDATION
-- Safe migration (does NOT remove existing customers table)
-- ============================================================

-- CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    type text NOT NULL DEFAULT 'person',

    first_name text,
    last_name text,
    display_name text NOT NULL,

    company_name text,

    email text,
    phone text,
    alternate_phone text,

    website text,
    industry text,
    job_title text,

    address text,
    city text,
    county text,
    country text,
    postal_code text,

    status text NOT NULL DEFAULT 'active',
    source text,

    avatar_url text,

    notes text,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ADD contact_id TO LEADS
-- ============================================================

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS contact_id uuid;

ALTER TABLE public.leads
ADD CONSTRAINT leads_contact_id_fkey
FOREIGN KEY (contact_id)
REFERENCES public.contacts(id)
ON DELETE SET NULL;

-- ============================================================
-- ACTIVITIES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activities (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    contact_id uuid REFERENCES public.contacts(id) ON DELETE CASCADE,

    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,

    type text NOT NULL,

    subject text NOT NULL,

    description text,

    activity_date timestamptz NOT NULL DEFAULT now(),

    completed boolean NOT NULL DEFAULT false,

    created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TASKS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tasks (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    contact_id uuid REFERENCES public.contacts(id) ON DELETE CASCADE,

    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,

    title text NOT NULL,

    description text,

    priority text DEFAULT 'medium',

    status text DEFAULT 'pending',

    due_date timestamptz,

    completed_at timestamptz,

    created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- NOTES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notes (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    contact_id uuid REFERENCES public.contacts(id) ON DELETE CASCADE,

    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,

    content text NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ATTACHMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.attachments (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    contact_id uuid REFERENCES public.contacts(id) ON DELETE CASCADE,

    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,

    file_name text NOT NULL,

    file_url text NOT NULL,

    file_size bigint,

    created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_contacts_user_id
ON public.contacts(user_id);

CREATE INDEX IF NOT EXISTS idx_leads_contact_id
ON public.leads(contact_id);

CREATE INDEX IF NOT EXISTS idx_activities_contact
ON public.activities(contact_id);

CREATE INDEX IF NOT EXISTS idx_tasks_contact
ON public.tasks(contact_id);

CREATE INDEX IF NOT EXISTS idx_notes_contact
ON public.notes(contact_id);

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

CREATE POLICY contacts_all
ON public.contacts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY activities_all
ON public.activities
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY tasks_all
ON public.tasks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY notes_all
ON public.notes
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY attachments_all
ON public.attachments
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- MIGRATE EXISTING CUSTOMERS
-- ============================================================

INSERT INTO public.contacts (
    user_id,
    display_name,
    email,
    phone,
    source,
    status,
    notes
)
SELECT
    user_id,
    name,
    email,
    phone,
    source,
    COALESCE(status,'active'),
    notes
FROM public.customers
ON CONFLICT DO NOTHING;