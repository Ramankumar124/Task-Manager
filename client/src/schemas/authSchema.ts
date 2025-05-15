import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = yup.object({
  userName: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be not greator then 50 characters "),

  email: yup.string().required("Email  is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
