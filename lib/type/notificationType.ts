
// --- Types ---
export interface NotificationDataDetail {
  type: string;
  title: string;
  message: string;
  order_id?: number;
  order_number?: string;
  earned_amount?: number;
  currency?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  order_id: number | null;
  booking_id: number | null;
  data: NotificationDataDetail;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface NotificationResponse {
  status: string;
  message: string;
  unread_count: number;
  data: NotificationItem[];
  pagination: Pagination;
}

export interface GetNotificationsQueryParams {
  page?: number;
  per_page?: number;
  filter?: "all" | "unread" | "read";
}

