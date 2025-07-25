/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField from "@/components/forms/FormField";
import ProfileLoader from "@/components/forms/ProfileLoader";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useAuth } from "@/lib/hooks/useAuth";
import { onboardingSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useGetHelpSeekerByIdDetailedQuery } from "@/store/features/apiSlice";
import { useUpdateProfileMutation } from "@/store/features/protectedApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const uploadSchema = onboardingSchema.pick({
  age: true,
  occupation: true,
  company: true,
  jobType: true,
  contact: true,
  whatsapp: true,
  whatsappSame: true,
  address: true,
  city: true,
  state: true,
  photo: true,
  alias: true,
});

const ProfilePage = () => {
  const auth = useAuth();
  const { data, isLoading } = useGetHelpSeekerByIdDetailedQuery(auth.roleId);
  const [updateProfile, {isLoading: updateProfileLoading}] = useUpdateProfileMutation();
  console.log(data?.data.photo);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
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
      photo: "",
      alias: "",
    },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset({
        age: data.data.age,
        occupation: data.data.occupation,
        company: data.data.company,
        jobType: data.data.jobType,
        contact: data.data.contact,
        whatsappSame: data.data.whatsappSame,
        whatsapp: data.data.whatsapp,
        address: data.data.address,
        city: data.data.city,
        state: data.data.state,
        photo: data.data.photo,
        alias: data.data.alias,
      });

      setPhotoPreview(data.data.photo || null);
    }
  }, [data?.data, form]);

  const { watch, setValue } = form;
  const whatsappSame = watch("whatsappSame");
  const contact = watch("contact");

  useEffect(() => {
    if (whatsappSame) {
      setValue("whatsapp", contact);
    }
  }, [whatsappSame, contact, setValue]);

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const url = await uploadToCloudinary(file);

      form.setValue("photo", url);
      setPhotoPreview(url);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      form.setValue("photo", "");
      setPhotoPreview("");

      toast.error("Image upload failed.");
    }
  }

  async function onSubmit(values: z.infer<typeof uploadSchema>) {
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
                name="age"
                label="Age"
                placeholder="Your Age"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Your Occupation"
                type="text"
              />
              <CustomFormField
                control={form.control}
                name="company"
                label="Company"
                placeholder="Your Company"
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
                      <FormControl className="min-h-14 w-full pr-10 px-4">
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
              <CustomFormField
                control={form.control}
                name="address"
                label="Your Address"
                placeholder="Your Address"
                type="text"
              />
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
          </div>
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Your Photo (Max. 1MB)
                </label>

                <div className="relative w-48 h-48 my-5 border-2 border-dashed border-neutral-300 rounded-full flex items-center justify-center overflow-hidden group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <Image
                    src={photoPreview || "/placeholder.png"}
                    width={200}
                    height={200}
                    alt="Profile Photo"
                  />
                </div>
              </div>
              <CustomFormField
                control={form.control}
                name="alias"
                label="Your Alias"
                placeholder="Enter Your Alias"
                type="text"
              />
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
              <FormField
                control={form.control}
                name="whatsappSame"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        className="mt-0"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Keep Whatsapp Number same as Contact
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className={cn("w-40 min-h-10 transition duration-300 mt-10 cursor-pointer ease-in", isLoading ? "bg-[#D59FFF]" : "bg-[#8300EA] hover:bg-[#8300EA95]")}
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
