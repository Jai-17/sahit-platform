import z from "zod";

export const onboardingSchema = z.object({
    age: z.number().min(18, "You must be at least 18 years old"),
    occupation: z.string().optional(),
    company: z.string().optional(),
    jobType: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
    contact: z.number(),
    whatsappSame: z.boolean().optional(),
    whatsapp: z.number().optional(),
    address: z.string().min(10, "Address must be at least 10 characters long"),
    city: z.string().min(2, "City must be at least 2 characters long"),
    state: z.string().min(2, "State must be at least 2 characters long"),
    alias: z.string().min(2, "Alias must be at least 2 characters long"),
    photo: z.string(),
    idProofs: z.array(z.string()).min(1, "At least one ID proof is required"),
})