
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
    }),
    changePassword : builder.mutation({
      query : (payload)=>({
        url : "/profile/password",
        method : "PUT",
        body: payload
      }),
      invalidatesTags : ["Auth"]
    }),
    deleteProfile : builder.mutation({
      query : ()=>({
        url : "/profile",
        method : "DELETE"
      }),
      invalidatesTags : ["Auth"]
    })



  }),
});

export const {
  useUserRegistrationMutation,
  useLoginMutation,
  useUserProfileQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useDeleteProfileMutation


} = authApi;