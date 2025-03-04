import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"
import { useCallback } from "react"
import { useSignUp } from "../context/signup-context"
import { IdentifyForm } from "./identify-form"
import { SignUpForm } from "./sign-up-form"



export default function SignUpAccordion() {
	const { signUpMbr: member, setCurrentMbr, setSignUpMbr } = useSignUp()

	const onStep1Click = () => {
		setCurrentMbr(null)
		setSignUpMbr(null)
	};

	const onStep2Click = useCallback(() => {
		if (member == null) {
			toast({
				title: '안내',
				description: '먼저 내 정보 확인하고 진행해주세요.',
				variant: 'destructive'
			})
		}
	}, [member]);


	return (
		<Accordion type="single" defaultValue='step-1' 
			value={member == null ? "step-1" : "step-2"} collapsible>
			<AccordionItem value="step-1">
				<AccordionTrigger onClick={onStep1Click} className="bg-green-50 px-3 text-base">
					내 정보 확인
				</AccordionTrigger>
				<AccordionContent className="border-solid border">
					<IdentifyForm className="p-3"/>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="step-2">
				<AccordionTrigger onClick={onStep2Click} className="bg-green-50 px-3 text-base">
					아이디/비밀번호 설정
				</AccordionTrigger>
				<AccordionContent className="border-solid border">
					<SignUpForm className="p-3"/>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)

}