import { errorToast } from "@/api/commons"
import { FaithCheck, getList, putList } from "@/api/faithCheckApi"
import DatePickerFormItem from "@/components/date-picker-form-item"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useNavigate } from "@tanstack/react-router"
import { format, getYear } from "date-fns"
import { HTMLAttributes, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


const formSchema = z.object({
  items: z.array(z.string()),
  date: z.date({
    required_error: '날짜를 입력해주세요.',
  })
});

export function FaithForm({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  
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
      errorToast(error, navigate)
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
      errorToast(error, navigate)
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
                {faithCheckList.map((fthChck) => (
                  <FormField
                    key={fthChck.fthActvCd}
                    control={form.control}
                    name='items'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={fthChck.fthActvCd}
                          className='items-start space-x-3 space-y-1 grid grid-cols-12 sm:grid-cols-6'
                        >
                          <FormLabel className='font-medium col-span-10 sm:col-span-5'>
                            {(() => {
                              // 성경
                              if (fthChck.fthActvClsfCd == '101') { 
                                return '📖'
                              }
                              // 기도
                              else if (fthChck.fthActvClsfCd == '102') {
                                return '🙏'
                              }
                              // 찬양
                              else if (fthChck.fthActvClsfCd == '103') {
                                return '🎶'
                              }
                              else {
                                return '👉'
                              }
                            })()}
                            {fthChck.fthActvNm}
                          </FormLabel>
                          <FormControl>
                            <div className="flex justify-end col-span-2 sm:col-span-1">
                              <Checkbox 
                                checked={fthChck.fthChckRslt > 0}
                                disabled={strCurrentDate != format(date, 'yyyyMMdd')}
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
                                className={`h-5 w-5 ${
                                  strCurrentDate != format(date, 'yyyyMMdd')
                                    ? "opacity-40 border-dashed border-red-300 bg-red-100"
                                    : "border-blue-500"
                                }`}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                ))}
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