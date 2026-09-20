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


    cancelEcommerceOrder : builder.mutation({
        query : ({reason,id})=>({
            url : `/ecommerce/orders/${id}/cancel`,
            method : "POST",
            body : reason
        }),
        invalidatesTags : ["Product","Order"]
    }),
    provideEcommerceProductFeedback : builder.mutation({
        query : ({id,payload})=>({
            url : `/ecommerce/orders/${id}/review`,
            method : "POST",
            body : payload
        }),
        invalidatesTags : ["Product","Order"]
    })


  }),
});

export const { useGetEcommerceProductOrderQuery,useCancelEcommerceOrderMutation,useProvideEcommerceProductFeedbackMutation } = orderApi;