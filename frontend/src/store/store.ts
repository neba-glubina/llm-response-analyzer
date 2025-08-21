import {
  createStore as createZustandVanillaStore,
  // StateCreator,
} from "zustand/vanilla";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import packageJson from "@/../package.json";
import type { Store } from "@/store/model";
import { fileSlice } from "@/widgets/Calculation/store";
import { authSlice } from "@/widgets/Auth/store";

export const createStore = () => {
  return createZustandVanillaStore<Store>()(
    devtools(
      persist(
        immer((...props) => ({
          ...fileSlice(...props),
          ...authSlice(...props),
        })),
        {
          name: "llm-response-analyzer",
          storage:
            process.env.NODE_ENV === "development" ||
            typeof window === "undefined"
              ? undefined
              : createJSONStorage(() => sessionStorage),
          // partialize: (state) =>
          //   Object.fromEntries(
          //     Object.entries(state).filter(
          //       ([key]) =>
          //         !(['QNAs'] as (keyof Store)[]).includes(key as keyof Store),
          //     ),
          //   ),
          version: Number(packageJson.version),
        }
      )
    )
  );
};
