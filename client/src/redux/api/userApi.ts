import { userApi } from "./apiSlice";

export const authApi = userApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/api/auth/updateProfile",
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["User"],
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/api/auth/updateAvatar",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = authApi;
