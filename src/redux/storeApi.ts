import { baseApi } from "./baseApi";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    storeDetails : builder.query({
        query : (id)=>({
            url : `/ecommerce/stores/${id}`,
            method : "GET"
        })
    })
    
  }),
});

export const {useStoreDetailsQuery} = storeApi;