import { toast } from "@/hooks/use-toast";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";

// @ts-ignore
export function errorToast(
	error: AxiosError, 
	navigate: ReturnType<typeof useNavigate>,
	message : string = '오류가 발생했습니다.') {

	console.log(error)

	if (error.code == "ERR_NETWORK") {
		if (navigate) {
			navigate({to: '/503'})
		}

		return;
	}
	
	toast({
		title: '안내',
		description: message,
		variant: 'destructive',
		duration: 1000
	})
}