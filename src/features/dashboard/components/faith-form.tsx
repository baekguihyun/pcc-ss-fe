import { useErrorHandler } from "@/api/commons"
import { FaithCheck, getList, putList } from "@/api/faithCheckApi"
import DatePickerFormItem from "@/components/date-picker-form-item"
import FaithCheckbox from "@/components/faith-checkbox"
import { Button } from "@/components/ui/button"
import { Form, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckedState } from "@radix-ui/react-checkbox"
import { format, getYear } from "date-fns"
import { HTMLAttributes, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"


const formSchema = z.object({
  items: z.array(z.string()),
  date: z.date({
    required_error: '날짜를 입력해주세요.',
  })
});

export function FaithForm({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const handleError = useErrorHandler()

  const currentDate = new Date()

  const strCurrentDate = format(currentDate, 'yyyyMMdd') 
  
  const [faithCheckList, setFaithCheckList] = useState<FaithCheck[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [],
      date: currentDate
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // if (!(data.items && data.items.length > 0)) {
    if (!(data.items && data.items.length > 0) && 
        (faithCheckList.filter((check)=>check.fthChckRslt == null).length > 0)) {
      toast({
        title: '안내',
        description: '1개 항목 이상 선택해주세요.',
        variant: 'destructive'
      })

      return;
    }

    putList(currentDate, faithCheckList)
    // @ts-ignore
    .then((response) => {
      toast({
        title: '안내',
        description: '등록되었습니다.',
        variant: 'success',
        duration: 1000
      })
    })
    // @ts-ignore
    .catch((error) => {
      handleError(error)
    })

  }

  const date = form.watch('date')
  
  const handleCheckedChange = (checked: CheckedState, clickedFthActvCd: string) => {
    setFaithCheckList((prevList) => 
      prevList.map((faithCheck) => 
        faithCheck.fthActvCd === clickedFthActvCd ?
        { ...faithCheck, fthChckRslt: checked ? 1 : 0}
        : faithCheck
      )
    )
  }
  
  useEffect(() => {

    getList(date)
    .then((response) => {
      const result: FaithCheck[] = response.data.result
      
      setFaithCheckList(result)
      
      form.setValue("items", faithCheckList.filter(check => check.fthChckRslt > 0).map(check => check.fthActvCd))
      
    })
    // @ts-ignore
    .catch((error) => {
      handleError(error)
    })

  }, [date])

  return <div className={cn(className)} {...props}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid gap-6'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => 
              <DatePickerFormItem field={field} 
                label="날짜"
                startYear={getYear(currentDate)} 
                endYear={getYear(currentDate)}
                endDate={currentDate}/>}
              />
          <FormField 
            control={form.control}
            name='items'
            render={() => (
              <FormItem>
                <div className=" mb-4">
                  <FormLabel className='text-lg'>활동 내역</FormLabel>
                  <FormDescription className='text-base'>
                    오늘 완료한 활동들을 선택하세요. <br />
                    오늘이 지나면 등록할 수 없습니다.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2">
                  {faithCheckList.map((fthChck) => (
                    <Controller
                      key={fthChck.fthActvCd}
                      name="items"
                      control={form.control}
                      render={({ field }) => (
                        <FaithCheckbox
                          id={fthChck.fthActvCd}
                          label={fthChck.fthActvNm}
                          checked={fthChck.fthChckRslt > 0}
                          onCheckedChange={(checked) => {
                            checked
                              ? field.onChange([...field.value, fthChck.fthActvCd])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== fthChck.fthActvCd
                                  )
                                )
                            handleCheckedChange(checked, fthChck.fthActvCd)
                          }}
                          disabled={strCurrentDate != format(date, 'yyyyMMdd')}
                          fthChck={fthChck}
                        />
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-1 w-full">
            <Button type='reset' 
              disabled={strCurrentDate != format(date, 'yyyyMMdd')}
              variant="outline" 
              className="col-span-1">복원</Button>
            <Button type='submit' 
              disabled={strCurrentDate != format(date, 'yyyyMMdd')}
              className="col-span-1">등록</Button>
          </div>
        </div>
      </form>
    </Form>
  </div>
}