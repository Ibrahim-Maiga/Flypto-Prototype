'use client'

import { NextUIProvider } from '@nextui-org/react'

import { StoreProvider } from './StoreProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </StoreProvider>
  )
}
