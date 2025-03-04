import { createFileRoute, redirect } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp,
  beforeLoad: () => {
    const authState = useAuthStore.getState()

    if (authState.auth.member) {
      window.history.back()
    }
  }
})
