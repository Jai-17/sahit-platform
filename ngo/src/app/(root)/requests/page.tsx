"use client";

import React from 'react'
import IncomingRequestCard from '@/components/ngo-db/IncomingRequestCard'
import { useIncomingRequestQuery } from '@/store/features/protectedApiSlice';
import RequestLoader from '@/components/loaders/RequestLoader';

const RequestPage = () => {
  const {data: incomingRequests, isLoading} = useIncomingRequestQuery(undefined);
  console.log(incomingRequests);

  if(isLoading) return <RequestLoader />

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2">Incoming Requests</h1>
      <p className="text-neutral-500 text-sm lg:text-base">
        Check out your incoming &quot;HELP&quot; requests
      </p>
      {incomingRequests.data.length > 0 ? (<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-7 gap-4'>
        {incomingRequests.data.map((data: HelpRequest) => <IncomingRequestCard key={data.id} helpRequest={data} />)}
      </div>) : <div className='mt-10 text-2xl font-semibold text-neutral-400'>No Incoming Requests for now</div>}
    </div>
  )
}

export default RequestPage
