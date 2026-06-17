export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
}

export interface RoomType {
  id: string;
  branch_id: string;
  name: string;
  base_price: string;
  max_occupancy: number;
  description: string | null;
  amenities: Amenity[];
}

export interface Room {
  id: string;
  floor_id: string;
  room_type_id: string;
  room_number: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "CLEANING";
  is_active: boolean;
  room_type?: RoomType;
}

export interface Branch {
  id: string;
  hotel_id: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  is_main_branch: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  star_rating: number;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  branches: Branch[];
}
