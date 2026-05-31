"use client";
import { queryKeys } from "@/lib/query-keys";

import { ApiError } from "@/types/api";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { User, CreateUserFormValues, createUserSchema, userSchema, UserFormValues } from "../types";
import { UserApi } from "../services/user-api";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  token: string;
}

export function UserFormDialog({ open, onOpenChange, user, token }: UserFormDialogProps) {
  const isEditing = !!user;
  const queryClient = useQueryClient();

  const form = useForm<CreateUserFormValues | UserFormValues>({
    resolver: zodResolver(isEditing ? userSchema : createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "staff",
      password: "",
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        firstName: user.data.firstName,
        lastName: user.data.lastName,
        email: user.data.email,
        role: user.data.role as any,
      });
    } else if (!open) {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        role: "staff",
        password: "",
      });
    }
  }, [user, open, form]);

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      if (isEditing) {
        await UserApi.updateUser(user.id, values as UserFormValues, token);
      } else {
        await UserApi.createUser(values as CreateUserFormValues, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(isEditing ? "User updated successfully" : "User created successfully");
      onOpenChange(false);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to save user");
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the user's details." : "Enter the details to create a new user account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="text-xs text-destructive">{form.formState.errors.firstName.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="text-xs text-destructive">{form.formState.errors.lastName.message as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select 
              value={form.watch("role") || ""} 
              onValueChange={(val) => form.setValue("role", val as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-xs text-destructive">{form.formState.errors.role.message as string}</p>
            )}
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password" as any)} />
              {(form.formState.errors as any).password && (
                <p className="text-xs text-destructive">{(form.formState.errors as any).password.message as string}</p>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
