import { userApi } from "./apiSlice";

export const tasksApi = userApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query({
      query: () => ({
        url: "/api/tasks/",
      }),
      providesTags: ["Tasks"],
    }),
    getSingleTask: builder.query({
      query: (id: string) => ({
        url: `/api/tasks/${id}`,
      }),
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/tasks/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    addTask: builder.mutation({
      query: ({ ...data }) => ({
        url: "/api/tasks/",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/api/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    enhanceTask: builder.mutation({
      query: (data) => ({
        url: "/api/tasks/enhanceTask",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetSingleTaskQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddTaskMutation,
  useEnhanceTaskMutation,
} = tasksApi;
