"use client";
import { queryKeys } from "@/lib/query-keys";

import { ApiError } from "@/types/api";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "../types";
import { UserApi } from "../services/user-api";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  token: string;
}

export function UserTable({ users, onEdit, onDelete, token }: UserTableProps) {
  const queryClient = useQueryClient();

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (isActive) {
        await UserApi.deactivateUser(id, token);
      } else {
        await UserApi.activateUser(id, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User status updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b-border/50">
            <TableHead className="font-semibold text-muted-foreground">User</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Role</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="font-medium">No users found.</span>
                  <span className="text-sm opacity-70">Add a new employee to get started.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="group transition-colors hover:bg-muted/40 border-b-border/50">
                <TableCell>
                  <div className="flex items-center gap-4 py-1">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold overflow-hidden border border-primary/20 shadow-sm">
                      {user.data.avatarUrl ? (
                        <img
                          src={user.data.avatarUrl}
                          alt={user.data.firstName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">
                          {user.data.firstName.charAt(0).toUpperCase()}
                          {user.data.lastName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{user.data.firstName} {user.data.lastName}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{user.data.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 shadow-sm">
                    {user.data.role}
                  </span>
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-9 w-9 p-0 rounded-full opacity-50 hover:opacity-100 focus:opacity-100 transition-opacity">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] rounded-xl shadow-lg">
                      <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer rounded-lg">
                        <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => toggleStatusMutation.mutate({ id: user.id, isActive: user.isActive })}
                        className="cursor-pointer rounded-lg"
                      >
                        {user.isActive ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4 text-rose-500" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4 text-emerald-500" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(user)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
