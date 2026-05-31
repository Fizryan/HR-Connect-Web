"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Users, LayoutDashboard, Calendar, CalendarOff, Plane } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD.HOME, icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Business Trip", href: "/trip", icon: Plane },
  { name: "Attendance", href: "/attendance", icon: Calendar },
  { name: "Leave", href: "/leave", icon: CalendarOff },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card hidden md:block h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">HR Connect</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary hover:bg-primary/10",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
