export interface AttendanceRecord {
  scannedAt: string;
}

export interface UserAttendance {
  userId: string;
  attendance: AttendanceRecord[];
}
