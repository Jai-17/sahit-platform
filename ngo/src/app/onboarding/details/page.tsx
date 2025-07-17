"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HelpType, onboardingSchema } from "@/lib/schema";
import { useOnboardingForm } from "@/store/OnboardingFormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "@/components/forms/FormField";
import { MultiSelectDropdown } from "@/components/forms/MultiSelectDropdown";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const detailsSchema = onboardingSchema.pick({
  replyTimeMins: true,
  supportTypes: true,
  address: true,
  city: true,
  state: true,
  phone: true,
  whatsappNumber: true,
  whatsappSame: true,
  about: true,
  representativeTitle: true,
  representativeName: true,
  representativeAvailability: true,
});

const DetailsPage = () => {
  const router = useRouter();
  const { data, setData } = useOnboardingForm();
  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      replyTimeMins: "1",
      supportTypes: [HelpType.LEGAL],
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

  const { watch, setValue } = form;
  const whatsappSame = watch("whatsappSame");
  const contact = watch("phone");

  useEffect(() => {
    if (whatsappSame) {
      setValue("whatsappNumber", contact);
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
              </div>
              <div className="flex gap-4">
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
                  label="Average Reply Time (in mins)"
                  placeholder="Enter time in mins"
                  type="text"
                />
              </div>
              <CustomFormField
                control={form.control}
                name="address"
                label="Address"
                placeholder="Enter your Address"
                type="text"
              />
              <div className="flex gap-4">
                <CustomFormField
                  control={form.control}
                  name="state"
                  label="State"
                  placeholder="Enter State"
                  type="text"
                />
                <CustomFormField
                  control={form.control}
                  name="city"
                  label="City"
                  placeholder="Enter City"
                  type="text"
                />
              </div>
              <MultiSelectDropdown />
              <div className="w-full max-w-md">
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
              </div>
              <div className="flex gap-4">
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
