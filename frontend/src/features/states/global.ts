import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StoreApi, UseBoundStore } from 'zustand';

interface User {
  username: string
  email: string
  first_name: string
  last_name: string
  user_role: string
}

interface GlobalState {
  user: User | null
  setUser: (user: User) => void
  removeUser: () => void
}


const storeGlobalImpl = (set: any): GlobalState => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null })
})

type UseGlobalStoreType = UseBoundStore<StoreApi<GlobalState>>;

export const useGlobalStore: UseGlobalStoreType =
  process.env.NODE_ENV === 'development'
    ? create(
        persist(
          require('zustand/middleware').devtools(storeGlobalImpl, { name: 'store-global' }),
          { name: 'store-global' }
        )
      )
    : create(
        persist(storeGlobalImpl, { name: 'store-global' })
      )