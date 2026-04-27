"use client";

import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getApiErrorMessage } from "@/lib/api-error";
import { getCurrentUser } from "@/lib/lms-api";
import type { UserProfile } from "@/lib/types";

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const user = await getCurrentUser();
        if (mounted) {
          setProfile(user);
        }
      } catch (requestError) {
        if (mounted) {
          setError(getApiErrorMessage(requestError, "Could not load profile."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  if (!profile) {
    return (
      <p className="text-sm text-danger">{error ?? "Profile unavailable."}</p>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Teacher profile</CardTitle>
            <Badge variant={profile.isVerified ? "success" : "warning"}>
              {profile.isVerified ? "Verified" : "Pending verification"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Info
            label="Name"
            value={profile.name || "Not set"}
            icon={UserRound}
          />
          <Info label="Email" value={profile.email} icon={Mail} />
          <Info
            label="Mobile"
            value={profile.mobileNumber ?? "Not set"}
            icon={Phone}
          />
          <Info
            label="Role"
            value={profile.role ?? "Pending"}
            icon={ShieldCheck}
          />
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-background px-3 py-3">
      <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}
