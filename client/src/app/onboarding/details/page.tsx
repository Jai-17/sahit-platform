"use client";

import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/forms/FormField";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { onboardingSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useOnboardingForm } from "@/store/OnboardingFormContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";

const detailsSchema = onboardingSchema.pick({
  age: true,
  occupation: true,
  company: true,
  jobType: true,
  contact: true,
  whatsappSame: true,
  whatsapp: true,
  address: true,
  city: true,
  state: true,
});

const DetailsPage = () => {
  const router = useRouter();
  const { data, setData } = useOnboardingForm();
  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      age: 0,
      occupation: "",
      company: "",
      jobType: "full-time",
      contact: "",
      whatsappSame: false,
      whatsapp: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const { watch, setValue } = form;
  const whatsappSame = watch("whatsappSame");
  const contact = watch("contact");

  useEffect(() => {
    if (whatsappSame) {
      setValue("whatsapp", contact);
    }
  }, [whatsappSame, contact, setValue]);

  async function onSubmit(values: z.infer<typeof detailsSchema>) {
    setData({ ...data, ...values });
    console.log({ ...data, ...values });
    router.push("/onboarding/upload");
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2 max-w-[350px] md:max-w-full">
        <h1 className="text-2xl md:text-4xl font-semibold">Your Details</h1>
        <p className="md:text-lg">
          Enter your details to help us know you better!
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <CustomFormField
                  control={form.control}
                  name="age"
                  label="Age"
                  placeholder="Enter your Age"
                  type="text"
                />
                <CustomFormField
                  control={form.control}
                  name="occupation"
                  label="Occupation"
                  placeholder="Enter your Occupation"
                  type="text"
                />
              </div>
              <div className="flex gap-4">
                <CustomFormField
                  control={form.control}
                  name="company"
                  label="Company"
                  placeholder="Enter Company name"
                  type="text"
                />
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="min-h-14 w-full md:w-[220px] pr-10 px-4">
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CustomFormField
                control={form.control}
                name="address"
                label="Address"
                placeholder="Enter your address"
                type="text"
              />
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <CustomFormField
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your City"
                    type="text"
                  />
                  <CustomFormField
                    control={form.control}
                    name="state"
                    label="State"
                    placeholder="Enter your State"
                    type="text"
                  />
                </div>
                <div className="flex gap-4">
                  <CustomFormField
                    control={form.control}
                    name="contact"
                    label="Contact"
                    placeholder="Enter Contact Number"
                    type="text"
                  />
                  <CustomFormField
                    control={form.control}
                    name="whatsapp"
                    label="Whatsapp Number"
                    placeholder="Enter Whatsapp Number"
                    type="text"
                    fieldDisabled={whatsappSame}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="whatsappSame"
                  render={({ field }) => (
                    <FormItem className="flex">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Keep Whatsapp Number same as Contact
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full justify-between mt-6 md:mt-2">
              <Button disabled className="w-40 min-h-1 bg-neutral-300">
                <ArrowLeft /> Previous
              </Button>
              <Button
                type="submit"
                className="w-40 min-h-10 bg-[#8300EA] hover:bg-[#8300EA95] transition duration-300 cursor-pointer ease-in"
              >
                Next
                <ArrowRight />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex gap-2 mt-8 w-[200px]">
        <div className="w-full h-2 bg-[#8300EA] rounded-3xl"></div>
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
      </div>
    </div>
  );
};

export default DetailsPage;
