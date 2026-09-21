import { OrdersApiResponse } from "../../lib/type/productType";
import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEcommerceProductOrder: builder.query<
      OrdersApiResponse,
      { filter: string; page: number; perPage?: number }
    >({
      query: ({ filter, page, perPage = 10 }) =>
        `/ecommerce/orders?filter=${filter}&per_page=${perPage}&page_no=${page}`,

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.filter}`;
      },

      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }

        const existingList = currentCache?.data?.orders?.data || [];
        const newList = newItems?.data?.orders?.data || [];

        const existingIds = new Set(existingList.map((item) => item.id));
        const filteredNewList = newList.filter((item) => !existingIds.has(item.id));

        currentCache.data.orders.data.push(...filteredNewList);
        currentCache.data.orders.current_page = newItems.data.orders.current_page;
        currentCache.data.orders.last_page = newItems.data.orders.last_page;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),


    cancelEcommerceOrder: builder.mutation({
      query: ({ reason, id }) => ({
        url: `/ecommerce/orders/${id}/cancel`,
        method: "POST",
        body: reason
      }),
      invalidatesTags: ["Product", "Order"]
    }),
    provideEcommerceProductFeedback: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/ecommerce/orders/${id}/review`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Product", "Order"]
    }),

    getRestaurantOrders: builder.query({
      query: ({ filter = "active", page = 1, perPage = 10 }) => ({
        url: `/restaurant/orders`,
        params: {
          filter: filter,
          per_page: perPage,
          page_no: page,
        },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.filter}`;
      },
      merge: (currentCache, responseData, { arg }) => {
        if (arg.page === 1) {
          return responseData;
        }
        currentCache.data.orders.data.push(...responseData.data.orders.data);
        currentCache.data.orders.current_page = responseData.data.orders.current_page;
        currentCache.data.orders.last_page = responseData.data.orders.last_page;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.filter !== previousArg?.filter;
      },
      providesTags: ["Product", "Order"]
    }),

    cancelFoodOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/restaurant/orders/${id}/cancel`,
        method: "POST",
        body: reason
      }),
      invalidatesTags: ["Product", "Order"]
    }),
    provideFoodFeedback: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/restaurant/orders/${id}/review`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Order", "Product"]
    }),


    getHotelBookings: builder.query({
      query: ({ filter = "active", page = 1, perPage = 10 }) => ({
        url: `/hotel/bookings?filter=${filter}&page_no=${page}&per_page=${perPage}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.filter}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        currentCache.data.bookings.data.push(...newItems.data.bookings.data);
        currentCache.data.bookings.current_page = newItems.data.bookings.current_page;
        currentCache.data.bookings.last_page = newItems.data.bookings.last_page;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    cancelBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/hotel/bookings/${id}/cancel`,
        method: "POST",
        body: reason
      }),
      invalidatesTags : ["Product","Order"]
    }),

    feedbackBooking : builder.mutation({
      query : ({id,payload})=>({
        url : `/hotel/properties/${id}/reviews`,
        method : "POST",
        body : payload
      }),
      invalidatesTags : ["Product","Order"]
    })








  }),
});

export const { useGetEcommerceProductOrderQuery, useCancelEcommerceOrderMutation, useProvideEcommerceProductFeedbackMutation, useGetRestaurantOrdersQuery, useCancelFoodOrderMutation, useProvideFoodFeedbackMutation, useGetHotelBookingsQuery,useCancelBookingMutation,useFeedbackBookingMutation } = orderApi;