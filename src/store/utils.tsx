import type { Slice, Store } from '@/store/model'
import type { ComponentProps } from 'react'
import type { StateStorage } from 'zustand/middleware'
import { Effect } from '@/store'

/**
 *
 * @description Used to create a slice for the store. Currently only used to type `slice` argument
 *
 * @example
 *
 * ```ts
 * // features/QNAs/store.ts
 * export const QNAsSlice = createSlice<QNAsStore>((set) => ({
      QNAs: {
        currentQNAId: QNAS[0].id,
        updateCurrentQNAById: (currentQNAId) =>
          set((state) => {
            state.QNAs.currentQNAId = currentQNAId
          }),
      },
    }))
 * ```
 *
 */
export const createSlice = <_Slice extends Partial<Store>>(
  slice: Slice<_Slice>,
) => slice

export const createURLStorage = () => {
  const getItem: StateStorage['getItem'] = key => {
    const urlSearchParams = new URLSearchParams(window.location.search)

    return urlSearchParams.get(key) || null
  }

  const setItem: StateStorage['setItem'] = (key, value) => {
    const url = new URL(window.location.href)

    url.searchParams.set(key, value)

    return window.history.pushState(null, '', url)
  }

  const removeItem: StateStorage['removeItem'] = key => {
    const url = new URL(window.location.href)

    url.searchParams.delete(key)

    return window.history.pushState(null, '', url)
  }

  return {
    getItem,
    setItem,
    removeItem,
  }
}

export const createEffect = (
  selector: ComponentProps<typeof Effect>['selector'],
  action: ComponentProps<typeof Effect>['action'],
  cleanup?: ComponentProps<typeof Effect>['cleanup'],
) =>
  function CreatedEffect() {
    return <Effect selector={selector} action={action} cleanup={cleanup} />
  }
