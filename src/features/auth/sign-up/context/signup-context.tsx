import React, { useState } from "react"

export interface SignUpMember {
	mbrId: string,
	username: string,
	pswd: string
}

export interface SearchMbr {
	mbrId: string
	deptNm: string
	sgrpNm: string
	flnm: string
	gndr: string
}

interface SignUpContextType {
	currentMbr: SearchMbr | null
	setCurrentMbr: (member : SearchMbr | null) => void
	signUpMbr: SignUpMember | null
	setSignUpMbr: (member : SignUpMember | null) => void
}

const SignUpContext = React.createContext<SignUpContextType | null>(null)

interface Props {
	children: React.ReactNode
}

export default function SignUpProvider({ children }: Props) {
	const [currentMbr, setCurrentMbr] = useState<SearchMbr | null>(null)
	const [signUpMbr, setSignUpMbr] = useState<SignUpMember | null>(null)
	return (
		<SignUpContext.Provider value={{ currentMbr, setCurrentMbr, signUpMbr, setSignUpMbr }}>
			{children}
		</SignUpContext.Provider>
	)
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSignUp = () => {
	const signUpContext = React.useContext(SignUpContext)

	if (!signUpContext) {
		throw new Error('useTasks has to be used within <TasksContext>')
	}

	return signUpContext
}