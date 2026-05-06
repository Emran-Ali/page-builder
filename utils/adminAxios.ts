import axios, {type AxiosInstance} from "axios";

/**
 * Single axios instance for user operations
 * This prevents conflicts with the global axios plugin that automatically adds user tokens
 */

let _userAxios: AxiosInstance | null = null;

export const getuserAxios = () => {
  if (!_userAxios) {
    const config = useRuntimeConfig();
    _userAxios = axios.create({
      baseURL: config.public?.BACKEND_URL || "http://localhost:3000/",
    });
  }
  return _userAxios;
};
