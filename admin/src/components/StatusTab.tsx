import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react'

export const colorBG = {
  RED:     "bg-[#EA0000]",
  ORANGE:  "bg-[#F4914A]",
  GREEN:   "bg-[#16A303]",
  PRIMARY: "bg-[#8300EA]",
  WHITE:    "bg-[#F3F3F3]",
  YELLOW:  "bg-[#F1D011]",
  GRAY: "bg-[#ECECEC]"
} as const;

type ColorKey = keyof typeof colorBG

interface StatusProps {
    title: string;
    icon?: ReactNode;
    color: ColorKey
}

const StatusTab = ({title, icon, color}:StatusProps) => {
  return (
    <div className={cn(colorBG[color], 'py-1 px-4 w-fit rounded-lg flex items-center text-xs md:text-base', (color === 'GRAY' || color === 'WHITE') ? 'text-neutral-600' : 'text-white')}>
      {icon && <div className='mr-2'>{icon}</div>}
      {title}
    </div>
  )
}

export default StatusTab
