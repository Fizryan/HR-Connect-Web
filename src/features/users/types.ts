import { z } from "zod";

export const RoleEnum = z.enum(["admin", "director", "manager", "supervisor", "staff"]);
export type Role = z.infer<typeof RoleEnum>;

export interface UserData {
  avatarUrl: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  data: UserData;
}

// Validation schemas for React Hook Form
export const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: RoleEnum,
});

export const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
