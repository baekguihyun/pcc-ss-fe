import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { getCookie } from '@/utils/cookie-util'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  // @ts-ignore
  beforeLoad: ({location}) => {
    const auth = useAuthStore.getState().auth

    if (!auth.member) {
      // 로그인 상태가 아니면 로그인 페이지로 리디렉션
      throw redirect({
        to: '/sign-in',
      })
    }
  }
})

function RouteComponent() {
  const defaultOpen = !!getCookie('sidebar:state')
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SkipToMain />
      <AppSidebar />
      <div
        id="content"
        className={cn(
          'ml-auto w-full max-w-full',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'transition-[width] duration-200 ease-linear',
          'flex h-svh flex-col',
          'group-data-[scroll-locked=1]/body:h-full',
          'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh',
        )}
      >
        <Outlet />
      </div>
    </SidebarProvider>
  )
}
