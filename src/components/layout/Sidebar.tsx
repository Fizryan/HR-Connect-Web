"use client";

import {
  Calendar,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  LayoutDashboard,
  Plane,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/config/routes";
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "border-r bg-card hidden md:flex flex-col h-full transition-all duration-300 relative z-40 shadow-sm",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-primary text-primary-foreground rounded-full p-1 shadow-md hover:bg-primary/90 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div
        className={cn(
          "p-6 flex items-center gap-3",
          isCollapsed ? "justify-center px-2" : "justify-start",
        )}
      >
        <div className="flex items-center justify-center bg-primary text-primary-foreground p-2 rounded-xl shadow-md">
          <Hexagon className="w-6 h-6 fill-current" />
        </div>
        <h2
          className={cn(
            "font-bold tracking-tight text-primary transition-all duration-300 whitespace-nowrap overflow-hidden",
            isCollapsed
              ? "text-xl w-0 opacity-0 hidden"
              : "text-2xl w-auto opacity-100 block",
          )}
        >
          HR Connect
        </h2>
      </div>
      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary hover:bg-primary/10 whitespace-nowrap",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
                isCollapsed ? "justify-center" : "justify-start gap-3",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
