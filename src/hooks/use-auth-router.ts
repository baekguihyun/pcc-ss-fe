import { useAuthStore } from '@/stores/authStore'
import { redirect, useRouter } from '@tanstack/react-router'

const useAuthRouter = () => {
  const router = useRouter()
  // const routerState = useRouterState()
  const auth = useAuthStore.getState().auth

  const goToHome = () => {
		// ----- 홈 페이지로 이동
		router.navigate({ to: '/', replace: true})
	}

  const goToLogin = () => {
    // ----- 로그인 페이지로 이동
    router.navigate({ to: '/sign-in', replace: true})
  }


  const goToLoginReturn = () => {
    if (!auth.member) {
      // 로그인 상태가 아니면 로그인 페이지로 리디렉션
      throw redirect({
        to: '/sign-in', 
      })
    }
  }

  return { goToHome, goToLogin, goToLoginReturn }
}

export default useAuthRouter
