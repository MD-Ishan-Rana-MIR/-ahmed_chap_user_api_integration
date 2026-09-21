import { baseApi } from "./baseApi";

export interface RestaurantItem {
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
    description: string | null;
    created_at: string;
    updated_at: string;
    reviews_avg_rating: number | null;
    reviews_count: number;
    distance_km: number;
    is_favorite: boolean;
    profile_image_url: string | null;
    cover_image_url: string | null;
}

export interface RestaurantResponse {
    status: string;
    message: string;
    data: {
        restaurants: {
            current_page: number;
            data: RestaurantItem[];
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

export const restaurantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPopularRestaurants: builder.query<
            RestaurantResponse,
            { page: number; perPage?: number }
        >({
            query: ({ page, perPage = 5 }) => ({
                url: `/restaurant/restaurants?sort_by=popular&page=${page}&per_page=${perPage}`
            }),
            providesTags: ["Restaurant"]

        }),
        getNearRestaurants: builder.query<
            RestaurantResponse,
            { page: number; lat: number; lon: number; perPage?: number }
        >({
            query: ({ page, lat, lon, perPage = 5 }) => ({
                url: `/restaurant/restaurants?lat=${lat}&lon=${lon}&page=${page}&per_page=${perPage}`,

            }),
            providesTags: ["Restaurant"]

        }),

        toggleFavrouiteRes : builder.mutation({
            query : (id)=>({
                url : `/restaurant/favorites/restaurants/${id}`,
                method : "POST"
            }),
            invalidatesTags : ["Restaurant"]
        })


    }),
})

export const { useGetPopularRestaurantsQuery, useGetNearRestaurantsQuery,useToggleFavrouiteResMutation } =
    restaurantApi;