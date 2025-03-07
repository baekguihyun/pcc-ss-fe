import { postCheckDpcnUsername, putSignUp } from '@/api/authApi';
import { useErrorHandler } from '@/api/commons';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuthRouter from '@/hooks/use-auth-router';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, AxiosResponse } from 'axios';
import { UserCheck2 } from 'lucide-react';
import { HTMLAttributes, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSignUp } from '../context/signup-context';


type SignUpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: '아이디를 입력해주세요.' }),
    pswd: z
      .string()
      .min(8, {
        message: '비밀번호는 최소 8자 이상 입력해주세요.',
      })
      .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}$/, {
        message: '비밀번호는 숫자, 영문, 특수문자를 포함해야 합니다.'
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.pswd === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const handleError = useErrorHandler()

  const [isLoading, setIsLoading] = useState(false)
  const [isCheckDpcnUsername, setIsCheckDpcnUsername] = useState(false)
  const { setCurrentMbr, signUpMbr } = useSignUp()
  // @ts-ignore
  const { goToHome, goToLogin } = useAuthRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      pswd: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    setIsCheckDpcnUsername(false)
  }, [form.watch('username')])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    if (signUpMbr == null || !signUpMbr.mbrId) {
      toast({
        title: '안내',
        description: '선택된 학생 정보가 없습니다.',
        variant: 'destructive'
      })

      setCurrentMbr(null)

      return;
    }

    signUpMbr.username = data.username
    signUpMbr.pswd = data.pswd
          
    putSignUp(signUpMbr)
      .then((response: AxiosResponse) => {
        const respData = response.data
        
        if (respData.result) {
          toast({
            title: '안내',
            description: '가입이 완료되었습니다.',
            variant: 'success',
            duration: 1000
          })
          
          // 로그인 페이지로 이동하기
          setTimeout(() => {
            goToLogin();
          }, 2000)
        }
        else {
          toast({
            title: '안내',
            description: '가입에 실패했습니다.',
            variant: 'destructive'
          })
        }     
      })
      .catch((error: AxiosError) => {
        handleError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })  
  }

  const onClickValidateID = async (username: string) => {
    setIsLoading(true)

    if (!username || username.length < 1) {
      toast({
        title: '안내',
        description: '아이디를 입력해주세요.',
        variant: 'destructive'
      })
    }

    
    postCheckDpcnUsername(username)
      .then((response: AxiosResponse) => {
        const respData = response.data

        if (respData.result) {
          toast({
            title: '안내',
            description: '중복된 아이디가 있습니다. 다른 아이디를 입력해주세요.',
            variant: 'destructive'
          })
        }
        else {
          toast({
            title: '안내',
            description: '확인되었습니다.',
            variant: 'success'
          })
  
          setIsCheckDpcnUsername(true);
        }
      })
      .catch((error: AxiosError) => {
        handleError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })

  }

  return (
    <div className={cn('grid gap-3', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>아이디</FormLabel>

                  <div className='flex w-full items-center space-x-1'>
                    <FormControl>
                      <Input placeholder='PCC' {...field} />
                    </FormControl>
                    <Button type='button' onClick={() => {onClickValidateID(field.value)}} 
                      disabled={isCheckDpcnUsername || isLoading}>
                      <UserCheck2 />
                      중복확인
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pswd'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={!isCheckDpcnUsername || isLoading}>
              가입하기
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}