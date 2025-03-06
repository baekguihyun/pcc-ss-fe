import React, { HTMLAttributes, useCallback, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRoundSearch } from 'lucide-react'
import { postSearchMember } from '@/api/authApi'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SearchMbr, useSignUp } from '../context/signup-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AxiosResponse } from 'axios'
import { errorToast } from '@/api/commons'
import { useNavigate } from '@tanstack/react-router'

const formSchema = z.object({
  searchWord: z.string().min(2, { message: '최소 2글자 입력해주세요.' }),
})

export function IdentifyForm({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  
  const [isLoading, setLoading] = useState(false)
  const [listSearchMbr, setListSearchMbr] = useState<SearchMbr[] | null>(null)

  const searchMbrForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchWord: '',
    },
  })

  // @ts-ignore
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    
    postSearchMember(data.searchWord)
      .then((response: AxiosResponse) => {
        const respData = response.data

        setListSearchMbr(respData.result)
      })
      .catch((error) => {
        // setError("데이터를 불러오는 중 오류가 발생했습니다.");
        errorToast(error, navigate)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className={cn('grid gap-3', className)} {...props}>
      <Form {...searchMbrForm}>
        <form onSubmit={searchMbrForm.handleSubmit(onSubmit)}>
          <FormField
            control={searchMbrForm.control}
            name='searchWord'
            render={({ field }) => (
              <FormItem>
                <div className='flex w-full items-center space-x-1'>
                  <FormControl>
                    <Input type='text' placeholder='이름' {...field} />
                  </FormControl>
                  <Button type='submit' disabled={isLoading}>
                    <UserRoundSearch />
                    찾기
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      
      
      <div className='h-[120px]'>
        {listSearchMbr && listSearchMbr.length > 0 ? 
          (
            <ScrollArea className='h-full border rounded-lg'>
            {
              listSearchMbr.map((member: SearchMbr) => (
                  <div key={member.mbrId} >
                    <SearchMbrItem searchMbr={member} />
                    <Separator />
                  </div>
                )
              )
            }
          </ScrollArea>
        ) : (
          listSearchMbr == null ? (
            <></>
          )
          :
          (
            <div className='flex items-center justify-center text-center text-muted-foreground h-full'>
              🔍학생 정보가 존재하지 않습니다.
            </div>
          )
        )}
      </div>
    </div>
  )
}

interface SearchMbrItemProps {
  searchMbr: SearchMbr
}

const SearchMbrItem = React.memo(
  ({ searchMbr }: SearchMbrItemProps) => {
    const { setCurrentMbr } = useSignUp()

    const onSelectBtnClick = useCallback(() => {
      if (import.meta.env.MODE === 'development') {
        console.log(searchMbr)
      }

      setCurrentMbr(searchMbr)
    }, [searchMbr])

    return (
      <div className='flex items-center gap-4 p-2'>
        <div className='flex flex-1 flex-nowrap items-center justify-between '>
          <div className='font-medium'>{searchMbr.deptNm}</div>
          <div className='space-y-1'>
            <p className='text-sm font-medium leading-none'>{searchMbr.flnm} 
              [{searchMbr.gndr == 'M' ? '남' : '여'}]</p>
            <p className='text-sm text-muted-foreground'>
              {searchMbr.sgrpNm}
            </p>
          </div>
          <Button variant='outline' onClick={onSelectBtnClick}>
            선택
          </Button>
        </div>
      </div>
    )
  }
)
