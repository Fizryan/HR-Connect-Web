import { z } from "zod";

export type LeaveStatus = "pending" | "approved" | "rejected";
export type LeaveType = "other" | "sick" | "casual" | "maternity" | "paternity";

export interface LeaveRequestData {
  description: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface LeaveRequest {
  id: string;
  requesterId: string;
  approverId: string | null;
  status: LeaveStatus;
  data: LeaveRequestData;
}

export const leaveFormSchema = z
  .object({
    type: z.enum(["other", "sick", "casual", "maternity", "paternity"], {
      required_error: "Please select a leave type",
    }),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
    description: z.string().min(5, "Description must be at least 5 characters"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export type LeaveFormValues = z.infer<typeof leaveFormSchema>;

export const rejectFormSchema = z.object({
  reason: z.string().min(5, "Please provide a detailed reason for rejection"),
});

export type RejectFormValues = z.infer<typeof rejectFormSchema>;
