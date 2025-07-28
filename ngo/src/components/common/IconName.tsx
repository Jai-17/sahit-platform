import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const IconName = ({image, name}:{image?: string, name:string}) => {
  return (
    <div className='flex items-center gap-4 text-lg md:text-2xl text-[#8300EA] font-semibold'>
        <Avatar className='w-12 h-12'>
            <AvatarImage className='object-cover' src={image} />
            <AvatarFallback className='text-black border border-neutral-400'>{`${name[0]}`}</AvatarFallback>
        </Avatar>
        {name}
    </div>
  )
}

export default IconName
