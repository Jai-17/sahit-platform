"use client";

import CustomFormField from "@/components/forms/FormField";
import { Form } from "@/components/ui/form";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { onboardingSchema } from "@/lib/schema";
import { useOnboardingForm } from "@/store/OnboardingFormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { CldImage } from "next-cloudinary";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useHelpSeekerRegisterMutation } from "@/store/features/protectedApiSlice";
import { useDispatch } from "react-redux";
import { setIsOnboarded } from "@/store/features/authSlice";

const uploadSchema = onboardingSchema.pick({
  alias: true,
  photo: true,
  idProofs: true,
});

const UploadPage = () => {
  const router = useRouter();
  const { data, setData } = useOnboardingForm();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [idProofPreviews, setIdProofPreviews] = useState<string | null>(null);
  const [helpSeekerRegister, {isLoading}] = useHelpSeekerRegisterMutation();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      alias: "",
      photo: "",
      idProofs: "",
    },
  });

  async function handleFileUpload(
    e: ChangeEvent<HTMLInputElement>,
    fieldName: "photo" | "idProofs"
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const url = await uploadToCloudinary(file);

      if (fieldName === "photo") {
        form.setValue("photo", url);
        setPhotoPreview(url);
      } else {
        form.setValue("idProofs", url);
        setIdProofPreviews(url);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (fieldName === "photo") {
        form.setValue("photo", "");
        setPhotoPreview("");
      } else {
        form.setValue("idProofs", "");
        setIdProofPreviews("");
      }

      toast.error("Image upload failed.");
    }
  }

  async function onSubmit(values: z.infer<typeof uploadSchema>) {
    const updatedData = {...data, ...values};
    setData(updatedData);
    console.log({ ...data, ...values });

    try {
      console.log(data, 'COMING FROM PAGETSX UPLOAD SUBMIT BUTTON');
      helpSeekerRegister(updatedData).unwrap();
      toast.success('Sent information successfully');
      dispatch(setIsOnboarded(true));
      router.push('/onboarding/verify');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error);
      toast.error(`There was an error: ${error.data.message}`);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2 max-w-[350px] md:w-[450px]">
        <h1 className="text-2xl md:text-4xl font-semibold">Upload ID</h1>
        <p className="md:text-lg">Upload your IDs to verify your identity</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-4"
          >
            <CustomFormField
              control={form.control}
              name="alias"
              label="Alias"
              placeholder="Enter Name Alias"
              type="text"
            />
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Photo (Max. 1MB)
              </label>

              <div className="relative w-full h-48 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "photo")}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {photoPreview ? (
                  <CldImage
                    width="200"
                    height="200"
                    src={photoPreview}
                    alt="User photo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400 z-0">
                    <Upload />
                    <p>Click to Upload</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Government ID Proof (Max. 1MB)
              </label>

              <div className="relative w-full h-40 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "idProofs")}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {idProofPreviews ? (
                  <CldImage
                    width="200"
                    height="200"
                    src={idProofPreviews}
                    alt="User photo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400 z-0">
                    <Upload />
                    <p>Click to Upload</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full justify-between mt-6 md:mt-2">
              <Button
                onClick={() => router.push("/onboarding/details")}
                className="w-40 min-h-1 bg-neutral-300 hover:bg-neutral-400 cursor-pointer transition duration-300 ease-in"
              >
                <ArrowLeft /> Previous
              </Button>
              <Button
                type="submit"
                className="w-40 min-h-10 bg-[#8300EA] hover:bg-[#8300EA95] transition duration-300 cursor-pointer ease-in"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
                <ArrowRight />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex gap-2 mt-8 w-[200px]">
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
        <div className="w-full h- bg-[#8300EA] rounded-3xl"></div>
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
      </div>
    </div>
  );
};

export default UploadPage;
