import { useState } from 'react';
import { format, getYear, getMonth, setMonth, setYear } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CalendarIcon } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';
import { cn } from '@/lib/utils';

const monthKorNames = [
  '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
];

interface DatePickerFormItemProps {
	field: ControllerRenderProps<any, string>
  label?: string
	initDate?: Date
  startYear?: number
  endYear?: number
  endDate?: Date
  className?: string
}

const DatePickerFormItem = ({ field, label, 
    initDate, startYear, endYear, endDate,
    className }: DatePickerFormItemProps) => {
  const today = new Date()
  initDate = initDate || new Date();
  startYear = startYear || getYear(new Date()) - 100
  endYear = endYear || getYear(new Date()) + 100

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  )
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(field.value, monthKorNames.indexOf(month))
    field.onChange(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = setYear(field.value, parseInt(year))
    field.onChange(newDate)
  }

  return (
    <FormItem className={cn('flex flex-col', className)}>
      {label ? 
        <FormLabel>{label}</FormLabel>
        :
        <></>}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              className={`w-full pl-3 text-left font-normal ${!field.value ? 'text-muted-foreground' : ''}`}
            >
              {field.value ? format(field.value, 'yyyy년 M월 d일', { locale: ko }) : <span>날짜 선택</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='flex justify-between p-2'>
            <Select onValueChange={handleYearChange} value={getYear(field.value).toString()}>
              <SelectTrigger className='w-[90px]'>
                <SelectValue placeholder='Year' />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleMonthChange} value={monthKorNames[getMonth(field.value)]}>
              <SelectTrigger className='w-[80px]'>
                <SelectValue placeholder='Month' />
              </SelectTrigger>
              <SelectContent>
                {monthKorNames.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="secondary" 
              onClick={() => {
                field.onChange(today)
                setIsCalendarOpen(false);
              }}>
              오늘
            </Button>
          </div>

          <Calendar
            mode='single'
            selected={field.value}
            onSelect={(selected) => {
              field.onChange(selected);
              setIsCalendarOpen(false);
            }}
            onMonthChange={field.onChange}
            disabled={(date) => (date < new Date('1900-01-01') || (
              endDate ? endDate < date : false
            ))}
            month={field.value}
            locale={ko}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default DatePickerFormItem;
