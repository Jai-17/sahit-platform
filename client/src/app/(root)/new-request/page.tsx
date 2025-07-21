"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex-1 flex items-center justify-center text-4xl text-neutral-700'>
        Begin Submitting a Help Request
      </div>
      <div className='flex justify-center'>
        <Button onClick={() => redirect('/new-request/general')} className="bg-[#8300EA] flex !px-10 py-5 hover:bg-[#8300EA90] cursor-pointer">Next <ArrowRight size={20} /></Button>
      </div>
    </div>
  )
}

export default Page
