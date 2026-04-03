"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Upload } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your creator profile and preferences.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Profile</CardTitle>
          <CardDescription>
            This information is displayed on your public creator page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-3.5 w-3.5" />
                Upload Avatar
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended: 256x256px, PNG or JPG
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" defaultValue="Creator" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@creator" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              defaultValue="Building useful AI dashboard widgets for everyone."
              className="min-h-20"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">New Reviews</div>
              <div className="text-xs text-muted-foreground">
                Get notified when someone reviews your listing
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">New Feedback</div>
              <div className="text-xs text-muted-foreground">
                Get notified for bugs, features, and suggestions
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Purchase Alerts</div>
              <div className="text-xs text-muted-foreground">
                Get notified when someone purchases your widget
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Weekly Summary</div>
              <div className="text-xs text-muted-foreground">
                Receive a weekly email with your analytics summary
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
          <CardDescription>
            Configure how you receive earnings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                placeholder="paypal@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Minimum Payout Threshold</Label>
              <Input
                id="threshold"
                type="number"
                defaultValue="25"
                min="10"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Payouts are processed weekly for balances above the threshold.
          </p>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
