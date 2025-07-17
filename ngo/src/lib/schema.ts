import z from 'zod';

const phoneRegex = /^[0-9]{10}$/;
const timeRangeRegex = /^([1-9]|1[0-2])(?:am|pm)-([1-9]|1[0-2])(?:am|pm)$/i;

export enum HelpType {
  LEGAL = "LEGAL",
  SHELTER = "SHELTER",
  COUNSELLING = "COUNSELLING",
  FINANCIAL = "FINANCIAL",
  OTHER = "OTHER"
}

export const onboardingSchema = z.object({
    replyTimeMins: z.string().min(1, "Reply Time is required"),
    supportTypes: z.array(z.enum(HelpType), {error: "Support types are required"}),
    address: z.string().min(10, "Address must be at least 10 characters long"),
    city: z.string().min(2, "City must be at least 2 characters long"),
    state: z.string().min(2, "State must be at least 2 characters long"),
    phone: z.string().min(10, "Contact number must be at least 10 digits long").regex(phoneRegex, "Contact number must be a valid 10-digit number"),
    whatsappSame: z.boolean().optional(),
    whatsappNumber: z.string().min(10, "WhatsApp number must be at least 10 digits long").regex(phoneRegex, "WhatsApp number must be a valid 10-digit number"),
    about: z.string().min(20, 'Must be at least 20 characters long'),
    representativeName: z.string().min(1, 'Name is Required'),
    representativeTitle: z.string().min(1, "Title is Required"),
    representativeAvailability: z.string().regex(timeRangeRegex, "Availability must be in format like '9am-12pm'"),
    verifiedDocs: z.array(z.string().url("Each document must be a valid url")).min(1, "At least one verification proof is required.").max(3, "Max 3 Proofs"),
})