import { defineStore } from "pinia";
import { wrapApiCall } from "../utils/handle-try-catch";
import { getUserAxios } from "../utils/userAxios";

export interface User {
  id?: string;
  email?: string;
  name?: string;
  avatar?: string;
  isActive?: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    getCurrentUser: (state) => state.user,
  },

  actions: {
    async loginWithGoogle() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/auth/google", { method: "POST" });
        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err: any) {
        this.error = err.message || "Login failed";
        this.loading = false;
      }
    },

    async fetchUser() {
      this.loading = true;
      try {
        const axios = getUserAxios();
        const response = await axios.get(`/api/auth/user`);
        const data = response.data;
        
        if (data.success && data.user) {
          this.user = data.user;
          this.isAuthenticated = true;
          return true;
        } else {
          this.clearAuth();
          return false;
        }
      } catch (error) {
        this.clearAuth();
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        this.clearAuth();
        navigateTo("/login");
      }
    },

    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
