import type { StateCreator } from "zustand/vanilla";
import type { FileStore } from "../widgets/Calculation/store";
import type { AuthSlice } from "../widgets/Auth/store";

export type Store = FileStore & AuthSlice;

type ZustandMiddleware = [
  ["zustand/devtools", never],
  ["zustand/immer", never]
];

export type Slice<T> = StateCreator<Store, ZustandMiddleware, [], T>;
