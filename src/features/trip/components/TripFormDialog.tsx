"use client";
import { queryKeys } from "@/lib/query-keys";

import { ApiError } from "@/types/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { TripApi } from "../services/trip-api";
import { TripFormValues, tripFormSchema } from "../types";

interface TripFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
}

export function TripFormDialog({ open, onOpenChange, token }: TripFormDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      type: undefined,
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TripFormValues) => {
      const apiPayload = {
        type: values.type,
        startDate: format(values.startDate, "yyyy-MM-dd"),
        endDate: format(values.endDate, "yyyy-MM-dd"),
        description: values.description,
      };
      await TripApi.createTrip(apiPayload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trip.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.trip.pending });
      queryClient.invalidateQueries({ queryKey: queryKeys.trip.all });
      toast.success("Business trip request submitted");
      form.reset();
      onOpenChange(false);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to submit trip request");
    },
  });

  const onSubmit = (values: TripFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Request Business Trip</DialogTitle>
          <DialogDescription>
            Submit a new business travel or training request for approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
          
          <div className="space-y-2">
            <Label>Trip Type</Label>
            <Select 
              value={form.watch("type") || ""} 
              onValueChange={(val) => form.setValue("type", val as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type of trip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domestic">Domestic Travel</SelectItem>
                <SelectItem value="international">International Travel</SelectItem>
                <SelectItem value="client_visit">Client Visit</SelectItem>
                <SelectItem value="training">Training / Workshop</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-xs text-destructive">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("startDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("startDate") ? format(form.watch("startDate"), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("startDate")}
                    onSelect={(date) => form.setValue("startDate", date as Date)}
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.startDate && (
                <p className="text-xs text-destructive">{form.formState.errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("endDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("endDate") ? format(form.watch("endDate"), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("endDate")}
                    onSelect={(date) => form.setValue("endDate", date as Date)}
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.endDate && (
                <p className="text-xs text-destructive">{form.formState.errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Destination / Purpose</Label>
            <Textarea 
              placeholder="E.g., Jakarta HQ to meet with client ABC..." 
              className="resize-none"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
