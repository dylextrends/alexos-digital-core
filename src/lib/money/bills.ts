import { supabase } from "@/integrations/supabase/client";

export type BillFrequency = "weekly" | "monthly" | "quarterly" | "yearly";

export interface Bill {
  id: string;
  user_id: string;

  name: string;
  amount: number;

  category: string | null;

  due_day: number | null;

  frequency: BillFrequency;

  notes: string | null;

  account_id: string | null;

  status: string;

  auto_create_transaction: boolean | null;

  created_at: string;
}

export interface CreateBillInput {
  name: string;

  amount: number;

  category?: string | null;

  due_day?: number | null;

  frequency: BillFrequency;

  notes?: string | null;

  account_id?: string | null;

  auto_create_transaction?: boolean;
}

// GET ALL BILLS

export async function getBills(): Promise<Bill[]> {
  const { data, error } = await supabase.from("bills").select("*").order("created_at", {
    ascending: false,
  });

  if (error) {
    throw error;
  }

  return data as Bill[];
}

// GET SINGLE BILL

export async function getBill(id: string): Promise<Bill | null> {
  const { data, error } = await supabase.from("bills").select("*").eq("id", id).single();

  if (error) {
    throw error;
  }

  return data as Bill;
}

// CREATE BILL

export async function createBill(input: CreateBillInput): Promise<Bill> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("bills")
    .insert({
      user_id: user.id,

      name: input.name,

      amount: input.amount,

      category: input.category ?? null,

      due_day: input.due_day ?? null,

      frequency: input.frequency,

      notes: input.notes ?? null,

      account_id: input.account_id ?? null,

      auto_create_transaction: input.auto_create_transaction ?? false,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Bill;
}

// UPDATE BILL

export async function updateBill(id: string, updates: Partial<CreateBillInput>): Promise<Bill> {
  const { data, error } = await supabase
    .from("bills")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Bill;
}

// DELETE BILL

export async function deleteBill(id: string): Promise<void> {
  const { error } = await supabase.from("bills").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

// GET ACTIVE BILLS

export async function getActiveBills(): Promise<Bill[]> {
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("status", "active")
    .order("due_day", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data as Bill[];
}

// TOTAL MONTHLY BILLS

export async function getMonthlyBillsTotal(): Promise<number> {
  const bills = await getActiveBills();

  return bills.reduce(
    (total, bill) => total + Number(bill.amount),

    0,
  );
}
