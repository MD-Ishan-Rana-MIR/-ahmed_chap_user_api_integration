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