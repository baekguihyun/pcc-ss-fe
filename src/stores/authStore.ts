import { getCookie, removeCookie, setCookie } from '@/utils/cookie-util'
import { create } from 'zustand'

const COOKIE_TOKEN = import.meta.env.VITE_COOKIE_TOKEN

export interface AuthParam {
  username: string
  password: string
}


export interface MemberAuth {
  mbrId: string
  username: string
  deptNm: string
  sgrpNm: string
  schlNm: string
  flnm: string
  roleNames: string[]
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  // prevRedirectTo: string | undefined
  // setPrevRedirectTo: (redirectTo: string | undefined) => void
  auth: {
    member: MemberAuth | null
    setMember: (user: MemberAuth | null) => void
    logout: () => void
    login: (param: MemberAuth) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const initMember = getCookie(COOKIE_TOKEN)

  return {
    // prevRedirectTo: '/',
    // setPrevRedirectTo: (redirectTo) => {
    //   set((state) => ({...state, auth: { ...state.auth, prevRedirectTo: redirectTo}}))
    // },
    auth: {
      member: initMember,
      setMember: (member) => {
        setCookie(COOKIE_TOKEN, JSON.stringify(member), 1)
        set((state) => ({ ...state, auth: { ...state.auth, member: member } }))
      },
      logout: () =>
        set((state) => {
          removeCookie(COOKIE_TOKEN)
          return { ...state, auth: { ...state.auth, member: null} }
        }),
      login:(result: MemberAuth) => {
        set((state) => {
          return { ...state, loading: true }
        })

        get().auth.setMember({
          mbrId: result.mbrId,
          username: result.username,
          deptNm: result.deptNm,
          sgrpNm: result.sgrpNm,
          schlNm: result.schlNm,
          flnm: result.flnm,
          roleNames: result.roleNames,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        })
      },
      reset: () =>
        set((state) => {
          removeCookie(COOKIE_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, member: null, authToken: null },
          }
        }),
    },
  }
})

export const useAuth = () => useAuthStore((state) => state.auth)
