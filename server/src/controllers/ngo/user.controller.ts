import { Request, Response } from "express";
import redis from "../../utils/redis";
import { prisma } from "../../db";

export const getAllNgos = async (req: Request, res: Response):Promise<void> => {
    const cacheKey = "cache:AllNGOs";

    try {
        const cached = await redis.get(cacheKey);

        if(cached) {
            console.log("Returning from cache");
            res.json({
                success: true,
                message: "Found NGOs from REDIS",
                data: JSON.parse(cached),
            })
            return;
        }

        const data = await prisma.nGO.findMany({
            include: {
                user: {
                    select: {isAdminApproved: true}
                }
            }
        });
        if(!data) {
            res.status(404).json({success: false, message: "No NGOs found"});
            return;
        }

        await redis.set(cacheKey, JSON.stringify(data), 'EX', 300);

        res.status(200).json({success: true, message: 'Found NGOs from DB', data: data});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const registerNGO = async (req: Request, res: Response):Promise<void> => {
    //const userIdFromToken = req.user?.userId;
    const userIdFromToken = "19c2613d-380c-448b-b47f-59937568e6d6";
    const emailFromToken = "test@gmail.com";
    const nameFromToken = "Kalam Foundation"
    const isVerifiedFromToken = true;
    const userRoleFromToken = "NGO";

    const {replyTimeMins, supportTypes, address, city, state, phone, whatsappSame, whatsappNumber, about, representativeName, representativeTitle, representativeAvailability, verifiedDocs} = req.body;

    try {
        if(!isVerifiedFromToken || userRoleFromToken !== "NGO") {
            res.status(403).json({success: false, message: "Please verify your account first"});
            return;
        }

        if(!emailFromToken || !userIdFromToken) {
            res.status(400).json({success: false, message: "User Data not found"});
            return;
        }

        const existingNGO = await prisma.nGO.findUnique({
            where: {userId: userIdFromToken},
        })

        if(existingNGO) {
            res.status(400).json({success: false, message: "NGO already registered"});
            return;
        }

        const ngo = await prisma.nGO.create({
            data: {
                userId: userIdFromToken,
                email: emailFromToken,
                name: nameFromToken,
                replyTimeMins,
                supportTypes,
                address,
                city,
                state,
                phone,
                whatsappSame,
                whatsappNumber,
                about,
                representativeName,
                representativeTitle,
                representativeAvailability,
                verifiedDocs
            }
        })

        const user = await prisma.user.update({
            where: {email: emailFromToken},
            data: {isOnboarded: true},
        })

        res.status(200).json({success: true, message: "NGO Registered Successfully", data: ngo});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}