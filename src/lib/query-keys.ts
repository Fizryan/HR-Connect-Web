export const queryKeys = {
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
  },
  leave: {
    my: ["myLeaves"] as const,
    pending: ["pendingLeaves"] as const,
    all: ["allLeaves"] as const,
  },
  trip: {
    my: ["myTrips"] as const,
    pending: ["pendingTrips"] as const,
    all: ["allTrips"] as const,
  },
  attendance: {
    my: ["myAttendance"] as const,
    all: ["allAttendance"] as const,
  },
  dashboard: {
    metrics: ["dashboardMetrics"] as const,
  },
} as const;
