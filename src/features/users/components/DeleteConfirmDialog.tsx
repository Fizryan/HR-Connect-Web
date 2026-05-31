"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";
import type { ApiError } from "@/types/api";
import { UserApi } from "../services/user-api";
import type { User } from "../types";

interface DeleteConfirmDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
}

export function DeleteConfirmDialog({
  user,
  open,
  onOpenChange,
  token,
}: DeleteConfirmDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (user) {
        await UserApi.deleteUser(user.id, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User deleted successfully");
      onOpenChange(false);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the user account for{" "}
            <span className="font-semibold text-foreground">
              {user?.data?.firstName} {user?.data?.lastName}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Delete Account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
