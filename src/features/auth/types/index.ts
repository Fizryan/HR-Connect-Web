import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email format invalid" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: string;
  data: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  user: AuthUser;
}

export interface AuthResponse {
  accessToken: string;
  expTime: string;
  refreshToken: string;
}
