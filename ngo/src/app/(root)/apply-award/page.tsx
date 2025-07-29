/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { useSendAwardRequestMutation } from "@/store/features/protectedApiSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const awardFormSchema = z.object({
  workDone: z.string().min(1, "Required"),
  reason: z.string().min(1, "Required"),
});

const Page = () => {
  const router = useRouter();
  const [sendAwardRequest] = useSendAwardRequestMutation();
  const form = useForm<z.infer<typeof awardFormSchema>>({
    resolver: zodResolver(awardFormSchema),
    defaultValues: {
      workDone: "",
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof awardFormSchema>) {
    try {
      await sendAwardRequest(values).unwrap();
      toast.success("Award Application Sent");
      router.push("/");
    } catch (error: any) {
      console.error("ERROR:", error);
      toast.error(`Error submitting application: ${error.data.message}`);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-4xl font-semibold">
          Apply for Sahit Awards 🏆
        </h1>
        <p className="bg-purple-100 p-4 text-center my-3 rounded-lg md:text-lg font-medium text-purple-950">
          We honor women and NGOs who have made a meaningful impact in their
          communities or fields of work. Whether you&apos;ve championed change,
          led initiatives, empowered others, or made contributions that deserve
          recognition. We want to hear your story.
        </p>
        <p>
          Highlight your initiatives and the impact you&apos;ve made. Please
          share detailed, genuine responses. This will help us better understand
          your contribution and why it deserves recognition.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="workDone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe the Work You&apos;ve Done</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      wrap="soft"
                      placeholder="Explain the nature of your work or project. Include what you did, who it impacted, and how it contributed to society or your field. (Focus on organizational initiatives.)"
                      className="h-36 resize-y w-full text-sm md:text-base overflow-hidden bg-white break-words whitespace-pre-line"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Why Should You Be Considered for the Sahit Award?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      wrap="soft"
                      placeholder="Tell us why you should be recognized. Share the outcomes of your work, the challenges you overcame, and the lasting impact it has had on others."
                      className="h-36 resize-y w-full text-sm md:text-base overflow-hidden break-words bg-white whitespace-pre-line"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button
              type="submit"
              className="bg-[#8300EA] hover:bg-[#8300EA90] px-8 py-5 cursor-pointer"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
