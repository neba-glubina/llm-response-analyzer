import type { StateCreator } from 'zustand/vanilla'
import type { FileStore } from '../widgets/Calculation/store'

export type Store = FileStore

type ZustandMiddleware = [['zustand/devtools', never], ['zustand/immer', never]]

export type Slice<T> = StateCreator<Store, ZustandMiddleware, [], T>
