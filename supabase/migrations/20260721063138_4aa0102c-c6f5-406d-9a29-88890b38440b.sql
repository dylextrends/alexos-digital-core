
-- Enums
CREATE TYPE public.debt_status AS ENUM ('active','paid','defaulted','archived');
CREATE TYPE public.debt_priority AS ENUM ('low','medium','high');
CREATE TYPE public.goal_status AS ENUM ('active','achieved','paused','archived');

-- Debts
CREATE TABLE public.debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  category text,
  principal numeric NOT NULL DEFAULT 0,
  interest_rate numeric NOT NULL DEFAULT 0,
  minimum_payment numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  due_date date,
  priority public.debt_priority NOT NULL DEFAULT 'medium',
  status public.debt_status NOT NULL DEFAULT 'active',
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debts TO authenticated;
GRANT ALL ON public.debts TO service_role;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own debts" ON public.debts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_debts_updated BEFORE UPDATE ON public.debts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Goals
CREATE TABLE public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'target',
  category text,
  target_amount numeric NOT NULL DEFAULT 0,
  target_date date,
  status public.goal_status NOT NULL DEFAULT 'active',
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own goals" ON public.goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_goals_updated BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Goal contributions
CREATE TABLE public.goal_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  account_id uuid,
  amount numeric NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  note text,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goal_contributions TO authenticated;
GRANT ALL ON public.goal_contributions TO service_role;
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own goal contributions" ON public.goal_contributions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- View: goal progress
CREATE OR REPLACE VIEW public.goal_progress
WITH (security_invoker = true)
AS
SELECT
  g.id AS goal_id,
  g.user_id,
  COALESCE(SUM(c.amount) FILTER (WHERE c.deleted_at IS NULL), 0)::numeric AS current_amount
FROM public.goals g
LEFT JOIN public.goal_contributions c ON c.goal_id = g.id
GROUP BY g.id, g.user_id;
GRANT SELECT ON public.goal_progress TO authenticated;
GRANT ALL ON public.goal_progress TO service_role;
