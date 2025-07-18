import { Request, Response } from "express";
import { prisma } from "../../db";

export const getIncomingHelpRequests = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    console.log('Coming from here', userId);
    try {
        const ngo = await prisma.helpRequest.findMany({
            where: {
                requestedNGOs: {
                    some: {
                        userId: userId,
                    }
                }
            },
            include: {
                user: true,
            }
        })

        if(!ngo) {
            res.status(404).json({success: false, message: "NGO Not Found"});
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Incoming Requests',
            data: ngo
        })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}