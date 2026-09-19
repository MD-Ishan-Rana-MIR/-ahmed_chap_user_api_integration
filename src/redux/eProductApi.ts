import { CategoriesApiResponse, ProductsApiResponse } from "../../lib/type/productType";
import { baseApi } from "./baseApi";



// 2. RTK Query Endpoint Injection
export const eProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesApiResponse, void>({
      query: () => "/ecommerce/categories",
      providesTags : ["Product"]
    }),
    getProducts: builder.query<
      ProductsApiResponse,
      { category_slug?: string; page?: number; per_page?: number }
    >({
      query: ({ category_slug, page = 1, per_page = 10 }) => {
        let url = `/ecommerce/products?page=${page}&per_page=${per_page}`;
        if (category_slug && category_slug !== "all") {
          url += `&category_slug=${category_slug}`;
        }
        return url;
      },
      // Cache management for pagination
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.category_slug || "all"}`;
      },
      merge: (currentCache, responseData, { arg }) => {
        if (arg.page === 1) {
          return responseData;
        }
        currentCache.data.products.data.push(
          ...responseData.data.products.data
        );
        currentCache.data.products.current_page =
          responseData.data.products.current_page;
        currentCache.data.products.last_page =
          responseData.data.products.last_page;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags : ["Product"]
    }),
    productDetails : builder.query({
      query : (id)=>({
        url : `/ecommerce/products/${id}`,
        method : "GET"
      }),
      providesTags : ["Product"]
    }),
    addFavourite : builder.mutation({
      query : (id)=>({
        url : `/ecommerce/favorites/${id}`,
        method : "POST",
      }),
      invalidatesTags : ["Product"]

    }),
    addToCart : builder.mutation({
      query : (payload)=>({
        url : `/ecommerce/cart/add`,
        method : "POST",
        body : payload
      }),
      invalidatesTags : ["Product"]
    }),
    viewCart : builder.query({
      query : ()=>({
        url : "/ecommerce/cart",
        method : "GET"
      }),
      providesTags : ["Product"]
    }),
    removeCartApi : builder.mutation({
      query : (id)=>({
        url : `/ecommerce/cart/items/${id}`,
        method : "DELETE"
      }),
      invalidatesTags : ["Product"]
    }),
    updateCartQuantity : builder.mutation({
      query : ({id,payload})=>({
        url : `/ecommerce/cart/items/${id}`,
        method : "PUT",
        body : payload
      }),
      invalidatesTags : ["Product"]
    }),
    allFavoritesProduct : builder.query({
      query : ()=>({
        url : "/ecommerce/favorites",
        method : "GET"
      }),
      providesTags : ["Product"]
    })

  }),
});

// 3. Export Generated Hooks
export const { useGetCategoriesQuery, useGetProductsQuery,useProductDetailsQuery, useAddFavouriteMutation,useAddToCartMutation,useViewCartQuery , useRemoveCartApiMutation,useUpdateCartQuantityMutation,useAllFavoritesProductQuery } = eProductApi;