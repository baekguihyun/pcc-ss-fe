import jwtAxios from "@/utils/jwt-util"
import { format } from "date-fns"

const API_SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST

const host = `${API_SERVER_HOST}/api/fth-chck`

export interface FaithCheck {
	fthChckSn: string
	fthActvCd: string
	fthActvNm: string
	fthActvClsfCd: string
	fthActvClsfNm: string
	fthActvUnit: string
	fthActvUnitNm: string
	fthChckYmd: string
	fthChckRslt: number
}

export const getList = (date: Date) => {

	let url: string = host

	if (date) {
		url = `${url}/${format(date, 'yyyyMMdd')}`
	}

	return jwtAxios.get(url)
}

export const putList = (date: Date, checkList: FaithCheck[]) => {
	let url: string = host
	
	const header = {
		headers: {'Content-Type': 'application/json'}
	}

	if (date) {
		url = `${url}/${format(date, 'yyyyMMdd')}`
	}

	return jwtAxios.put(url, checkList, header)
}
