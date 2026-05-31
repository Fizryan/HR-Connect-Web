"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { queryKeys } from "@/lib/query-keys";
import type { ApiError } from "@/types/api";

import { LeaveApi } from "../services/leave-api";
import { type RejectFormValues, rejectFormSchema } from "../types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveId: string | null;
  token: string;
}

export function RejectDialog({
  open,
  onOpenChange,
  leaveId,
  token,
}: RejectDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RejectFormValues) => {
      if (leaveId) {
        await LeaveApi.rejectLeave(leaveId, values.reason, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.pending });
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.my });
      toast.success("Leave request rejected");
      form.reset();
      onOpenChange(false);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to reject leave");
    },
  });

  const onSubmit = (values: RejectFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) form.reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Reject Leave Request
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this leave request. This will
            be visible to the employee.
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
              <p className="text-xs text-destructive">
                {form.formState.errors.reason.message}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Reject Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
