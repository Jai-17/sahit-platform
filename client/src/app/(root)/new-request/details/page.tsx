"use client";

import CustomFormField from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { requestFormSchema } from "@/lib/schema";
import { useRequestForm } from "@/store/RequestFormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const detailsSchema = requestFormSchema.pick({
  helpType: true,
  title: true,
  description: true,
  attachments: true,
  urgency: true,
});

const Page = () => {
  const router = useRouter();
  const {data, setData} = useRequestForm();
  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      helpType: "LEGAL",
      title: "",
      description: "",
      attachments: [],
      urgency: "LOW",
    },
  });

  const { watch, setValue, getValues } = form;

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return 0;
    if (watch("attachments").length >= 5) {
      toast.error("You can only upload up to 5 documents");
      return;
    }

    try {
      const file = files[0];
      const url = await uploadToCloudinary(file);

      const current = getValues("attachments");
      setValue("attachments", [...current, url]);
    } catch (error) {
      console.log(error);
      toast.error("File upload fail");
    }
  }

  async function onSubmit(values: z.infer<typeof detailsSchema>) {
    console.log("clicking");
    console.log(values);
    setData({...data, ...values});
    router.push('/new-request/disclosures')
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="font-semibold text-xl">Details</h1>
        <p className="mt-2 text-neutral-600">Explain your request in details</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-4"
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="helpType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Help Type</FormLabel>
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
                        <SelectItem value="LEGAL">LEGAL</SelectItem>
                        <SelectItem value="SHELTER">SHELTER</SelectItem>
                        <SelectItem value="COUNSELLING">COUNSELLING</SelectItem>
                        <SelectItem value="FINANCIAL">FINANCIAL</SelectItem>
                        <SelectItem value="OTHER">OTHER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomFormField
                control={form.control}
                name="title"
                label="Request Title"
                placeholder="Enter your query title"
                type="text"
              />
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          wrap="soft"
                          placeholder="Give detailed description of your request"
                          className="resize-y w-full text-sm md:text-base overflow-hidden break-words whitespace-pre-line"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
                <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
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
                        <SelectItem value="LOW">LOW</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                        <SelectItem value="HIGH">HIGH</SelectItem>
                        <SelectItem value="URGENT">URGENT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Files (.png, .jpg, .pdf)
                </label>

                <div className="relative w-full h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={watch("attachments").length >= 5}
                  />
                  <div className="flex flex-col items-center justify-center text-neutral-400 z-0">
                    <Upload />
                    <p>
                      {watch("attachments").length >= 3
                        ? "Max 3 files uploaded"
                        : "Click to Upload"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Display uploaded file names */}
              {watch("attachments").length > 0 && (
                <div className="flex flex-col gap-2">
                  {watch("attachments").map((url, index) => {
                    const fileName = decodeURIComponent(
                      url.split("/").pop() || `File ${index + 1}`
                    );
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
                            const updated = watch("attachments").filter(
                              (item) => item !== url
                            );
                            setValue("attachments", updated);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex my-5 justify-between lg:px-32">
              <Button
                onClick={() => redirect("/new-request/general")}
                className="bg-neutral-400 flex !px-7 py-5 hover:bg-neutral-300 cursor-pointer"
              >
                <ArrowLeft size={18} /> Previous
              </Button>
              <Button
                type="submit"
                className="bg-[#8300EA] mb-5 flex !px-10 py-5 hover:bg-[#8300EA90] cursor-pointer"
              >
                Next <ArrowRight size={20} />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
