"use client";

import StatusTab from '@/components/common/StatusTab';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGetFeedbackQuery } from '@/store/features/protectedApiSlice'
import { format } from 'date-fns';
import React from 'react'

interface FeedbackData {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
}

const Page = () => {
  const auth = useAuth();
  const {data, isLoading} = useGetFeedbackQuery(auth.roleId);
  console.log(data);

  if(isLoading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Feedbacks
          </h1>
            <p className="text-neutral-500 text-sm lg:text-base">
            View all the feedback you’ve received. Feedback is anonymous to protect privacy.
            </p>
        </div>
      </div>
      <div>
        {data.data.length > 0 ? (data.data.map((data: FeedbackData) => (
          <div key={data.id} className='bg-transparent p-5 rounded-lg border border-neutral-300 mt-5'>
            <div className='flex gap-2'>
              <StatusTab title={`⭐ ${data.rating}`} color='PRIMARY'  />
              <StatusTab title={`On ${format(new Date(data.createdAt), "PPP")}`} color='GRAY' />
            </div>
            <p className='text-lg mt-3'>{data.content}</p>
          </div>
        ))) : <div>No feedbacks founds!</div>}
      </div>
    </div>
  )
}

export default Page
