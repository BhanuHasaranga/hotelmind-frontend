export interface Department {
  id: string;
  branch_id: string;
  name: string;
}

export interface Employee {
  id: string;
  department_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string | null;
  hire_date: string;
  is_active: boolean;
  department?: Department;
}

export interface Schedule {
  id: string;
  employee_id: string;
  shift_date: string;
  shift_start: string;
  shift_end: string;
  notes: string | null;
}

export interface Attendance {
  id: string;
  schedule_id: string;
  employee_id: string;
  clock_in: string;
  clock_out: string | null;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
}
