import {defineStore} from "pinia";
import {wrapApiCall} from "~/utils/handle-try-catch";
import {getUserAxios} from "../utils/UserAxios";

export const useUserVerifyStore = defineStore("UserVerify", {
  state: () => ({
    currentUser: null,
    isUser: false,
  }),

  getters: {
    getCurrentUser: (state) => state.currentUser,
    getIsUser: (state) => state.isUser,
  },

  actions: {
    // Store token in cookie
    storeTokenInCookie(token: string) {
      const cookie = useCookie("_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: false, // Set to false so it can be accessed client-side
      });
      cookie.value = token;
    },

    // Get token from cookie
    getTokenFromCookie() {
      const cookie = useCookie("_token");
      return cookie.value;
    },

    // Clear User token
    clearUserToken() {
      const cookie = useCookie("_token");
      cookie.value = null;
      this.currentUser = null;
      this.isUser = false;
    },

    // Check if user has valid User access
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

    // Verify User with token
    async verifyUser(token?: string) {
      const userToken = token || this.getTokenFromCookie();

      if (!userToken) {
        this.isUser = false;
        this.currentUser = null;
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
        this.currentUser = user;

        if (user?.role === "User" && user?.mailVerifyAt) {
          this.isUser = true;
        } else {
          this.isUser = false;
          // If user exists but not User, clear token
          if (user) {
            this.clearUserToken();
          }
        }

        return user;
      } catch (error) {
        console.error("User verification failed:", error);
        this.isUser = false;
        this.currentUser = null;
        this.clearUserToken();
        throw error; // Re-throw so middleware can handle it
      }
    },
  },
});
