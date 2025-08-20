import useSWRMutation from 'swr/mutation'
import { useStore } from '@/store'

const KEY = 'calculation'

const fetcher = async (
  key: typeof KEY,
  {
    arg,
  }: {
    arg: {
      requests: string[]
      ais: string[]
    }
  },
) => {
  console.log('key: ', key)
  console.log('arg: ', arg)

  // make http request

  return null
}

export const useCalculation = () => {
  const files = useStore(state => state.calculationSlice.files)
  const storeAis = useStore(state => state.calculationSlice.ais)

  const {
    data: calculationData,
    error: calculationError,
    isMutating: calculationIsLoading,
    reset: resetCalculation,
    trigger: triggerCalculationBase,
  } = useSWRMutation(KEY, fetcher, {
    onSuccess: successData => {
      // TODO: update store's list
      console.log(successData)
    },
  })

  const triggerCalculation = async () => {
    const requests = files
      ? Object.values(files)
          .map(file => file.content)
          .flat()
      : []

    const ais = storeAis ? Object.values(storeAis).map(ai => ai.value) : []

    try {
      const result = await triggerCalculationBase({
        requests,
        ais,
      })
      return result
    } catch (error) {
      console.error('Error during calculation:', error)
      throw error
    }
  }

  return {
    calculationData,
    calculationError,
    calculationIsLoading,
    resetCalculation,
    triggerCalculation,
  }
}
