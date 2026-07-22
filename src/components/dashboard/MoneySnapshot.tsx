import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MoneySnapshot() {
  return (
    <div className="grid gap-4 md:grid-cols-5">

      <Card>
        <CardHeader>
          <CardTitle>Cash Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">KSh 0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">KSh 0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">KSh 0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">KSh 0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">KSh 0</p>
        </CardContent>
      </Card>

    </div>
  );
}