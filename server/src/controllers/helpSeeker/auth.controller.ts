import { prisma } from "../../db";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { sendVerificationEmail } from "../../utils/email.config";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        otpCode: otp,
        otpExpiry: addMinutes(new Date(), 30),
        role: "HELP_SEEKER",
      },
    });

    sendVerificationEmail(name, email, otp).catch(console.error);
    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
  } catch (error) {
    console.error("Error during sign up:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Incorrect password" });
      return;
    }

    if (!!user.otpCode || user.role !== "HELP_SEEKER") {
      res
        .status(403)
        .json({ success: false, message: "Please verify your account first" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Login successful", data: user });
  } catch (error) {
    console.error("Error during sign in:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, email } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email) },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (
      user.otpCode !== code &&
      user.otpExpiry &&
      new Date() < user.otpExpiry
    ) {
      res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        otpCode: null,
        otpExpiry: null,
      },
    });
    
    res.redirect('http://localhost:3000/onboarding/details');
    res
      .status(200)
      .json({
        success: true,
        message: "Email verified successfully",
        data: updatedUser,
      });
  } catch (error) {
    console.error("Error during email verification:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        otpCode: verificationCode,
        otpExpiry: addMinutes(new Date(), 30),
      },
    });

    sendVerificationEmail(
      updatedUser.name,
      updatedUser.email,
      verificationCode
    ).catch(console.error);
    res
      .status(200)
      .json({
        success: true,
        message: "OTP resent successfully",
        data: updatedUser,
      });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

export const oauthSync = async (req: Request, res: Response): Promise<void> => {
    const {email, name} = req.body;

    try {
        let user = await prisma.user.findUnique({where: {email}});
        if(!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    isOnboarded: false,
                    role: 'HELP_SEEKER',
                    otpCode: null,
                    otpExpiry: null,
                }
            });
        }

        res.status(200).json({success: true, message: "User synced successfully", data: user});
    } catch (error) {
        console.error("Error during OAuth sync:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error", error: error });
    }
}

export const registerHelpSeeker = async (req: Request, res: Response): Promise<void> => {
  
}