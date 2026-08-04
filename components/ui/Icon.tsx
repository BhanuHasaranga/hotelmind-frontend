import {
  LayoutDashboard,
  Building2,
  BedDouble,
  ClipboardList,
  UtensilsCrossed,
  Users,
  TrendingUp,
  TrendingDown,
  MessageSquareText,
  Star,
  CalendarClock,
  ChefHat,
  Hotel,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  X,
  Check,
  ChevronDown,
  Loader2,
  DollarSign,
  ClipboardCheck,
  Utensils,
  Send,
  MessageCircleWarning,
  UserX,
  Radio,
  type LucideIcon,
} from "lucide-react";

export const ICONS = {
  dashboard: LayoutDashboard,
  hotel: Building2,
  bed: BedDouble,
  bookings: ClipboardList,
  restaurant: UtensilsCrossed,
  staff: Users,
  pricing: TrendingUp,
  trendDown: TrendingDown,
  assistant: MessageSquareText,
  guestExperience: Star,
  staffing: CalendarClock,
  demandForecast: ChefHat,
  brand: Hotel,
  alert: AlertTriangle,
  alertCircle: AlertCircle,
  insight: Sparkles,
  close: X,
  check: Check,
  chevronDown: ChevronDown,
  spinner: Loader2,
  revenue: DollarSign,
  reservations: ClipboardCheck,
  restaurantSales: Utensils,
  send: Send,
  complaint: MessageCircleWarning,
  churnRisk: UserX,
  live: Radio,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 18 }: IconProps) {
  const Component = ICONS[name];
  return <Component className={className} size={size} aria-hidden="true" />;
}
