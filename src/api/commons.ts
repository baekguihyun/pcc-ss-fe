import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useEffect, useRef } from "react";

export function useErrorHandler(delay = 2000) {
  const navigate = useNavigate();
	const authStore = useAuthStore()
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleError = (error: AxiosError, message: string = '오류가 발생했습니다.') => {
		console.log(error)

		if (error.code == "ERR_NETWORK") {
			if (navigate) {
				navigate({to: '/503'})
			}
	
			return
		}

		if ((error.response?.data as {code: string}).code == "8") {			
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}

			message = '인증정보가 잘못 되었습니다. 다시 로그인해주세요.'
			
			authStore.auth.logout()

			timerRef.current = setTimeout(() => {				
				navigate({to: '/sign-in'});
			}, delay);
		}

		toast({
			title: '안내',
			description: message,
			variant: 'destructive',
			duration: delay
		})

		return;
	}

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return handleError;
}