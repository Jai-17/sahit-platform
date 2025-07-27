/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import RequestLoader from '@/components/loaders/RequestLoader';
import IncomingRequestCard from '@/components/support-db/IncomingRequestCard'
import { useGetAcceptedRequestByNGOQuery } from '@/store/features/protectedApiSlice'
import React from 'react'

const RequestPage = () => {
  const {data, isLoading} = useGetAcceptedRequestByNGOQuery(undefined);
  if(isLoading) return <RequestLoader />
  console.log(data);

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2">Request Status</h1>
      <p className="text-neutral-500 text-sm lg:text-base">
        Check out your incoming requests and choose them from here
      </p>
      {data?.data?.length > 0 ? (<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-7 gap-4'>
        {data.data.map((data: any) => <IncomingRequestCard key={data.helpRequestId} data={data} />)}
      </div>) : (<div className='mt-10 text-2xl font-semibold text-neutral-400'>No Incoming Requests for now</div>)}
    </div>
  )
}

export default RequestPage
