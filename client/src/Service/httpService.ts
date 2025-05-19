import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import properties from "../config/properties";
import  { AxiosError } from "axios";

interface ErrorType{
  response:{
    status:number,
    data:{
      message:string
    }
  }
}
const Api = axios.create({
  baseURL: `${properties?.BASE_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const Error=error as ErrorType
    if (Error.response?.status === 401 && Error?.response?.data?.message =="ACCESS_TOKEN_IS_MISSING" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${properties.BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        return Api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default Api;
