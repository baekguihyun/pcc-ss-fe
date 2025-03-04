import { postLogin } from '@/api/authApi'
import { toast } from '@/hooks/use-toast'
import { getCookie, removeCookie, setCookie } from '@/utils/cookie-util'
import { AxiosError, AxiosResponse } from 'axios'
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
  loading: boolean
  // prevRedirectTo: string | undefined
  // setPrevRedirectTo: (redirectTo: string | undefined) => void
  auth: {
    member: MemberAuth | null
    setMember: (user: MemberAuth | null) => void
    logout: () => void
    login: (param: AuthParam, router: () => void) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const initMember = getCookie(COOKIE_TOKEN)
  return {
    loading: false,
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
      login:(param, router) => {
        set((state) => {
          return { ...state, loading: true }
        })

        postLogin(param)
          .then((response: AxiosResponse) => {
            const respData = response.data

            const code = respData.code
            
            if (code == '0') {
              console.log(respData)
              const result = respData.result;

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

              toast({
                title: '안내',
                description: '로그인 되었습니다.',
                variant: 'success',
                duration: 1000
              })

              setTimeout(() => {
                router()
              }, 1000)

            }
            else if (code == '7') {
              toast({
                title: '안내',
                description: '아이디 또는 비밀번호가 일치하지 않습니다.',
                variant: 'destructive'
              })
            }
            else {
              toast({
                title: '안내',
                description: '알 수 없는 에러가 발생했습니다.',
                variant: 'destructive'
              })
            }
          })
          .catch((error: AxiosError) => {
            console.log(error)
            
            // if (!error.data )
            if (error.response) {
              toast({
                title: '안내',
                description: '서버 에러가 발생했습니다.',
                variant: 'destructive'
              })
            }
          })
          .finally(() => {
            set((state) => {
              return {...state, loading: false}
            })
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
