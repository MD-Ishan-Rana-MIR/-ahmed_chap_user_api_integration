import { ImageSourcePropType } from "react-native";

export interface Hotel {
    id: string;
    title: string;
    location: string;
    rating: number;
    price: number;
    originalPrice: number;
    image: ImageSourcePropType;
}

import { Ionicons } from "@expo/vector-icons";

export type CategoryType = "products" | "hotels" | "restaurants" | "bus";
export type TabStatus = "active" | "completed" | "cancelled";

export interface CategoryItem {
  id: CategoryType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface TabItem {
  id: TabStatus;
  label: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  title: string;
  items: string;
  time: string;
  price: string;
  status: string;
  category: CategoryType;
  tabStatus: TabStatus;
  imageUri: string;
}

export interface SectionProps {
  orders: OrderItem[];
  activeTab: TabStatus;
  onCancel: (id: string) => void;
  onTrack: (id: string) => void;
  onOpenFeedback: (id: string) => void;
}


export interface HotelImage {
  id: number;
  hotel_id: number;
  image_path: string;
  is_primary: boolean;
  image_url: string;
}

export interface MerchantProfile {
  id: number;
  user_id: number;
  country: string;
  city: string;
  currency: string;
  status: string;
  business_name: string;
  address: string;
  phone_number: string;
  latitude: number;
  longitude: number;
}

export interface HotelItem {
  id: number;
  merchant_profile_id: number;
  name: string;
  address: string;
  city: string;
  description: string;
  price_per_night: string;
  room_quantity: number;
  max_guests: number;
  facilities: string[];
  lat: number;
  lon: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  reviews_avg_rating: string | null;
  reviews_count: number;
  distance_km: number;
  is_favorite: boolean;
  images: HotelImage[];
  merchant_profile: MerchantProfile;
}

export interface FavoriteHotelsResponse {
  status: string;
  message: string;
  data: {
    properties: {
      current_page: number;
      data: HotelItem[];
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}