import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path


// node mailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_EMAIL_USER,
        pass: process.env.APP_EMAIL_PASS,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    trustedOrigins: [process.env.APP_URL!],
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationEmailUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <prismablog@gmail.com>',
                    to: user.email,
                    subject: "Blog App Email Verification ✔",
                    text: "Hello world?", // Plain-text version of the message
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8" />
                    <title>Email Verification</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    </head>
                    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td align="center" style="padding:40px 0;">
                            
                            <!-- Main Card -->
                            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
                            
                            <!-- Header -->
                            <tr>
                                <td style="background:#0d6efd; padding:20px; text-align:center;">
                                <h1 style="color:#ffffff; margin:0; font-size:24px;">
                                    Prisma Blog
                                </h1>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:30px;">
                                <h2 style="color:#333333; margin-top:0;">
                                    Verify your email address
                                </h2>

                                <p style="color:#555555; font-size:15px; line-height:1.6;">
                                    Hi <strong>${user.name}</strong>,
                                </p>

                                <p style="color:#555555; font-size:15px; line-height:1.6;">
                                    Thanks for creating an account on <strong>Prisma Blog</strong>.
                                    Please confirm your email address by clicking the button below.
                                </p>

                                <!-- Button -->
                                <div style="text-align:center; margin:30px 0;">
                                    <a href="${verificationEmailUrl}"
                                    style="background:#0d6efd; color:#ffffff; text-decoration:none;
                                            padding:14px 28px; border-radius:5px; font-size:16px;
                                            display:inline-block;">
                                    Verify Email
                                    </a>
                                </div>

                                <p style="color:#777777; font-size:14px; line-height:1.6;">
                                    If the button doesn’t work, copy and paste the following link into your browser:
                                </p>

                                <p style="word-break:break-all; font-size:13px; color:#0d6efd;">
                                    ${url}
                                </p>

                                <p style="color:#777777; font-size:14px;">
                                    This link will expire soon. If you didn’t create an account, you can safely ignore this email.
                                </p>

                                <p style="color:#555555; font-size:14px; margin-top:30px;">
                                    Regards,<br/>
                                    <strong>Prisma Blog Team</strong>
                                </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background:#f1f1f1; padding:15px; text-align:center;">
                                <p style="margin:0; font-size:12px; color:#888888;">
                                    © 2025 Prisma Blog. All rights reserved.
                                </p>
                                </td>
                            </tr>

                            </table>

                        </td>
                        </tr>
                    </table>

                    </body>
                </html>
                `
                });

                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.error("Error sending verification email:", error);
                throw error;
            }
        },
    },
    socialProviders: {
        google: {
            accessType: "offline",
            prompt: "select_account consent",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
