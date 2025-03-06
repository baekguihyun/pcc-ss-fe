import { SearchMbr, SignUpMember } from "@/features/auth/sign-up/context/signup-context"
import { AuthParam } from "@/stores/authStore"
import axios, { AxiosResponse } from "axios"

const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST

const host = `${API_SERVER_HOST}/api/auth`

export interface RespDataList<T> {
	code: string,
	message: string
	count: number
	result: T[]
}

export interface RespData<T> {
	code: string,
	message: string
	count: number
	result: T
}

export interface ReqValidateMember {
	mbrId: string,
	brdt: string
}

export interface RespIdentify {
	result: boolean
}


export const postSearchMember = async(searchWord: string) => {
	if (!searchWord && searchWord.length < 2) {
		return {} as Promise<AxiosResponse>
	}

	const header = {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}
	
	const params = new URLSearchParams()
	
	params.append('searchWord', searchWord)


	return axios.post<RespDataList<SearchMbr>>(`${host}/search-member`, params, header)
}

export const postValidateMember = async(member: ReqValidateMember) => {
	if (!member)  {
		return {} as Promise<AxiosResponse>
	}
	
	const header = {
		headers: {'Content-Type': 'application/json'}
	}

	return axios.post<RespData<boolean>>(`${host}/validate-member`, member, header)
}

export const postCheckDpcnUsername = async(username: string) => {
	if (!username)  {
		return {} as Promise<AxiosResponse>
	}
	
	const header = {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}
	
	const params = new URLSearchParams()
	
	params.append('username', username)

	return axios.post<RespData<boolean>>(`${host}/check-dpcn-username`, params, header)
}

export const putSignUp = async(member: SignUpMember) => {

	const header = {
		headers: {'Content-Type': 'application/json'}
	}

	return axios.put<RespData<boolean>>(`${host}/sign-up`, member, header)
}

export const postLogin = async(param: AuthParam) => {
	const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}

	const form = new FormData()

	form.append("username", param.username)
	form.append("password", param.password)

	return axios.post(`${host}/login`, form, header)
}