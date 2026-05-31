"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  Calendar as CalendarIcon,
  CalendarOff,
  Clock,
  Loader2,
  Plane,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardApi } from "@/features/dashboard/services/dashboard-api";
import { queryKeys } from "@/lib/query-keys";

export default function DashboardPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const user = session?.user;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const { data: metrics, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () => DashboardApi.getMetrics(token),
    enabled: !!token,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div className="relative bg-card rounded-3xl shadow-lg border border-border/50 overflow-hidden group">
        <div className="absolute inset-0 h-32 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent"></div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-primary/10 transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110">
          <Sparkles className="w-96 h-96" />
        </div>

        <div className="relative p-8 sm:p-10 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-16">
          <div className="flex items-end gap-6">
            <div className="h-28 w-28 rounded-3xl overflow-hidden border-4 border-background shadow-xl shrink-0 bg-background/50 backdrop-blur-md">
              <Image
                src={
                  user?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || "User")}+${encodeURIComponent(user?.lastName || "")}&background=random&size=128`
                }
                alt="Profile"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                unoptimized={true}
                priority={true}
              />
            </div>
            <div className="pb-2">
              <h2 className="text-sm font-semibold text-primary tracking-wider uppercase mb-1">
                {format(currentTime, "EEEE, MMMM do, yyyy")}
              </h2>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {getGreeting()},{" "}
                <span className="text-primary">{user?.firstName}</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-base sm:text-lg max-w-xl leading-relaxed">
                Here is what's happening in your HR-Connect workspace today.
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-background/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-border/50 shadow-sm self-center md:self-auto mb-2">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold font-mono tracking-tight">
                {format(currentTime, "HH:mm:ss")}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Local Time
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border bg-card/50 border-dashed border-border/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
            </div>
            <p className="font-medium animate-pulse text-lg">
              Fetching your workspace data...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border/50 bg-gradient-to-b from-card to-card/50 text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <Users className="w-24 h-24 text-primary" />
            </div>
            <div className="p-6 relative z-10 h-full flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Employees
                </h3>
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-5xl font-black tracking-tight text-foreground">
                  {metrics?.totalUser || 0}
                </p>
                <p className="text-sm text-emerald-500 mt-2 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Active users
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/50 bg-gradient-to-b from-card to-card/50 text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <Activity className="w-24 h-24 text-blue-500" />
            </div>
            <div className="p-6 relative z-10 h-full flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Attendance
                </h3>
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div>
                <p className="text-5xl font-black tracking-tight text-foreground">
                  {(metrics?.attendanceRate
                    ? metrics.attendanceRate * 100
                    : 0
                  ).toFixed(0)}
                  %
                </p>
                <p className="text-sm text-blue-500 mt-2 font-semibold">
                  Today's scan rate
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/50 bg-gradient-to-b from-card to-card/50 text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <CalendarOff className="w-24 h-24 text-rose-500" />
            </div>
            <div className="p-6 relative z-10 h-full flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Pending Leaves
                </h3>
                <div className="p-2 bg-rose-500/10 rounded-xl">
                  <CalendarOff className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <div>
                <p className="text-5xl font-black tracking-tight text-foreground">
                  {metrics?.pendingLeave || 0}
                </p>
                <p className="text-sm text-rose-500 mt-2 font-semibold">
                  Awaiting approval
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/50 bg-gradient-to-b from-card to-card/50 text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <Plane className="w-24 h-24 text-amber-500" />
            </div>
            <div className="p-6 relative z-10 h-full flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Pending Trips
                </h3>
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <Plane className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div>
                <p className="text-5xl font-black tracking-tight text-foreground">
                  {metrics?.pendingTrip || 0}
                </p>
                <p className="text-sm text-amber-500 mt-2 font-semibold">
                  Awaiting approval
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
