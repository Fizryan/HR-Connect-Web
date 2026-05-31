import { z } from "zod";

export type TripStatus = "pending" | "approved" | "rejected";
export type TripType = "domestic" | "international" | "client_visit" | "training" | "conference";

export interface TripRequestData {
  description: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface TripRequest {
  id: string;
  requesterId: string;
  approverId: string | null;
  status: TripStatus;
  data: TripRequestData;
}

export const tripFormSchema = z.object({
  type: z.enum(["domestic", "international", "client_visit", "training", "conference"], {
    required_error: "Please select a trip type",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  description: z.string().min(5, "Destination/Description must be at least 5 characters"),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

export type TripFormValues = z.infer<typeof tripFormSchema>;

export const rejectTripSchema = z.object({
  reason: z.string().min(5, "Please provide a detailed reason for rejection"),
});

export type RejectTripValues = z.infer<typeof rejectTripSchema>;
