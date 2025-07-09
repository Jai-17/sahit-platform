import { Resend } from 'resend';
import dotenv from 'dotenv';
import { getVerificationEmail } from './emailTemplate';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(name: string, email: string, otpCode: string) {
    const html = getVerificationEmail(name, email, otpCode);
    const {data, error} = await resend.emails.send({
        from: 'ACME <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your email address',
        html: html,
    })

    if(error) {
        return console.error({error});
    }

    console.log(`Message is sent to ${email} with data:`, data);
}