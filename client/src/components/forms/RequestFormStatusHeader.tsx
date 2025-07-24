"use client";

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react'

const headerItems = [
    {label: "Start", path: '/new-request'},
    {label: "General", path: '/new-request/general'},
    {label: "Details", path: "/new-request/details"},
    {label: 'Disclosures', path:'/new-request/disclosures'},
    {label: 'Review', path:'/new-request/review'}
]

const RequestFormStatusHeader = () => {
    const pathname = usePathname();

  return (
    <div className='flex lg:gap-10'>
      {headerItems.map((item) => {
        const isActive = item.path === pathname;

        return (
            <div className={cn('border-2 text-xs md:text-lg px-2 py-2 md:px-6 md:py-4 rounded-lg', isActive ? 'bg-[#8300EA] text-white border-[#8300EA]' : 'text-neutral-500 border-neutral-200')} key={item.label}>
                {item.label}
            </div>
        )
      })}
    </div>
  )
}

export default RequestFormStatusHeader
