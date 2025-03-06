import { Button } from '@/components/ui/button'

export default function MaintenanceError() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='text-2xl font-medium'>서버 점검 또는 휴식 중이에요</span>
        <p className='text-lg text-center text-muted-foreground'>
          사용가능 시간은 오후 12시 ~ 오후 11시까지입니다. <br />
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            재시도
          </Button>
        </div>
      </div>
    </div>
  )
}
