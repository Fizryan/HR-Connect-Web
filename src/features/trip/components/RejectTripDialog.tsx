"use client";
import { queryKeys } from "@/lib/query-keys";

import { ApiError } from "@/types/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { TripApi } from "../services/trip-api";
import { rejectTripSchema, RejectTripValues } from "../types";

interface RejectTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string | null;
  token: string;
}

export function RejectTripDialog({ open, onOpenChange, tripId, token }: RejectTripDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<RejectTripValues>({
    resolver: zodResolver(rejectTripSchema),
    defaultValues: {
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RejectTripValues) => {
      if (tripId) {
        await TripApi.rejectTrip(tripId, values.reason, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trip.pending });
      queryClient.invalidateQueries({ queryKey: queryKeys.trip.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trip.my });
      toast.success("Business trip request rejected");
      form.reset();
      onOpenChange(false);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to reject business trip");
    },
  });

  const onSubmit = (values: RejectTripValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v) form.reset();
      onOpenChange(v);
    }}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-destructive">Reject Trip Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this travel request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rejection Reason</Label>
            <Textarea 
              placeholder="Enter reason..." 
              className="resize-none"
              {...form.register("reason")}
            />
            {form.formState.errors.reason && (
              <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reject Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
