import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup.string().required("Email is required").email("Invalid Email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  userName: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name is too long"),
});

export const signinSchema = yup.object({
  email: yup.string().required("Email is required..").email("Invalid Email"),
  password: yup
    .string()
    .required("Password is required..")
    .min(6, "Password must be atleast 6 characters long"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().required("email is required").email("email is invalid"),
});

export const verifyForgotPasswordSchema = yup.object({
  otp: yup.string().min(4, "otp minimum 4 digit"),
});

export const changePasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required..")
    .min(6, "Password must be atleast 6 characters long"),
});
