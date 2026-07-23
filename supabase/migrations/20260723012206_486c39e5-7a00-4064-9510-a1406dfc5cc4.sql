
-- Bills table for Money Center
CREATE TYPE public.bill_frequency AS ENUM ('one_time', 'weekly', 'monthly');
CREATE TYPE public.bill_status AS ENUM ('pending', 'paid');

CREATE TABLE public.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  category text,
  due_date date NOT NULL,
  frequency public.bill_frequency NOT NULL DEFAULT 'monthly',
  status public.bill_status NOT NULL DEFAULT 'pending',
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  notes text,
  auto_create_transaction boolean NOT NULL DEFAULT false,
  last_paid_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bills TO authenticated;
GRANT ALL ON public.bills TO service_role;

ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own bills"
  ON public.bills
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX bills_user_due_idx ON public.bills (user_id, due_date) WHERE deleted_at IS NULL;

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
