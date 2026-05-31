"use client";
import { useQuery } from "@tanstack/react-query";
import { CalendarOff, Loader2, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveFormDialog } from "@/features/leave/components/LeaveFormDialog";
import { LeaveTable } from "@/features/leave/components/LeaveTable";
import { RejectDialog } from "@/features/leave/components/RejectDialog";
import { LeaveApi } from "@/features/leave/services/leave-api";
import { queryKeys } from "@/lib/query-keys";

export default function LeavePage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.role?.toLowerCase() || "staff";

  const isApprover = ["admin", "director", "manager", "supervisor"].includes(
    userRole,
  );
  const isAdmin = userRole === "admin" || userRole === "director";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);

  // Queries
  const { data: myLeaves, isLoading: loadingMy } = useQuery({
    queryKey: queryKeys.leave.my,
    queryFn: () => LeaveApi.getMyLeaves(token),
    enabled: !!token,
  });

  const { data: pendingLeaves, isLoading: loadingPending } = useQuery({
    queryKey: queryKeys.leave.pending,
    queryFn: () => LeaveApi.getPendingLeaves(token),
    enabled: !!token && isApprover,
  });

  const { data: allLeaves, isLoading: loadingAll } = useQuery({
    queryKey: queryKeys.leave.all,
    queryFn: () => LeaveApi.getAllLeaves(token),
    enabled: !!token && isAdmin,
  });

  const LoadingState = () => (
    <div className="flex h-64 items-center justify-center rounded-2xl border bg-card text-card-foreground shadow-sm border-dashed border-border/60">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-medium animate-pulse">Loading leave requests...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl shadow-sm border border-border/50 bg-gradient-to-br from-card to-muted/20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CalendarOff className="w-7 h-7 text-primary" />
            </div>
            Leave Requests
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Manage time-off requests, vacations, and sick leaves in one place.
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl h-11 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Request Leave
        </Button>
      </div>

      <Tabs defaultValue="my-leaves" className="space-y-6">
        <TabsList className="bg-card border shadow-sm p-1">
          <TabsTrigger
            value="my-leaves"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6"
          >
            My Leaves
          </TabsTrigger>
          {isApprover && (
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6"
            >
              Pending Approvals
              {pendingLeaves && pendingLeaves.length > 0 && (
                <span className="ml-2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingLeaves.length}
                </span>
              )}
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="all-leaves"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6"
            >
              All Leaves
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="my-leaves" className="space-y-4">
          {loadingMy ? (
            <LoadingState />
          ) : (
            <LeaveTable leaves={myLeaves || []} token={token} />
          )}
        </TabsContent>

        {isApprover && (
          <TabsContent value="pending" className="space-y-4">
            {loadingPending ? (
              <LoadingState />
            ) : (
              <LeaveTable
                leaves={pendingLeaves || []}
                token={token}
                isApprover={true}
                onReject={(id) => setRejectId(id)}
              />
            )}
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="all-leaves" className="space-y-4">
            {loadingAll ? (
              <LoadingState />
            ) : (
              <LeaveTable leaves={allLeaves || []} token={token} />
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      <LeaveFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        token={token}
      />

      <RejectDialog
        open={!!rejectId}
        onOpenChange={(v) => !v && setRejectId(null)}
        leaveId={rejectId}
        token={token}
      />
    </div>
  );
}
