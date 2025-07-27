"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGiveFeedbackMutation } from "@/store/features/protectedApiSlice";
import { toast } from "sonner";

const feedbackForm = z.object({
  rating: z.number().min(1, "Please select a rating"),
  content: z.string().optional(),
});

const GiveFeedback = ({ ngoId }: { ngoId: string }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [giveFeedback] = useGiveFeedbackMutation();

  const form = useForm<z.infer<typeof feedbackForm>>({
    resolver: zodResolver(feedbackForm),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });

  const selectedRating = form.watch("rating");

  async function onSubmit(values: z.infer<typeof feedbackForm>) {
    const feedbackData = { ...values, ngoId };
    try {
      await giveFeedback(feedbackData).unwrap();
      toast.success("Send feedback successfully!");
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(`There was an error: ${error.data.message}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="boreder border-[#8300EA] h-10 px-7 text-[#8300EA] rounded-md hover:bg-neutral-100 hover:text-[#8300EA] transition duration-200 ease-in cursor-pointer"
        >
          Give Feedback
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Give Feedback</DialogTitle>
              <DialogDescription>
                We value your feedback! Please share your experience to help us
                improve our service.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate your experience</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              onMouseEnter={() => setHovered(star)}
                              onMouseLeave={() => setHovered(null)}
                              onClick={() => field.onChange(star)}
                              className={cn(
                                "h-6 w-6 cursor-pointer transition-colors",
                                (hovered ?? selectedRating) >= star
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your experience</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          wrap="soft"
                          className="resize-y w-full text-sm md:text-base overflow-hidden break-words whitespace-pre-line"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#8300EA] hover:bg-[#8300EA90]"
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GiveFeedback;
