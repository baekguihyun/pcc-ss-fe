import SignUp from '@/features/auth/sign-up'
import { useAuthStore } from '@/stores/authStore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-up/parent')({
  component: SignUp,
  beforeLoad: () => {
    const authState = useAuthStore.getState()

    if (authState.auth.member) {
      window.history.back()
    }
  },
})
