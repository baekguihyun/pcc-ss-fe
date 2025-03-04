import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";


export function errorToast(error: AxiosError) {
	toast({
		title: '안내',
		description: '오류가 발생했습니다.',
		variant: 'destructive',
		duration: 1000
	})
}