import { createFileRoute, redirect } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  beforeLoad: () => {
    const authState = useAuthStore.getState()

    if (authState.auth.member) {
      window.history.back()
    }
  }
})
