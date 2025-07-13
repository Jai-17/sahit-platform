import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

interface TokenPayload {
    userId: string;
    isOnboarded: boolean;
    isVerified: boolean;
    role: string;
}

export const generateRefreshToken = ({userId, isOnboarded, isVerified, role}: TokenPayload) => {
    return jwt.sign({userId, isOnboarded, isVerified, role}, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: '30d'});
}

export const generateAccessToken = ({userId, isOnboarded, isVerified, role}:TokenPayload) => {
    return jwt.sign({userId, isOnboarded, isVerified, role}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"});
}