import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TodaysMission() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Mission</CardTitle>
      </CardHeader>

      <CardContent>
        <ol className="list-decimal ml-5 space-y-2">
          <li>Review your budget</li>
          <li>Pay upcoming bills</li>
          <li>Follow up with customers</li>
        </ol>
      </CardContent>
    </Card>
  );
}