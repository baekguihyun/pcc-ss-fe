import SignIn from '@/features/auth/sign-in'
import { useAuthStore } from '@/stores/authStore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  beforeLoad: () => {
    const authState = useAuthStore.getState()

    if (authState.auth.member) {
      window.history.back()
    }
  }
})
