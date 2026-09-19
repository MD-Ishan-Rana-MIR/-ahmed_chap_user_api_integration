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