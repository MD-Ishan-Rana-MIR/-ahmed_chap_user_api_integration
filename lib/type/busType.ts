export interface Bus {
  id: number;
  name: string;
  bus_type: string;
  departure_place: string;
  departure_time: string;
  destination_place: string;
  destination_time: string;
  journey_duration: string;
  primary_image: string;
}

export interface Operator {
  id: number;
  business_name: string;
  phone_number: string;
  city: string;
  country: string;
  profile_image: string | null;
}

export interface Booking {
  id: number;
  booking_reference: string;
  travel_date: string;
  travel_date_formatted: string;
  seat_numbers: string[];
  seat_count: number;
  passenger_name: string;
  passenger_phone: string;
  passenger_email: string;
  total_price: number;
  currency: string;
  payment_method: string;
  status: string;
  mpesa_receipt_number: string;
  ticket_url: string;
  bus: Bus;
  operator: Operator;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

export interface BookingsResponse {
  status: string;
  message: string;
  data: {
    bookings: Booking[];
    pagination: Pagination;
  };
}