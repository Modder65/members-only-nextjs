import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email, token) => {
  await resend.emails.send({
    from: "mail@members-only.blog",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`
  });
};

export const sendInvitationEmail = async (email, token) => {
  // change to domain for production
  const confirmLink = `${domain}/auth/register?token=${token}`;

  await resend.emails.send({
    from: "mail@members-only.blog",
    to: email,
    subject: "Invitation MembersOnly",
    html: `<p>Click <a href="${confirmLink}">here</a> to create an account.</p>`
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  // change to domain for production
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "mail@members-only.blog",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  });
};

export const sendVerificationEmail = async (email, token) => {
  // change to domain for production
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "mail@members-only.blog",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });
};