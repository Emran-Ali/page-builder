import {defineStore} from "pinia";
import {wrapApiCall} from "../utils/handle-try-catch";
import {getUserAxios} from "../utils/userAxios";

export interface User {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
  role?: string;
  mailVerifyAt?: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
    isUser: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    getCurrentUser: (state) => state.user,
    getIsUser: (state) => state.isUser,
  },

  actions: {
    async loginWithGoogle() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/auth/google", {method: "POST"});
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err: any) {
        this.error = err.message || "Login failed";
        this.loading = false;
      }
    },

    async handleCallback(code: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/auth/google-callback", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({code}),
        });
        const data = await response.json();
        if (data.user) {
          this.user = data.user;
          this.isAuthenticated = true;
          if (data.tokens) {
            sessionStorage.setItem("auth_tokens", JSON.stringify(data.tokens));
          }
        }
      } catch (err: any) {
        this.error = err.message || "Authentication failed";
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await fetch("/api/auth/logout", {method: "POST"});
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        this.isUser = false;
        sessionStorage.removeItem("auth_tokens");
        this.clearCookie("_token");
        navigateTo("/login");
      }
    },

    setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;
    },

    storeTokenInCookie(token: string) {
      const cookie = useCookie("_token", {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: false,
      });
      cookie.value = token;
    },

    getTokenFromCookie() {
      const cookie = useCookie("_token");
      return cookie.value;
    },

    clearUserToken() {
      this.clearCookie("_token");
      this.user = null;
      this.isAuthenticated = false;
      this.isUser = false;
    },

    clearCookie(name: string) {
      const cookie = useCookie(name);
      cookie.value = null;
    },

    async checkUserAccess() {
      const token = this.getTokenFromCookie();
      if (!token) {
        this.isUser = false;
        return false;
      }

      try {
        await this.verifyUser(token);
        return this.isUser;
      } catch (error) {
        console.error("User access check failed:", error);
        this.clearUserToken();
        return false;
      }
    },

    async verifyUser(token?: string) {
      const userToken = token || this.getTokenFromCookie();

      if (!userToken) {
        this.isUser = false;
        this.user = null;
        return null;
      }

      const axios = getUserAxios();

      try {
        const response = await wrapApiCall("verifyUser", async () => {
          return await axios.get(`/auth/current-user`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
        });

        const user = response?.data;
        this.user = user;

        if (user?.role === "User" && user?.mailVerifyAt) {
          this.isUser = true;
          this.isAuthenticated = true;
        } else {
          this.isUser = false;
          if (user) {
            this.clearUserToken();
          }
        }

        return user;
      } catch (error) {
        console.error("User verification failed:", error);
        this.isUser = false;
        this.user = null;
        this.clearUserToken();
        throw error;
      }
    },
  },
});
