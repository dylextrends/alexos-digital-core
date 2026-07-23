import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessSnapshot() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>CRM</CardTitle>
        </CardHeader>
        <CardContent>12 Active Leads</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Sales</CardTitle>
        </CardHeader>
        <CardContent>4 Active Deals</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>DailyGear</CardTitle>
        </CardHeader>
        <CardContent>18 Products</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing</CardTitle>
        </CardHeader>
        <CardContent>2 Campaigns Running</CardContent>
      </Card>
    </div>
  );
}
