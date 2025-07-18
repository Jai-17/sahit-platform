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
    roleId?: string;
}

export const generateRefreshToken = ({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email, roleId}: TokenPayload) => {
    return jwt.sign({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email, roleId}, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: '30d'});
}

export const generateAccessToken = ({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email, roleId}:TokenPayload) => {
    return jwt.sign({userId, isOnboarded, isVerified, isAdminApproved, role, userName, email, roleId}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "30d"});
}