import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const IconName = ({image, name}:{image: string, name:string}) => {
  return (
    <div className='flex items-center gap-4 text-lg md:text-2xl text-[#8300EA] font-semibold'>
        <Avatar className='w-12 h-12'>
            <AvatarImage className='object-cover' src={image} />
            <AvatarFallback>{`${name[0]}${name.split(" ")[1][0]}`}</AvatarFallback>
        </Avatar>
        {name}
    </div>
  )
}

export default IconName
