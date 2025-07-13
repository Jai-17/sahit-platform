import IncomingRequestCard from '@/components/support-db/IncomingRequestCard'
import React from 'react'

const RequestPage = () => {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2">Request Status</h1>
      <p className="text-neutral-500 text-sm lg:text-base">
        Check out your incoming requests and choose them from here
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-7 gap-4'>
        <IncomingRequestCard />
        <IncomingRequestCard />
        <IncomingRequestCard />
      </div>
    </div>
  )
}

export default RequestPage
