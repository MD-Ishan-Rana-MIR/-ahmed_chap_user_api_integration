
import { baseApi } from "./baseApi";



export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userRegistration: builder.mutation({
      query: (data) => ({
        url: "/auth/rider/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"]
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: `/auth/login`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"]
    }),
    userProfile : builder.query({
      query : ()=>({
        url : "/profile",
        method : "GET"
      })
    }),
    logout : builder.mutation({
      query : ()=>({
        url : "/auth/logout",
        method : "POST"
      })
    })



  }),
});

export const {
  useUserRegistrationMutation,
  useLoginMutation,
  useUserProfileQuery,
  useLogoutMutation


} = authApi;