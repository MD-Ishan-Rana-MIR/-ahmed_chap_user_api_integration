import { baseApi } from "./baseApi";

export const hotelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNearHotel: builder.query({
            query: () => ({
                url: `/hotel/properties?per_page=5`,
                method: "GET"
            }),
            providesTags: ["hotel"]
        }),
        hotelDetails: builder.query({
            query: (id) => ({
                url: `/hotel/properties/${id}`,
                method: "GET"
            }),
            providesTags: ["hotel"]
        }),
        getPopularHotels: builder.query({
            query: ({ page = 1, per_page = 15, sort_by = "popular" }) =>
                `/hotel/properties?page=${page}&per_page=${per_page}&sort_by=${sort_by}`,

            // Keep cache key consistent across different page parameter changes
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },

            // Merge newly fetched page items into existing accumulated data
            merge: (currentCache, responseData, { arg }) => {
                if (arg.page === 1) {
                    return responseData;
                }
                currentCache.data.properties.current_page =
                    responseData.data.properties.current_page;
                currentCache.data.properties.last_page =
                    responseData.data.properties.last_page;
                currentCache.data.properties.data.push(
                    ...responseData.data.properties.data
                );
            },

            // Force refetch when page changes to pull next page data
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
        }),

        getNearHotels: builder.query({
            query: ({ page, lat, lon, perPage = 10 }) =>
                `/hotel/properties?per_page=${perPage}&sort_by=near&lat=${lat}&lon=${lon}&page=${page}`,
            // Query caching handle check based on lat and lon parameters
            serializeQueryArgs: ({ queryArgs }) => {
                return `nearHotels-${queryArgs.lat}-${queryArgs.lon}`;
            },
            // Previous page items-er sathe next page data append logic
            merge: (currentCache, responseData, { arg }) => {
                if (arg.page === 1) {
                    return responseData;
                }
                currentCache.data.properties.data.push(
                    ...responseData.data.properties.data
                );
                currentCache.data.properties.current_page =
                    responseData.data.properties.current_page;
            },
            // Cache refill avoid korar jonno refetch condition
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        hotelSearch: builder.query({
            query: ({ location, guest }) => ({
                url: `/hotel/properties?location=${location}&guests=${guest}`,
                method: "GET"
            }),
            providesTags: ["hotel"]
        })
    }),
});

export const {

    useGetNearHotelQuery,
    useHotelDetailsQuery,
    useGetPopularHotelsQuery,
    useHotelSearchQuery,
    useGetNearHotelsQuery


} = hotelApi;
