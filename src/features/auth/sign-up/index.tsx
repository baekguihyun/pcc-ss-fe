import { Card } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import AuthLayout from '../auth-layout'
import SignUpAccordion from './components/sign-up-accordion'
import { SignUpDialogs } from './components/sign-up-dialog'
import SignUpProvider from './context/signup-context'


export default function SignUp() { 
  return (
    <SignUpProvider>
      <AuthLayout>
        <Card className='p-3'>
          <div className='mb-2 flex flex-col space-y-2 text-left'>
            <h1 className='text-lg font-semibold tracking-tight'>
              회원가입
            </h1>
            <p className='text-sm text-muted-foreground'>
              내 정보가 시스템에 등록되어 있는지 먼저 확인하고 <br />
              아이디와 패스워드를 등록하고 가입해주세요.<br />
              이미 계정 등록되어있다면 {' '}
              <Link
                to='/sign-in'
                className='underline underline-offset-4 hover:text-primary'
              >
                로그인 페이지
              </Link>
              {' '}
              를 클릭해주세요.
            </p>
          </div>
          <SignUpAccordion />
        </Card>
      </AuthLayout>
      <SignUpDialogs />
    </SignUpProvider>
  )
}
