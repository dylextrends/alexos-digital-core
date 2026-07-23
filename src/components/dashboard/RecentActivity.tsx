import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          <li>Added a transaction</li>
          <li>Created a budget</li>
          <li>Uploaded a document</li>
          <li>Completed a task</li>
        </ul>
      </CardContent>
    </Card>
  );
}
