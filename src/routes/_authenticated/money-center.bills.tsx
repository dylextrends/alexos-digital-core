import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/money-center/bills")({
  component: BillsPage,
});

const bills = [
  {
    name: "Rent",
    amount: 13500,
    due: "Monthly",
    status: "Pending",
  },
  {
    name: "Internet",
    amount: 1500,
    due: "Monthly",
    status: "Pending",
  },
  {
    name: "Electricity",
    amount: 1500,
    due: "Monthly",
    status: "Pending",
  },
];

function BillsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bills Management</h1>
          <p className="text-muted-foreground">Track your recurring payments and obligations.</p>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Bill
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Monthly Bills</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">KSh 16,500</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center gap-2">
            <Calendar className="text-blue-500" />
            <span>3 Bills Due</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center gap-2">
            <AlertCircle className="text-orange-500" />
            <span>Pending Payments</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Bills</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.name}
                className="flex justify-between items-center border rounded-xl p-4"
              >
                <div>
                  <h3 className="font-semibold">{bill.name}</h3>

                  <p className="text-sm text-muted-foreground">{bill.due}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold">KSh {bill.amount.toLocaleString()}</p>

                  <span className="text-xs text-orange-600">{bill.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
