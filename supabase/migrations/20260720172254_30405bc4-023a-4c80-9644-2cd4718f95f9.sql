
-- Enums
CREATE TYPE public.account_status AS ENUM ('active', 'archived');
CREATE TYPE public.account_type AS ENUM ('cash', 'bank', 'mobile_money', 'credit_card', 'wallet', 'other');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense', 'transfer', 'adjustment');
CREATE TYPE public.transaction_status AS ENUM ('posted', 'pending', 'void');
CREATE TYPE public.expected_status AS ENUM ('pending', 'received', 'cancelled');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ACCOUNTS
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'wallet',
  color TEXT NOT NULL DEFAULT 'primary',
  type public.account_type NOT NULL DEFAULT 'bank',
  currency TEXT NOT NULL DEFAULT 'KES',
  opening_balance NUMERIC(18,2) NOT NULL DEFAULT 0,
  status public.account_status NOT NULL DEFAULT 'active',
  sort_order INT NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounts TO authenticated;
GRANT ALL ON public.accounts TO service_role;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own accounts" ON public.accounts FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX accounts_user_idx ON public.accounts(user_id) WHERE deleted_at IS NULL;
CREATE TRIGGER accounts_updated BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  type public.transaction_type NOT NULL,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
  transfer_account_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
  category TEXT,
  source TEXT,
  description TEXT,
  reference TEXT,
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  attachment_url TEXT,
  status public.transaction_status NOT NULL DEFAULT 'posted',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own transactions" ON public.transactions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX tx_user_time_idx ON public.transactions(user_id, occurred_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX tx_account_idx ON public.transactions(account_id) WHERE deleted_at IS NULL;
CREATE TRIGGER tx_updated BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BUDGETS
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  month DATE NOT NULL,
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, category, month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO authenticated;
GRANT ALL ON public.budgets TO service_role;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own budgets" ON public.budgets FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER budgets_updated BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- EXPECTED MONEY
CREATE TABLE public.expected_money (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expected_date DATE NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  probability INT NOT NULL DEFAULT 100 CHECK (probability BETWEEN 0 AND 100),
  status public.expected_status NOT NULL DEFAULT 'pending',
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  received_transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expected_money TO authenticated;
GRANT ALL ON public.expected_money TO service_role;
ALTER TABLE public.expected_money ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own expected_money" ON public.expected_money FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER expected_updated BEFORE UPDATE ON public.expected_money
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Account balances view (derived from transactions)
CREATE OR REPLACE VIEW public.account_balances
WITH (security_invoker = true)
AS
SELECT
  a.id AS account_id,
  a.user_id,
  a.opening_balance
    + COALESCE(SUM(CASE
        WHEN t.type = 'income' AND t.account_id = a.id THEN t.amount
        WHEN t.type = 'expense' AND t.account_id = a.id THEN -t.amount
        WHEN t.type = 'transfer' AND t.account_id = a.id THEN -t.amount
        WHEN t.type = 'transfer' AND t.transfer_account_id = a.id THEN t.amount
        WHEN t.type = 'adjustment' AND t.account_id = a.id THEN t.amount
        ELSE 0 END), 0) AS balance,
  COALESCE(SUM(CASE
      WHEN t.type = 'income' AND t.account_id = a.id THEN t.amount
      WHEN t.type = 'transfer' AND t.transfer_account_id = a.id THEN t.amount
      ELSE 0 END), 0) AS money_in,
  COALESCE(SUM(CASE
      WHEN t.type = 'expense' AND t.account_id = a.id THEN t.amount
      WHEN t.type = 'transfer' AND t.account_id = a.id THEN t.amount
      ELSE 0 END), 0) AS money_out
FROM public.accounts a
LEFT JOIN public.transactions t
  ON t.user_id = a.user_id
 AND t.deleted_at IS NULL
 AND t.status = 'posted'
 AND (t.account_id = a.id OR t.transfer_account_id = a.id)
WHERE a.deleted_at IS NULL
GROUP BY a.id;

GRANT SELECT ON public.account_balances TO authenticated;

-- Seed default accounts on user creation
CREATE OR REPLACE FUNCTION public.seed_default_accounts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.accounts (user_id, name, icon, type, currency, sort_order) VALUES
    (NEW.id, 'Cash', 'banknote', 'cash', 'KES', 1),
    (NEW.id, 'M-Pesa', 'smartphone', 'mobile_money', 'KES', 2),
    (NEW.id, 'I&M Bank', 'landmark', 'bank', 'KES', 3),
    (NEW.id, 'KCB Bank', 'landmark', 'bank', 'KES', 4),
    (NEW.id, 'SBM Bank', 'landmark', 'bank', 'KES', 5);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_seed_accounts
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.seed_default_accounts();
