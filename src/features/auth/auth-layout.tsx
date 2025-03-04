interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[600px] lg:p-8'>
        <div className="flex items-center justify-center">
            <img src={`${import.meta.env.BASE_URL}/images/logo.png`} />
        </div>
        <div className='mb-4 flex items-center justify-center'>
          <h1 className='text-2xl font-extrabold'>주일학교 신앙점검 시스템</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
