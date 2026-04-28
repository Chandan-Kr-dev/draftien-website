"use client";

import { CheckCircle, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  mobileNumber: string;
  notificationToken: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedAuth = localStorage.getItem("draftien:auth");
        const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
        const token = parsedAuth?.token ?? localStorage.getItem("token");

        const apiBaseUrl =
          process.env.EXPO_PUBLIC_API_BASE_URL ??
          process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${apiBaseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF]">
        <p className="text-lg font-medium text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF]">
        <p className="text-lg font-medium text-red-500">
          Failed to load profile.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F3FF] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
              {/* Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-indigo-600">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* User Info */}
              <div className="mt-4 text-center sm:mt-0 sm:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-indigo-100">{user.email}</p>

                <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {/* Role Badge */}
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold capitalize">
                    {user.role}
                  </span>

                  {/* Verified Badge */}
                  {user.isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-100">
                      <CheckCircle size={14} />
                      Verified
                    </span>
                  )}

                  {/* Active Badge */}
                  {user.isActive && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                      <ShieldCheck size={14} />
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Profile Information
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <ProfileItem
                icon={<User className="h-5 w-5 text-indigo-600" />}
                label="Full Name"
                value={user.name}
              />

              {/* Email */}
              <ProfileItem
                icon={<Mail className="h-5 w-5 text-indigo-600" />}
                label="Email Address"
                value={user.email}
              />

              {/* Mobile Number */}
              <ProfileItem
                icon={<Phone className="h-5 w-5 text-indigo-600" />}
                label="Mobile Number"
                value={user.mobileNumber}
              />

              {/* User ID */}
              <ProfileItem
                icon={<ShieldCheck className="h-5 w-5 text-indigo-600" />}
                label="User ID"
                value={user.id}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileItem({ icon, label, value }: ProfileItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
