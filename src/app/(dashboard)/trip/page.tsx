"use client";
import { queryKeys } from "@/lib/query-keys";


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Plus, Plane, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripTable } from "@/features/trip/components/TripTable";
import { TripFormDialog } from "@/features/trip/components/TripFormDialog";
import { RejectTripDialog } from "@/features/trip/components/RejectTripDialog";
import { TripApi } from "@/features/trip/services/trip-api";

export default function TripPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.role?.toLowerCase() || "staff";
  
  const isApprover = ["admin", "director", "manager", "supervisor"].includes(userRole);
  const isAdmin = userRole === "admin" || userRole === "director";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const { data: myTrips, isLoading: loadingMy } = useQuery({
    queryKey: queryKeys.trip.my,
    queryFn: () => TripApi.getMyTrips(token),
    enabled: !!token,
  });

  const { data: pendingTrips, isLoading: loadingPending } = useQuery({
    queryKey: queryKeys.trip.pending,
    queryFn: () => TripApi.getPendingTrips(token),
    enabled: !!token && isApprover,
  });

  const { data: allTrips, isLoading: loadingAll } = useQuery({
    queryKey: queryKeys.trip.all,
    queryFn: () => TripApi.getAllTrips(token),
    enabled: !!token && isAdmin,
  });

  const LoadingState = () => (
    <div className="flex h-64 items-center justify-center rounded-2xl border bg-card text-card-foreground shadow-sm border-dashed border-border/60">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-medium animate-pulse">Loading business trips...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl shadow-sm border border-border/50 bg-gradient-to-br from-card to-muted/20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Plane className="w-7 h-7 text-primary" />
            </div>
            Business Trips
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Manage corporate travel, client visits, and training requests.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl h-11 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Request Trip
        </Button>
      </div>

      <Tabs defaultValue="my-trips" className="space-y-6">
        <TabsList className="bg-card border shadow-sm p-1">
          <TabsTrigger value="my-trips" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6">
            My Trips
          </TabsTrigger>
          {isApprover && (
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6">
              Pending Approvals
              {pendingTrips && pendingTrips.length > 0 && (
                <span className="ml-2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingTrips.length}
                </span>
              )}
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="all-trips" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6">
              All Trips
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="my-trips" className="space-y-4">
          {loadingMy ? <LoadingState /> : <TripTable trips={myTrips || []} token={token} />}
        </TabsContent>

        {isApprover && (
          <TabsContent value="pending" className="space-y-4">
            {loadingPending ? <LoadingState /> : (
              <TripTable 
                trips={pendingTrips || []} 
                token={token} 
                isApprover={true} 
                onReject={(id) => setRejectId(id)}
              />
            )}
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="all-trips" className="space-y-4">
            {loadingAll ? <LoadingState /> : <TripTable trips={allTrips || []} token={token} />}
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      <TripFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        token={token}
      />
      
      <RejectTripDialog 
        open={!!rejectId} 
        onOpenChange={(v) => !v && setRejectId(null)} 
        tripId={rejectId} 
        token={token}
      />
    </div>
  );
}
