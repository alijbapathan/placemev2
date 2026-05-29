import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        })
      },

      logout: () => {
        // Clear localStorage tokens
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // Clear persisted Zustand state
        localStorage.removeItem('placeme-auth')
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      updateUser: (user) => {
        set({ user })
      },

      setToken: (token) => {
        set({ token })
      },
    }),
    {
      name: 'placeme-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
