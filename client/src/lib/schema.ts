import z from "zod";

const phoneRegex = /^[0-9]{10}$/;

export const onboardingSchema = z.object({
    age: z.coerce.number().min(1, "Age is Required"),
    occupation: z.string().optional(),
    company: z.string().optional(),
    jobType: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
    contact: z.string().min(10, "Contact number must be at least 10 digits long").regex(phoneRegex, "Contact number must be a valid 10-digit number"),
    whatsappSame: z.boolean().optional(),
    whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits long").regex(phoneRegex, "WhatsApp number must be a valid 10-digit number"),
    address: z.string().min(10, "Address must be at least 10 characters long"),
    city: z.string().min(2, "City must be at least 2 characters long"),
    state: z.string().min(2, "State must be at least 2 characters long"),
    alias: z.string().min(2, "Alias must be at least 2 characters long"),
    photo: z.string().url("Photo must be a valid URL"),
    idProofs: z.string().url("ID Proofs must be valid URLs")
})

export const requestFormSchema = z.object({
    helpType: z.enum(["LEGAL", "SHELTER", "COUNSELLING", "FINANCIAL", "OTHER"]),
    title: z.string().min(10, "Title is required, min 10 characters"),
    description: z.string().min(20, "Description is required, minimum 20 characters"),
    attachments: z.array(z.string().url('Each document must be a valid url')).max(5, "You can only upload 5 documents"),
    urgency: z.enum(["HIGH", "URGENT", "MEDIUM", "LOW"]),
    hideId: z.boolean(),
    hideFace: z.boolean(),
    hideName: z.boolean()
})