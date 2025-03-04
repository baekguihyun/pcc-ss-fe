import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "./cookie-util";
import { toast } from "@/hooks/use-toast";

const COOKIE_TOKEN = import.meta.env.VITE_COOKIE_TOKEN
const jwtAxios = axios.create()

const refreshJWT = async (accessToken: string, refreshToken: string) => {
	const host = import.meta.env.VITE_API_SERVER_HOST

	const header = {headers: {"Authorization": `Bearer ${accessToken}`}}

	const res = await axios.get(`${host}/api/auth/refresh?refreshToken=${refreshToken}`, header)

	console.log("-------------------------")
	console.log(res.data)

	return res.data
}

//before request
const beforeReq = (config: InternalAxiosRequestConfig) => {
	console.log("before request..........")

	const memberInfo = getCookie(COOKIE_TOKEN)

	if (!memberInfo) {
		console.log("Member NOT FOUND")
		return Promise.reject(
			{
				response: {
					data: {
						error: "REQUIRE_LOGIN"
					}
				}
			}
		)
	}

	const {accessToken} = memberInfo

	// Authorization 헤더 처리
	config.headers.Authorization = `Bearer ${accessToken}`

	return config;
}

//fail request
const requestFail = (err: AxiosError) => {
	console.log("request error..........")

	return Promise.reject(err)
}

//before return response
const beforeRes = async (response: AxiosResponse) => {
	console.log("before return response..........")

	console.log(response)

	const data = response.data
	
	if (data.code == '9') {
		const memberCookieValue = getCookie(COOKIE_TOKEN)

		const result = await refreshJWT( memberCookieValue.accessToken,
			memberCookieValue.refreshToken )
		
		console.log("refreshJWT RESULT", result)

		memberCookieValue.accessToken = result.accessToken
		memberCookieValue.refreshToken = result.refreshToken
		
		setCookie("member", JSON.stringify(memberCookieValue), 1)

		//원래 호출 재시도
		const originalRequest = response.config

		originalRequest.headers.Authorization = `Bearer ${result.accessToken}`

		return await axios(originalRequest)
	}

	return response;
}

//fail response
const responseFail = (err: AxiosError) => {
	console.log("response fail error..........")

	console.log(err)


	return Promise.reject(err)
}

jwtAxios.interceptors.request.use( beforeReq, requestFail )
jwtAxios.interceptors.response.use( beforeRes, responseFail )

export default jwtAxios