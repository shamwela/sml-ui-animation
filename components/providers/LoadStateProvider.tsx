'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type LoadState = {
  /** How many tracked hero assets have finished loading. */
  loadedCount: number
  /** Called by each tracked image's onLoad. */
  assetLoaded: () => void
  /** True once the preloader's exit animation has finished. */
  ready: boolean
  /** Called by the preloader when its exit completes. */
  finishLoading: () => void
}

const LoadStateContext = createContext<LoadState | null>(null)

export const LoadStateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [loadedCount, setLoadedCount] = useState(0)
  const [ready, setReady] = useState(false)

  const assetLoaded = useCallback(() => {
    setLoadedCount((count) => count + 1)
  }, [])

  const finishLoading = useCallback(() => {
    setReady(true)
  }, [])

  const value = useMemo(
    () => ({ loadedCount, assetLoaded, ready, finishLoading }),
    [loadedCount, assetLoaded, ready, finishLoading],
  )

  return (
    <LoadStateContext.Provider value={value}>
      {children}
    </LoadStateContext.Provider>
  )
}

export const useLoadState = () => {
  const context = useContext(LoadStateContext)
  if (!context) {
    throw new Error('useLoadState must be used within a LoadStateProvider')
  }
  return context
}
