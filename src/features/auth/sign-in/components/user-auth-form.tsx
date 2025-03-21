import { postLogin } from '@/api/authApi'
import { useErrorHandler } from '@/api/commons'
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
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { AxiosError, AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'
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
  const handleError = useErrorHandler()
  const [isLoading, setLoading] = useState(false)

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
    setLoading(true)

    postLogin({
      username: data.username, password: data.password
    })
    .then((response: AxiosResponse) => {
      const respData = response.data

      const code = respData.code
      
      if (code == '0') {
        if (import.meta.env.MODE === 'development') {
          console.log(respData)
        }

        const result = respData.result;

        authStore.auth.login(result)

        toast({
          title: '안내',
          description: '로그인 되었습니다.',
          variant: 'success',
          duration: 1000
        })

        setTimeout(() => {
          goToHome()
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
      handleError(error)
    })
    .finally(() => {
      setLoading(false)
    })
    
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
            <Button className='mt-2' disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
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
