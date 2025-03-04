import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useAuthRouter from '@/hooks/use-auth-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: '아이디를 입력해주세요' }),
  password: z
    .string()
    .min(1, {
      message: '암호를 입력해주세요.',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const authStore = useAuthStore()
  const {goToHome} = useAuthRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // eslint-disable-next-line no-console
    authStore.auth.login({
      username: data.username, password: data.password
    }, goToHome)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input placeholder='PCC' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>비밀번호</FormLabel>
                    {/* <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link> */}
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={authStore.loading}>
              로그인
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                  variant='outline'
                  className='w-full'
                  type='button'
                  asChild>
                  <Link to='/sign-up'>가입하기</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
