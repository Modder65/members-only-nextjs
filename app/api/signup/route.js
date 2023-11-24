import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connect-db.js";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { UserModel } from "../../../models/user.js";

// Configure Nodemailer to use Elastic Email's SMTP
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.EMAILPORT,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

// Verification Code Generator
function generateRandomVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Sign up Request
export async function POST(request) {
  await connectDB();
  const reqBody = await request.json();
  console.log(reqBody);

  try {
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);
    console.log("Password hashed successfully");
    const verificationCode = generateRandomVerificationCode();

    const user = new UserModel({
      name: reqBody.name,
      email: reqBody.email,
      password: hashedPassword,
      isMember: false,
      isVerified: false,
      verificationCode,
    });

    await user.save();
    console.log("User created successfully");

    /*
    // Send verification email
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: "Email Verification",
      text: `Your verification code is ${verificationCode}`,
      html: `<p>Your verification code is <b>${verificationCode}</b></p>`
    };
    console.log("Sending email with options:", mailOptions);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    */

    return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error occurred:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}