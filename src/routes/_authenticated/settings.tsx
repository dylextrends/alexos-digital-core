import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Palette, Lock, Database, Globe, Save, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/settings")({ component: Settings });

function Settings() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your Alex OS experience</p>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <div className="p-3 bg-muted rounded-lg flex justify-between items-center">
              <span>Kenya Shilling (KES)</span>
              <span className="text-xl font-bold text-primary">KSh</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All monetary values are displayed in Kenya Shillings
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>
            <div className="p-3 bg-muted rounded-lg">
              <span>East Africa Time (EAT) UTC+3</span>
            </div>
            <p className="text-xs text-muted-foreground">Used for scheduling and reporting</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Format</label>
            <div className="p-3 bg-muted rounded-lg">
              <span>DD/MM/YYYY (Kenya Standard)</span>
            </div>
            <p className="text-xs text-muted-foreground">Used throughout the application</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <div className="p-3 bg-muted rounded-lg">
              <span>English</span>
            </div>
            <p className="text-xs text-muted-foreground">Application language</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingsToggle
            title="Payment Reminders"
            description="Get notified about upcoming payments"
            defaultChecked={true}
          />
          <SettingsToggle
            title="Goal Milestones"
            description="Celebrate goal achievements"
            defaultChecked={true}
          />
          <SettingsToggle
            title="Transaction Alerts"
            description="Notify on large transactions"
            defaultChecked={true}
          />
          <SettingsToggle
            title="Weekly Summary"
            description="Get your weekly financial summary"
            defaultChecked={true}
          />
          <SettingsToggle
            title="Debt Due Dates"
            description="Reminder for debt payment due dates"
            defaultChecked={true}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <div className="flex gap-2">
              <button className="flex-1 p-3 rounded-lg border-2 border-primary bg-slate-900 text-white font-medium text-sm transition-all">
                Dark
              </button>
              <button className="flex-1 p-3 rounded-lg border border-border bg-white text-black font-medium text-sm hover:border-primary transition-all">
                Light
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Accent Color</label>
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-lg bg-blue-500 cursor-pointer border-2 border-blue-500 transition-all hover:scale-110"></div>
              <div className="h-10 w-10 rounded-lg bg-purple-500 cursor-pointer border border-border hover:border-purple-500 transition-all hover:scale-110"></div>
              <div className="h-10 w-10 rounded-lg bg-green-500 cursor-pointer border border-border hover:border-green-500 transition-all hover:scale-110"></div>
              <div className="h-10 w-10 rounded-lg bg-orange-500 cursor-pointer border border-border hover:border-orange-500 transition-all hover:scale-110"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Secure your account with 2FA</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-sm">Data Encryption</p>
              <p className="text-xs text-muted-foreground">Bank-grade encryption enabled</p>
            </div>
            <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
              <Check className="h-4 w-4" /> Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-sm">Session Timeout</p>
              <p className="text-xs text-muted-foreground">Auto logout after 30 minutes</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full gap-2 justify-start">
            📊 Export All Data
          </Button>
          <Button variant="outline" className="w-full gap-2 justify-start">
            🗑️ Clear Cache
          </Button>
          <Button variant="outline" className="w-full gap-2 justify-start">
            🔄 Sync Now
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2 sticky bottom-4">
        <Button asChild variant="outline">
          <Link to="/dashboard">Cancel</Link>
        </Button>
        <Button className="gap-2 flex-1" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {saved ? "Settings Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

function SettingsToggle({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="w-4 h-4 cursor-pointer rounded accent-primary"
      />
    </div>
  );
}
