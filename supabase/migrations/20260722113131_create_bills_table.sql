-- Bill frequency enum
CREATE TYPE public.bill_frequency AS ENUM (
  'weekly',
  'monthly',
  'quarterly',
  'yearly'
);

CREATE TYPE public.bill_status AS ENUM (
  'active',
  'paid',
  'cancelled'
);


-- Bills table
CREATE TABLE public.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id uuid NOT NULL,

  name text NOT NULL,

  category text,

  amount numeric NOT NULL DEFAULT 0,

  frequency public.bill_frequency NOT NULL DEFAULT 'monthly',

  due_day integer,

  next_due_date date,

  status public.bill_status NOT NULL DEFAULT 'active',

  account_id uuid,

  auto_create_transaction boolean DEFAULT false,

  notes text,

  created_at timestamptz NOT NULL DEFAULT now(),

  updated_at timestamptz NOT NULL DEFAULT now()
);


GRANT SELECT, INSERT, UPDATE, DELETE 
ON public.bills TO authenticated;

GRANT ALL 
ON public.bills TO service_role;


ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;


CREATE POLICY "own bills"
ON public.bills
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


CREATE TRIGGER trg_bills_updated
BEFORE UPDATE ON public.bills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();