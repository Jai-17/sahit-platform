"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { requestFormSchema } from "@/lib/schema";
import { useRequestForm } from "@/store/RequestFormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const disclosureSchema = requestFormSchema.pick({
  hideFace: true,
  hideId: true,
  hideName: true,
});

const Page = () => {
  const router = useRouter();
  const { data, setData } = useRequestForm();
  const form = useForm<z.infer<typeof disclosureSchema>>({
    resolver: zodResolver(disclosureSchema),
    defaultValues: {
      hideFace: false,
      hideId: false,
      hideName: false,
    },
  });

  async function onSubmit(values: z.infer<typeof disclosureSchema>) {
    setData({ ...data, ...values });
    console.log({...data, ...values});
    router.push("/new-request/review");
  }

  return (
    <div className="flex flex-col h-full">
      <div>
        <h1 className="font-semibold text-xl">Disclosure Options</h1>
        <p className="mt-2 text-neutral-600">
          Choose what parts of your identity you&apos;d like to keep private.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="flex flex-col gap-10">
            <FormField
              control={form.control}
              name="hideId"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Hide ID</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hideName"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Hide Name</FormLabel>
                    <FormDescription>
                      We will use your alias instead.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hideFace"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Hide Face</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            </div>
            <div className="flex mt-60 justify-between lg:px-32">
              <Button
                type="button"
                onClick={() => router.push("/new-request/details")}
                className="bg-neutral-400 flex !px-7 py-5 hover:bg-neutral-300 cursor-pointer"
              >
                <ArrowLeft size={18} className="mr-2" /> Previous
              </Button>
              <Button
                type="submit"
                className="bg-[#8300EA] flex !px-10 py-5 hover:bg-[#8300EA90] cursor-pointer"
              >
                Next <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
