import { Request, Response } from "express";
import { prisma } from "../../db";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { sendVerificationEmail } from "../../utils/email.config";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GET NGO USER
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  try {
    const result = await prisma.user.findUnique({ where: { id: userId } });
    if (!result) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(result);
    res
      .status(200)
      .json({ success: true, message: "User found", data: result });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

// SIGN UP NGO
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
        role: "NGO",
      },
    });

    sendVerificationEmail(name, email, otp).catch(console.error);
    res.status(201).json({
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

// SIGN IN NGO
export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email }, include: {ngo: {select: {id: true}}} });

    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.password) {
      res.status(400).json({
        success: false,
        message: "Please sign in with Google or register first",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Incorrect password" });
      return;
    }

    if (!user.isVerified) {
      res
        .status(403)
        .json({ success: false, message: "Please verify your account first" });
      return;
    }

    if(user.role !== "NGO") {
      res.status(403).json({success: false, message: "Registed with another role"});
      return;
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      isOnboarded: user.isOnboarded,
      isVerified: user.isVerified,
      role: user.role,
      isAdminApproved: user.isAdminApproved,
      userName: user.name,
      email: user.email,
      roleId: user.ngo?.id
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      isOnboarded: user.isOnboarded,
      isVerified: user.isVerified,
      role: user.role,
      isAdminApproved: user.isAdminApproved,
      userName: user.name,
      email: user.email,
      roleId: user.ngo?.id
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

// VERIFY EMAIL NGO
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
        isVerified: true,
      },
    });

    res.redirect("http://localhost:3002/sign-in");
  } catch (error) {
    console.error("Error during email verification:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

// RESEND OTP NGO
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
    res.status(200).json({
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

// OAUTH SYNC NGO
export const oauthSync = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ success: false, message: "No token provided" });
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      res
        .status(400)
        .json({ success: false, message: "Invalid token payload" });
      return;
    }

    const { email, name } = payload;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          isOnboarded: false,
          role: "NGO",
          otpCode: null,
          otpExpiry: null,
          isVerified: true,
        },
      });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      isOnboarded: user.isOnboarded,
      isVerified: user.isVerified,
      role: user.role,
      isAdminApproved: user.isAdminApproved,
      userName: user.name,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      isOnboarded: user.isOnboarded,
      isVerified: user.isVerified,
      role: user.role,
      isAdminApproved: user.isAdminApproved,
      userName: user.name,
      email: user.email,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "User synced successfully",
      data: user,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Error during OAuth sync:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

// NGO REFRESH ACCESS TOKEN
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });
    return;
  }
  console.log(token);
  console.log("GOING INSIDE JWT");
  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: any, payload: any) => {
      if (err) return res.sendStatus(403);
      console.log("COMING FROM REFRESH TOKEN", payload);
      const accessToken = generateAccessToken(payload.userId);
      console.log("COMING FROM REFRESH TOKEN", accessToken);
      res.json({ accessToken });
    }
  );
  console.log("GOING OUTSIDE JWT");
};