"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceApi } from "@/features/attendance/services/attendance-api";
import { queryKeys } from "@/lib/query-keys";
import type { ApiError } from "@/types/api";

export default function AttendancePage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.role?.toLowerCase() || "staff";
  const queryClient = useQueryClient();

  const isApprover = ["admin", "director", "manager", "supervisor"].includes(
    userRole,
  );
  const { data: myAttendance, isLoading: loadingMy } = useQuery({
    queryKey: queryKeys.attendance.my,
    queryFn: () => AttendanceApi.getMyAttendance(token),
    enabled: !!token,
  });

  const { data: allAttendance, isLoading: loadingAll } = useQuery({
    queryKey: queryKeys.attendance.all,
    queryFn: () => AttendanceApi.getAllAttendance(token),
    enabled: !!token && isApprover,
  });

  const checkInMutation = useMutation({
    mutationFn: async () =>
      await AttendanceApi.checkIn("web-manual-checkin", token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      toast.success("Successfully checked in!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Check in failed");
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () =>
      await AttendanceApi.checkOut("web-manual-checkout", token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      toast.success("Successfully checked out!");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Check out failed");
    },
  });

  const [qrCode, setQrCode] = useState<string | null>(null);
  const generateQrMutation = useMutation({
    mutationFn: async () => await AttendanceApi.generateTodayQR(token),
    onSuccess: (data) => {
      setQrCode(data.png);
      toast.success("QR Code generated for today");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to generate QR Code",
      );
    },
  });

  const formatUnixDate = (unixStr: string) => {
    try {
      const ms = Number(unixStr) * 1000;
      return format(new Date(ms), "PP pp");
    } catch {
      return "Invalid Date";
    }
  };

  const LoadingState = () => (
    <div className="flex h-64 items-center justify-center rounded-2xl border bg-card text-card-foreground shadow-sm border-dashed border-border/60">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-medium animate-pulse">
          Loading attendance records...
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl shadow-sm border border-border/50 bg-gradient-to-br from-card to-muted/20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            Attendance
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Track your daily clock-ins and clock-outs efficiently.
          </p>
        </div>
      </div>

      <Tabs defaultValue="my-attendance" className="space-y-6">
        <TabsList className="bg-card border shadow-sm p-1">
          <TabsTrigger
            value="my-attendance"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6"
          >
            My Attendance
          </TabsTrigger>
          {isApprover && (
            <>
              <TabsTrigger
                value="all-attendance"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6"
              >
                All Attendance
              </TabsTrigger>
              <TabsTrigger
                value="qr-generator"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-6"
              >
                QR Generator
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="my-attendance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col justify-center items-center space-y-6 py-12">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Web Check-In System</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Use the buttons below to log your daily attendance. Ensure you
                  are connected to the company network.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 px-8 shadow-lg shadow-emerald-600/20"
                  onClick={() => checkInMutation.mutate()}
                  disabled={checkInMutation.isPending}
                >
                  {checkInMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <LogIn className="w-5 h-5 mr-2" />
                  )}
                  Check In
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl h-14 px-8 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:hover:bg-rose-950/30"
                  onClick={() => checkOutMutation.mutate()}
                  disabled={checkOutMutation.isPending}
                >
                  {checkOutMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5 mr-2" />
                  )}
                  Check Out
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border/50 bg-muted/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>
              </div>
              <div className="flex-1 overflow-auto max-h-[300px]">
                {loadingMy ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : myAttendance?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No recent attendance records.
                  </div>
                ) : (
                  <ul className="divide-y divide-border/50">
                    {myAttendance?.map((record, idx) => (
                      <li
                        key={idx}
                        className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-medium">Scanned</span>
                        </div>
                        <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                          {formatUnixDate(record.scannedAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {isApprover && (
          <>
            <TabsContent value="all-attendance" className="space-y-4">
              <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b-border/50">
                      <TableHead className="font-semibold">User ID</TableHead>
                      <TableHead className="font-semibold">
                        Total Scans
                      </TableHead>
                      <TableHead className="font-semibold">
                        Latest Scan Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingAll ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="h-32 text-center text-muted-foreground"
                        >
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : allAttendance?.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="h-32 text-center text-muted-foreground"
                        >
                          No attendance records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      allAttendance?.map((userAtt, idx) => {
                        const sortedLogs = [...userAtt.attendance].sort(
                          (a, b) => Number(b.scannedAt) - Number(a.scannedAt),
                        );
                        const latestScan = sortedLogs[0]?.scannedAt;

                        return (
                          <TableRow
                            key={idx}
                            className="border-b-border/50 hover:bg-muted/40"
                          >
                            <TableCell className="font-mono text-sm">
                              {userAtt.userId}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                {userAtt.attendance.length} logs
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {latestScan ? formatUnixDate(latestScan) : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="qr-generator" className="space-y-4">
              <div className="bg-card rounded-2xl border shadow-sm p-8 max-w-xl mx-auto text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Today's QR Code
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Generate a fresh QR Code for employees to scan via the
                    mobile application.
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 min-h-[250px] flex flex-col items-center justify-center">
                  {generateQrMutation.isPending ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  ) : qrCode ? (
                    <div className="space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="p-4 bg-white rounded-xl shadow-sm border inline-block">
                        {/* We use next/image to render base64, assuming backend returns base64 prefix or raw base64 */}
                        <Image
                          src={
                            qrCode.startsWith("data:image")
                              ? qrCode
                              : `data:image/png;base64,${qrCode}`
                          }
                          alt="Attendance QR Code"
                          width={200}
                          height={200}
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Ready to scan!
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Click the button below to generate today's code.
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full h-12 text-md rounded-xl"
                  onClick={() => generateQrMutation.mutate()}
                  disabled={generateQrMutation.isPending}
                >
                  Generate QR Code
                </Button>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
