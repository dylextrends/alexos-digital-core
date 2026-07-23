import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntelligenceFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Intelligence Feed</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          <li>Business</li>
          <li>AI</li>
          <li>Technology</li>
          <li>Health</li>
          <li>Cars</li>
          <li>Sports</li>
        </ul>
      </CardContent>
    </Card>
  );
}
