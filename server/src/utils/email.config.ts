import { Resend } from 'resend';
import { getHelpRequestApprovalByNGOEmail, getNGOApprovalEmail, getNgoMatchConfirmedEmail, getNgoNewHelpRequestEmail, getUserApprovedByAdminEmail, getVerificationEmail } from './emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(name: string, email: string, otpCode: string) {
    const html = getVerificationEmail(name, email, otpCode);
    const {data, error} = await resend.emails.send({
        from: 'Sahit <hello@jaimadhukar.com>',
        to: [email],
        subject: 'Verify your email address',
        html: html,
    })

    if(error) {
        return console.error({error});
    }

    console.log(`Message is sent to ${email} with data:`, data);
}

export async function sendNGOApprovalEmail(name: string, email: string) {
  const html = getNGOApprovalEmail(name);
  const { data, error } = await resend.emails.send({
    from: 'Sahit <hello@jaimadhukar.com>',
    to: [email],
    subject: 'Your NGO Has Been Approved!',
    html,
  });

  if (error) return console.error({ error });
  console.log(`NGO approval email sent to ${email}:`, data);
}


export async function sendUserApprovedByAdminEmail(name: string, email: string) {
  const html = getUserApprovedByAdminEmail(name);
  const { data, error } = await resend.emails.send({
    from: 'Sahit <hello@jaimadhukar.com>',
    to: [email],
    subject: 'Your Account Has Been Verified!',
    html,
  });

  if (error) return console.error({ error });
  console.log(`User approval email sent to ${email}:`, data);
}

export async function sendHelpRequestApprovalByNGOEmail(name: string, email: string, ngoName: string) {
  const html = getHelpRequestApprovalByNGOEmail(name, ngoName);
  const { data, error } = await resend.emails.send({
    from: 'Sahit <hello@jaimadhukar.com>',
    to: [email],
    subject: 'Your Help Request Has Been Accepted!',
    html,
  });

  if (error) return console.error({ error });
  console.log(`Help request approval email sent to ${email}:`, data);
}

export async function sendNgoNewHelpRequestEmail(ngoEmail: string, ngoName: string, requesterName: string, requestId: string) {
  const html = getNgoNewHelpRequestEmail(ngoName, requesterName, requestId);
  const { data, error } = await resend.emails.send({
    from: 'Sahit <hello@jaimadhukar.com>',
    to: [ngoEmail],
    subject: 'New Help Request for You',
    html,
  });

  if (error) return console.error({ error });
  console.log(`New request email sent to NGO ${ngoEmail}:`, data);
}

export async function sendNgoMatchConfirmedEmail(ngoEmail: string, ngoName: string, userName: string, requestId: string) {
  const html = getNgoMatchConfirmedEmail(ngoName, userName, requestId);
  const { data, error } = await resend.emails.send({
    from: 'Sahit <hello@jaimadhukar.com>',
    to: [ngoEmail],
    subject: 'Help Match Confirmed!',
    html,
  });

  if (error) return console.error({ error });
  console.log(`Match confirmation email sent to NGO ${ngoEmail}:`, data);
}
