import { Request, Response } from "express";
import { prisma } from "../../db";

export const getIncomingHelpRequests = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.roleId;
    console.log('Coming from here', userId);
    try {
        const ngo = await prisma.helpRequestNGOStatus.findMany({
            where: {
                ngoId: userId
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

export const getAllHelpRequest = async (req: Request, res:Response): Promise<void> => {
    const ngoId = req.user.roleId;

    try {
        const helpRequests = await prisma.helpRequest.findMany({
            where: { ngoId: ngoId },
            include: { user: true }
        });

        if (!helpRequests || helpRequests.length === 0) {
            res.status(404).json({ success: false, message: "No help requests found" });
            return;
        }

        res.status(200).json({ success: true, message: "Found help requests", data: helpRequests });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// get active requests
export const getHelpRequestById = async (req: Request, res: Response): Promise<void> => {
    const helpRequestId = req.params.id;

    try {
        const helpRequest = await prisma.helpRequest.findUnique({where: {id: helpRequestId}, include: {user: true, assignedNGO: true}});

        if(!helpRequest) {
            res.status(404).json({success: false, message: "No help request found"});
            return;
        }

        res.status(200).json({success: true, message: "Help Request by Id Found", data: helpRequest});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}