import axios, { type AxiosInstance } from "axios";

let _userAxios: AxiosInstance | null = null;

export const getUserAxios = () => {
  if (!_userAxios) {
    const config = useRuntimeConfig();
    _userAxios = axios.create({
      baseURL: config.public?.BACKEND_URL || "http://localhost:3000/",
    });
  }
  return _userAxios;
};
