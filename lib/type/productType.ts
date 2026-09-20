// 1. Interfaces & Types
export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  type: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  type: string;
  subcategories: SubCategory[];
}

export interface CategoriesApiResponse {
  status: string;
  message: string;
  data: {
    categories: Category[];
  };
}

export interface Store {
  id: number;
  business_name: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  profile_image: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  currency: string;
  unit_type: string;
  unit_value: string;
  has_variants: boolean;
  rating: number;
  reviews_count: number;
  is_favorite: boolean;
  primary_image: string | null;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  sub_category: {
    id: number;
    name: string;
    slug: string;
  };
  store: Store;
  available_colors: any[];
  available_sizes: any[];
  variants: any[];
}

export interface ProductsApiResponse {
  status: string;
  message: string;
  data: {
    products: {
      current_page: number;
      data: Product[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  };
}



export interface OrderItem {
  id: number;
  order_number: string;
  order_batch_id: string;
  type: string;
  status: string;
  payment_method: string;
  currency: string;
  total_amount: number;
  delivery_fee: number;
  grand_total: number;
  created_at: string;
  store: {
    business_name: string;
  };
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string | null;
  }>;
}

export interface OrdersApiResponse {
  status: string;
  message: string;
  data: {
    counts: {
      active: number;
      completed: number;
      cancelled: number;
    };
    orders: {
      current_page: number;
      last_page: number;
      total: number;
      data: OrderItem[];
    };
  };
}