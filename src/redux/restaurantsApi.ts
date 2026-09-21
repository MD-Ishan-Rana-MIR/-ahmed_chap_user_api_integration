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

        toggleFavrouiteRes: builder.mutation({
            query: (id) => ({
                url: `/restaurant/favorites/restaurants/${id}`,
                method: "POST"
            }),
            invalidatesTags: ["Restaurant"]
        }),
        resturantDetails: builder.query({
            query: (id) => ({
                url: `/restaurant/restaurants/${id}`,
                method: "GET"
            }),
            providesTags: ["Restaurant"]
        }),
        resturantProductFavToggle: builder.mutation({
            query: (id) => ({
                url: `/restaurant/favorites/${id}`,
                method: "POST"
            }),
            invalidatesTags: ["Restaurant"]
        }),
        resturantProductAddToCart: builder.mutation({
            query: (payload) => ({
                url: `/restaurant/cart/add`,
                method: "POST",
                body: payload

            }),
            invalidatesTags: ["Restaurant"]
        }),

        resturantProductDetails: builder.query({
            query: (id) => ({
                url: `/restaurant/foods/${id}`,
                method: "GET"
            }),
            providesTags: ["Restaurant"]
        }),
        getFavoriteRestaurants: builder.query({
            query: ({ page_no = 1, per_page = 20 }) =>
                `/restaurant/favorites/restaurants?per_page=${per_page}&page_no=${page_no}`,
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newResponse, { arg }) => {
                if (arg.page_no === 1) {
                    return newResponse;
                }
                currentCache.data.restaurants.data.push(
                    ...newResponse.data.restaurants.data
                );
                currentCache.data.restaurants.current_page =
                    newResponse.data.restaurants.current_page;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page_no !== previousArg?.page_no;
            },
            providesTags: ["Restaurant"],
        }),


    }),
})

export const { useGetPopularRestaurantsQuery, useGetNearRestaurantsQuery, useToggleFavrouiteResMutation, useResturantDetailsQuery, useResturantProductFavToggleMutation, useResturantProductAddToCartMutation, useResturantProductDetailsQuery, useGetFavoriteRestaurantsQuery } =
    restaurantApi;