import { baseApi } from "./baseApi";

export const staticApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUsPage : builder.query({
        query : ()=>({
            url : `/pages/about-us`,
            method : "GET"
        })
    }),
    getPrivacyPolicy : builder.query({
        query : ()=>({
            url : `/pages/privacy-policy`,
            method : "GET"
        })
    }),
    getTerms : builder.query({
        query : ()=>({
            url : `/pages/terms-and-conditions`,
            method : "GET"
        })
    })

  }),
});

export const { useGetAboutUsPageQuery , useGetPrivacyPolicyQuery, useGetTermsQuery} = staticApi;
