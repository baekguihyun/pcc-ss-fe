import React, { InputHTMLAttributes } from "react";
import { Checkbox } from "./ui/checkbox"; // Shadcn UI Checkbox
import { Label } from "./ui/label"; // Shadcn UI Label
import { FaithCheck } from "@/api/faithCheckApi";

interface FaithCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string; // 추가적인 스타일링을 위한 선택적 prop
  fthChck: FaithCheck;
}

const FaithCheckbox: React.FC<FaithCheckboxProps> = ({
  id,
  label,
  checked,
  onCheckedChange,
  className = "",
  disabled = false,
  fthChck
}) => {
  return (
    <div className="space-x-1 space-y-1">
      {/* 기본 Checkbox는 숨김 */}
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="hidden"
      />
      {/* 커스텀 사각형 버튼 스타일 */}
      <Label
        htmlFor={id}
        className={`flex flex-col items-center justify-center h-[100px] border-2 rounded-lg 
          cursor-pointer text-sm transition-all duration-300 ease-in-out 
          ${checked 
            ? "bg-blue-400 text-white border-blue-400" : "bg-gray-100 border-gray-300"} 
          ${className}`}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled} // 접근성을 위해 추가
        onClick={(e) => {
          if (disabled) e.preventDefault(); // 비활성화 상태에서는 클릭 이벤트 방지
        }}
      >

        <span className="mr-2 text-3xl">
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
        </span>


        <span className="select-none">{label}</span>
      </Label>
    </div>
  );
};

export default FaithCheckbox;