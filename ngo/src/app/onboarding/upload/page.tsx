'use client'

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { uploadToCloudinary } from '@/lib/cloudinaryUpload';
import { onboardingSchema } from '@/lib/schema';
import { setIsOnboarded } from '@/store/features/authSlice';
import { useNgoRegisterMutation } from '@/store/features/protectedApiSlice';
import { useOnboardingForm } from '@/store/OnboardingFormContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const uploadSchema = onboardingSchema.pick({
  verifiedDocs: true,
});

const UploadPage = () => {
  const router = useRouter();
  const { data, setData } = useOnboardingForm();
  const [ngoRegister, {isLoading}] = useNgoRegisterMutation();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      verifiedDocs: [],
    },
  });

  const { watch, setValue, getValues } = form;

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (watch("verifiedDocs").length >= 3) {
      toast.error("You can only upload up to 3 documents.");
      return;
    }

    try {
      const file = files[0];
      const url = await uploadToCloudinary(file);

      const current = getValues("verifiedDocs");
      setValue("verifiedDocs", [...current, url]);
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed.");
    }
  }

  async function onSubmit(values: z.infer<typeof uploadSchema>) {
    const updatedData = { ...data, ...values };
    setData(updatedData);
    console.log(updatedData);

    try {
      ngoRegister(updatedData).unwrap();
      toast.success('Send Information Successfully');
      dispatch(setIsOnboarded(true));
      router.push("/onboarding/verify"); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(`There was an error: ${error?.data?.message || "Something went wrong"}`);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2 max-w-[350px] md:w-[450px]">
        <h1 className="text-2xl md:text-4xl font-semibold">Upload ID</h1>
        <p className="md:text-lg">Upload your ID proofs (max 3)</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-4"
          >
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Files (.png, .jpg, .pdf)
              </label>

              <div className="relative w-full h-40 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  disabled={watch("verifiedDocs").length >= 3}
                />
                <div className="flex flex-col items-center justify-center text-neutral-400 z-0">
                  <Upload />
                  <p>{watch("verifiedDocs").length >= 3 ? "Max 3 files uploaded" : "Click to Upload"}</p>
                </div>
              </div>
            </div>

            {/* Display uploaded file names */}
            {watch("verifiedDocs").length > 0 && (
              <div className="flex flex-col gap-2">
                {watch("verifiedDocs").map((url, index) => {
                  const fileName = decodeURIComponent(url.split("/").pop() || `File ${index + 1}`);
                  return (
                    <div
                      key={url}
                      className="w-full px-4 py-2 border rounded-md bg-muted text-sm flex justify-between items-center"
                    >
                      <span className="truncate max-w-[80%]">{fileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = watch("verifiedDocs").filter((item) => item !== url);
                          setValue("verifiedDocs", updated);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex w-full justify-between mt-6 md:mt-2">
              <Button
                type="button"
                onClick={() => router.push("/onboarding/details")}
                className="w-40 bg-neutral-300 hover:bg-neutral-400 cursor-pointer"
              >
                <ArrowLeft className="mr-2" />
                Previous
              </Button>
              <Button
                type="submit"
                className="w-40 bg-[#8300EA] hover:bg-[#8300EA95] cursor-pointer"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="flex gap-2 mt-8 w-[200px]">
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
        <div className="w-full h-2 bg-[#8300EA] rounded-3xl"></div>
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
      </div>
    </div>
  );
};

export default UploadPage;
