import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],

  endpoints: () => ({}),
});
