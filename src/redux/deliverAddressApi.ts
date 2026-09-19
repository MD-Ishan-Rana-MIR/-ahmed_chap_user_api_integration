import { baseApi } from "./baseApi";

export const deliveryAddressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAddress : builder.mutation({
            query : (payload)=>({
                url : `/addresses`,
                method : "POST",
                body : payload
            }),
            invalidatesTags : ["Address"]
        }),
        getAllAddress : builder.query({
            query : ()=>({
                url : `/addresses`,
                method : "GET"
            }),
            providesTags : ["Address"]
        }),
        deleteAddress : builder.mutation({
            query : (id)=>({
                url : `/addresses/${id}`,
                method : "DELETE"
            }),
            invalidatesTags : ["Address"]
        })

    }),
});

export const {

    useCreateAddressMutation,
    useGetAllAddressQuery,
    useDeleteAddressMutation

} = deliveryAddressApi;
