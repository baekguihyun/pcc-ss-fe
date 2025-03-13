import SignUp2 from '@/features/auth/sign-up2'
import { useAuthStore } from '@/stores/authStore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp2,
  beforeLoad: () => {
    const authState = useAuthStore.getState()

    if (authState.auth.member) {
      window.history.back()
    }
  },
})
