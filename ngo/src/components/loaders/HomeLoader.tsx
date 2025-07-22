import React from 'react'
import { Skeleton } from '../ui/skeleton'

const HomeLoader = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex gap-5'>
        <Skeleton className='h-40 flex-1' />
        <Skeleton className='h-40 flex-1' />
        <Skeleton className='h-40 flex-1' />
      </div>
      <Skeleton className='h-20' />
      <Skeleton className='h-20' />
      <Skeleton className='h-20' />
    </div>
  )
}

export default HomeLoader
