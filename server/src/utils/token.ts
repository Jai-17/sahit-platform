import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

interface TokenPayload {
    userId: string;
    isOnboarded: boolean;
    isVerified: boolean;
    isAdminApproved: boolean;
    role: string;
    userName: string;
    email: string;
}

export const generateRefreshToken = ({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email}: TokenPayload) => {
    return jwt.sign({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email}, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: '30d'});
}

export const generateAccessToken = ({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email}:TokenPayload) => {
    return jwt.sign({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"});
}