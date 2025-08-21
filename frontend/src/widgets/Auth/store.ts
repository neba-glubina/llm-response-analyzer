import { createSlice } from "@/store/utils";

export interface AuthSlice {
  auth: {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
  };
}

export const authSlice = createSlice<AuthSlice>((set) => ({
  auth: {
    token: null,
    setToken: (token) =>
      set((state) => {
        state.auth.token = token;
      }),
    logout: () =>
      set((state) => {
        state.auth.token = null;
      }),
  },
}));
