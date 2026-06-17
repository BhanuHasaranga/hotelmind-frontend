export interface FoodCategory {
  id: string;
  branch_id: string;
  name: string;
  display_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string;
  is_available: boolean;
}

export interface RestaurantTable {
  id: string;
  branch_id: string;
  table_number: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  menu_item?: MenuItem;
}

export interface Order {
  id: string;
  branch_id: string;
  table_id: string | null;
  status: "OPEN" | "CLOSED" | "CANCELLED";
  opened_at: string;
  closed_at: string | null;
  total_amount: string;
  items: OrderItem[];
}
