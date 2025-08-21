import { createSlice } from "@/store/utils";

export interface AuthSlice {
  auth: {
    isAuthenticated: boolean;
    setAuthenticated: (v: boolean) => void;
    logout: () => void;
  };
}

export const authSlice = createSlice<AuthSlice>((set) => ({
  auth: {
    isAuthenticated: false,
    setAuthenticated: (v) =>
      set((state) => {
        state.auth.isAuthenticated = v;
      }),
    logout: () =>
      set((state) => {
        state.auth.isAuthenticated = false;
      }),
  },
}));
