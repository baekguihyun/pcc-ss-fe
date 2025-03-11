import { postValidateMember } from '@/api/authApi'
import { useErrorHandler } from '@/api/commons'
import DatePickerFormItem from '@/components/date-picker-form-item'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField
} from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError, AxiosResponse } from 'axios'
import { format, getYear } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SearchMbr, SignUpMember, useSignUp } from '../context/signup-context'
import { Loader2 } from 'lucide-react'

export function SignUpDialogs() {
  const { currentMbr, setCurrentMbr, setSignUpMbr } = useSignUp()

  return (
    <>
      <IdentifyMbrDialog
        key={`member-identify-${currentMbr?.mbrId}`}
        currentMbr={currentMbr}
        setCurrentMbr={setCurrentMbr}
        setSignUpMbr={setSignUpMbr}
      />
    </>
  )
}

const formSchema = z.object({
  brdt: z.date({
    required_error: '생년월일을 입력해주세요.',
  }),
})

interface Props {
  currentMbr: SearchMbr | null
  setCurrentMbr: (member: SearchMbr | null) => void
  setSignUpMbr: (member: SignUpMember | null) => void
}

export function IdentifyMbrDialog({
  currentMbr,
  setCurrentMbr,
  setSignUpMbr
}: Props) {
  const handleError = useErrorHandler()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brdt: new Date(),
    },
  })

  const [isLoading, setLoading] = useState(false)

  const onCloseButton = () => {
    setCurrentMbr(null)
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (currentMbr == null) {
      toast({
				title: '안내',
				description: '선택된 학생 정보가 없습니다.',
        variant: 'destructive'
			})

      return;
    }
    setLoading(true)
    
    const reqData = {
      mbrId: currentMbr.mbrId,
      brdt: format(data.brdt, "yyyyMMdd")
    } 

    postValidateMember(reqData)
      .then((response: AxiosResponse) => {
        const respData = response.data
        if (respData.result) {
          setCurrentMbr(null)
          setSignUpMbr({
            mbrId: currentMbr.mbrId,
            username: '',
            pswd: ''
          })
        }
        else {
          toast({
            title: '안내',
            description: '생년월일이 일치하지 않습니다. 다시 한번 입력해주세요.',
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
    <Dialog modal={true} open={currentMbr != null ? true : false}>
      <DialogContent className='sm:max-w-md [&>button]:hidden'>
        <DialogHeader>
          <DialogTitle>생년월일 확인</DialogTitle>
          <DialogDescription>
            {(() => {
              if (currentMbr) {
                return `[${currentMbr.deptNm}(${currentMbr.sgrpNm})] ${currentMbr?.flnm}의 `
              }
            })()}
            생년월일을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='task-import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='brdt'
              render={({ field }) => <DatePickerFormItem field={field} label='생년월일' endYear={getYear(new Date())}/>}
            />
          </form>
        </Form>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={onCloseButton}>
            닫기
          </Button>
          <Button type='submit' form='task-import-form' disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
