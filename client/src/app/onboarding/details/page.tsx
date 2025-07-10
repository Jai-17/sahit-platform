"use client";

import { Button } from '@/components/ui/button'
import FormField from '@/components/forms/FormField'
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { onboardingSchema } from '@/lib/schema';
import { useRouter } from 'next/navigation';
import { useOnboardingForm } from '@/store/OnboardingFormContext';

const detailsSchema = onboardingSchema.pick({age: true})

const DetailsPage = () => {
  const router = useRouter();
  const {data, setData} = useOnboardingForm()
  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      age: 0,
    }
  })

  async function onSubmit(values: z.infer<typeof detailsSchema>) {
      setData({...data, ...values})
      router.push('/onboarding/upload');
  }

 return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-semibold">
        Wow
      </h1>
      <p className="text-lg">
        Wow
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 mt-4"
        >

          <FormField
            control={form.control}
            name="age"
            label="Email"
            placeholder="Enter your Email"
            type="email"
          />
          <p className="my-2 cursor-pointer ml-1 text-[#8300EA] hover:underline">
            Forgot Password?
          </p>
          <Button
            type="submit"
            className="w-full min-h-10 bg-[#8300EA] mt-2 hover:bg-[#8300EA95] transition duration-300 cursor-pointer ease-in"
          >
            Wow
          </Button>
        </form>
      </Form>
    </div>
 )
}

export default DetailsPage
