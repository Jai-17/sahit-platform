import React, { ReactNode } from 'react'

const InfoCard = ({heading, children}:{heading:string, children:ReactNode}) => {
  return (
    <div className='bg-neutral-200/60 p-6 rounded-lg'>
      <h1 className='text-2xl font-semibold text-[#8300EA] break-words'>{heading}</h1>
      <div className='mt-5'>
        {children}
      </div>
    </div>
  )
}

export default InfoCard
