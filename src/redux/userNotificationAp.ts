import { baseApi } from "./baseApi";

export const riderNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, per_page = 15, filter = "all" }) => ({
        url: "/notifications",
        params: { page, per_page, filter },
      }),
      providesTags: ["Notification"],
      // Merge results when fetching subsequent pages
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Cache based on filter type so pagination merges correctly per filter
        return `${endpointName}-${queryArgs.filter || "all"}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        currentCache.data.push(...newItems.data);
        currentCache.pagination = newItems.pagination;
        currentCache.unread_count = newItems.unread_count;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    markAsRead: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = riderNotificationApi;
