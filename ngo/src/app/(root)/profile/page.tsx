/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField from "@/components/forms/FormField";
import { MultiSelectDropdown } from "@/components/forms/MultiSelectDropdown";
import ProfileLoader from "@/components/loaders/ProfileLoader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/useAuth";
import { onboardingSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useGetNGOByIdQuery } from "@/store/features/apiSlice";
import { useUpdateProfileMutation } from "@/store/features/protectedApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const profileSchema = onboardingSchema.pick({
  replyTimeMins: true,
  supportTypes: true,
  address: true,
  city: true,
  state: true,
  phone: true,
  whatsappNumber: true,
  whatsappSame: true,
  about: true,
  representativeAvailability: true,
  representativeName: true,
  representativeTitle: true,
});

const ProfilePage = () => {
  const auth = useAuth();
  const {data, isLoading} = useGetNGOByIdQuery(auth.roleId);
  console.log(data)
  const [updateProfile, {isLoading: updateProfileLoading}] = useUpdateProfileMutation();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      replyTimeMins: "1",
      supportTypes: [],
      address: "",
      city: "",
      state: "",
      phone: "",
      whatsappNumber: "",
      whatsappSame: false,
      about: "",
      representativeAvailability: "",
      representativeName: "",
      representativeTitle: "",
    },
  });

  useEffect(() => {
    if(data?.data) {
      form.reset({
        replyTimeMins: data.data.replyTimeMins,
        supportTypes: data.data.supportTypes,
        address: data.data.address,
        city: data.data.city,
        state: data.data.state,
        phone: data.data.phone,
        whatsappNumber: data.data.whatsappNumber,
        whatsappSame: data.data.whatsappSame,
        about: data.data.about,
        representativeAvailability: data.data.representativeAvailability,
        representativeName: data.data.representativeName,
        representativeTitle: data.data.representativeTitle
      })
    }
  }, [data?.data, form]);

  const { watch, setValue } = form;
  const whatsappSame = watch("whatsappSame");
  const phone = watch("phone");

  useEffect(() => {
    if (whatsappSame) {
      setValue("whatsappNumber", phone);
    }
  }, [whatsappSame, phone, setValue]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      await updateProfile(values).unwrap();
      toast.success("Profile Updated Successfully");
    } catch (error:any) {
      console.log("Error:", error);
      toast.error("Error updating profile", error);
    }
  }

  if (isLoading) return <ProfileLoader />

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-10">
          <div className="w-full">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
                Profile
              </h1>
              <p className="text-neutral-500 text-sm lg:text-base">
                Update your profile details below. Click save to save the
                changes.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <CustomFormField
                control={form.control}
                name="representativeName"
                label="Representative Name"
                placeholder="Enter Name"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="representativeTitle"
                label="Representative Title"
                placeholder="Enter Title"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="representativeAvailability"
                label="Representative Availability"
                placeholder="9am-8pm"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="replyTimeMins"
                label="Reply Time (in Mins)"
                placeholder="2 minutes"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="address"
                label="Address"
                placeholder="Enter your Address"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="city"
                label="City"
                placeholder="Enter City"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="state"
                label="State"
                placeholder="Enter State"
                type="text"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 mt-4">
            <MultiSelectDropdown />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief About of your NGO</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      wrap="soft"
                      placeholder="Tell us a little bit about yourself"
                      className="resize-y w-full text-sm md:text-base overflow-hidden break-words whitespace-pre-line"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <CustomFormField
              control={form.control}
              name="phone"
              label="Contact"
              placeholder="Enter Contact Number"
              type="text"
            />
            <CustomFormField
              control={form.control}
              name="whatsappNumber"
              label="Whatsapp Number"
              placeholder="Enter Whatsapp Number"
              type="text"
              fieldDisabled={whatsappSame}
            />
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
            <Button
              type="submit"
              className={cn("w-40 min-h-10 transition duration-300 mt-5 cursor-pointer ease-in", isLoading ? "bg-[#D59FFF]" : "bg-[#8300EA] hover:bg-[#8300EA95]")}
            >
              {updateProfileLoading ? "Saving" : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfilePage;
