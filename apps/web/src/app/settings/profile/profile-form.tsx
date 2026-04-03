"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/lib/actions/user.actions";
import { toast } from "sonner";

interface ProfileFormProps {
  user: {
    name: string | null;
    username: string | null;
    bio: string | null;
    email: string | null;
    image: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, username, bio });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user.email || ""} disabled className="opacity-60" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-username"
          />
          <p className="text-xs text-muted-foreground">
            Used for your creator profile URL
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
