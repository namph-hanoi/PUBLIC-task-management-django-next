import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StoreApi, UseBoundStore } from 'zustand';

interface User {
  username: string
  email: string
  first_name: string
  last_name: string
  user_role: string
  image?: string 
}

interface GlobalState {
  user: User | null
  setUser: (user: User) => void
  removeUser: () => void
  seedUserEmails: string[]
  seedSuccess: boolean
  setSeedSuccess: (success: boolean) => void
  seededAccountToSignIn: string | null
  setSeededAccountToSignIn: (email: string | null) => void
}

const storeGlobalImpl = (set: any): GlobalState => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
  // state for seeds
  seedUserEmails: [
    "employer@localhost.com",
    "employee_a@localhost.com",
    "employee_b@localhost.com",
    "employee_c@localhost.com"
  ],
  seedSuccess: false,
  setSeedSuccess: (success) => set({ seedSuccess: success }),
  seededAccountToSignIn: null,
  setSeededAccountToSignIn: (email) => set({ seededAccountToSignIn: email })
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