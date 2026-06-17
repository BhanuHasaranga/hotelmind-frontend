export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
}

export interface Reservation {
  id: string;
  room_id: string;
  guest_id: string;
  check_in_date: string;
  check_out_date: string;
  status: ReservationStatus;
  adults: number;
  children: number;
  total_amount: string;
  paid_amount: string;
  special_requests: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  guest?: Guest;
}
