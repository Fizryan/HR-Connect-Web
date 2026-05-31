"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import type { ApiError } from "@/types/api";

const formatDate = (dateValue: string | undefined) => {
  if (!dateValue) return "";
  const num = Number(dateValue);
  if (!isNaN(num) && num > 100000000) {
    return format(new Date(num * 1000), "MMM d, yyyy");
  }
  return dateValue;
};

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaveApi } from "../services/leave-api";
import type { LeaveRequest } from "../types";

interface LeaveTableProps {
  leaves: LeaveRequest[];
  token: string;
  isApprover?: boolean;
  onReject?: (id: string) => void;
}

export function LeaveTable({
  leaves,
  token,
  isApprover = false,
  onReject,
}: LeaveTableProps) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await LeaveApi.approveLeave(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.pending });
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.all });
      toast.success("Leave request approved");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to approve leave");
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b-border/50">
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Date Range</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            {isApprover && (
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isApprover ? 5 : 4}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="font-medium">No leave requests found.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            leaves.map((leave) => (
              <TableRow
                key={leave.id}
                className="group transition-colors hover:bg-muted/40 border-b-border/50"
              >
                <TableCell>
                  <span className="font-medium capitalize text-sm">
                    {leave.data.type} Leave
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 opacity-70" />
                    <span>
                      {formatDate(leave.data.startDate)} &mdash;{" "}
                      {formatDate(leave.data.endDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm">
                  {leave.data.description}
                </TableCell>
                <TableCell>{getStatusBadge(leave.status)}</TableCell>
                {isApprover && (
                  <TableCell className="text-right">
                    {leave.status.toLowerCase() === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:hover:bg-emerald-900/50"
                          onClick={() => approveMutation.mutate(leave.id)}
                          disabled={approveMutation.isPending}
                        >
                          {approveMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-rose-950/30 dark:border-rose-900 dark:hover:bg-rose-900/50"
                          onClick={() => onReject && onReject(leave.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Processed
                      </span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
