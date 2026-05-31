"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Users as UsersIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/features/users/components/DeleteConfirmDialog";
import { UserFormDialog } from "@/features/users/components/UserFormDialog";
import { UserTable } from "@/features/users/components/UserTable";
import { UserApi } from "@/features/users/services/user-api";
import type { User } from "@/features/users/types";
import { queryKeys } from "@/lib/query-keys";

export default function EmployeesPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => UserApi.getUsers(token),
    enabled: !!token,
  });

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <UsersIcon className="w-7 h-7 text-primary" />
            </div>
            Employees
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Manage your workforce, their roles, and system access with ease.
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl h-11 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Employee
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border bg-card text-card-foreground shadow-sm border-dashed border-border/60">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-medium animate-pulse">Loading employees...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive shadow-sm">
          <p className="font-medium">
            Failed to load employees. Please try again later.
          </p>
        </div>
      ) : (
        <UserTable
          users={users || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          token={token}
        />
      )}

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
        token={token}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        user={selectedUser}
        token={token}
      />
    </div>
  );
}
