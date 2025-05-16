import http from "./httpService";
interface loginReq {
  email: string;
  password: string;
}

interface signreq {
  email: string;
  password: string;
  userName: string;
}

export function userLogin(data: loginReq) {
  return http.post(`/api/auth/login`, data);
}

export function userSignup(data: signreq) {
  return http.post(`/api/auth/register`, data);
}

export function getUserData() {
  return http.get("/api/auth/getUserData");
}

export function logoutUser() {
  return http.post("/api/auth/logout");
}

