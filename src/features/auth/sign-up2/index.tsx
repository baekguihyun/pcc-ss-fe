import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { Button } from '@/components/ui/button'

export default function SignUp2() {
  return (
    <AuthLayout>
      <Card className='p-3'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-lg font-semibold tracking-tight'>회원가입</h1>
          <p className='text-sm text-muted-foreground'>
            가입 유형을 먼저 선택해주세요.
            <br />
            이미 계정 등록되어있다면{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              로그인 페이지
            </Link>{' '}
            를 클릭해주세요.
          </p>
        </div>
        <div className="flex flex-row justify-center items-start gap-2 ">
          <Button type='button' className="flex-1 flex flex-col items-center justify-center text-center 
            rounded-lg text-lg h-[120px]" asChild>
            <Link to='/sign-up'>
              <span className='text-4xl'>🧒</span>
              <span>학생</span>
            </Link>
          </Button>
          <Button type='button' className="flex-1 flex flex-col items-center justify-center text-center 
            rounded-lg text-lg h-[120px]" asChild>
            <Link to='/sign-up'>
              <span className='text-4xl'>👨‍👩‍👧‍👦</span>
              <span>학부모</span>
            </Link>
          </Button>
          <Button type='button' className="flex-1 flex flex-col items-center justify-center text-center 
            rounded-lg text-lg h-[120px]" asChild>
            <Link to='/sign-up'>
              <span className='text-4xl'>🧑‍🏫</span>
              <span>교사</span> 
            </Link>
          </Button>
        </div>
      </Card>
    </AuthLayout>
  )
}
