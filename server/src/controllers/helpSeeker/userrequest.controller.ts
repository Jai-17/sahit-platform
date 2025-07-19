import { Request, Response } from "express";
import { prisma } from "../../db";

export const getAllHelpRequests = async (req: Request, res: Response): Promise<void> => {
    const helpSeekerId = req.user.roleId;

    try {
        const helpRequests = await prisma.helpRequest.findMany({
            where: { userId: helpSeekerId },
            include: { assignedNGO: true }
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
};


export const getActiveHelpRequest = async (req: Request, res: Response): Promise<void> => {
    const helpSeekerId = req.user.roleId;

    try {
        const activeRequest = await prisma.helpRequest.findFirst({
            where: {
                userId: helpSeekerId,
                status: {
                    in: ['IN_PROGRESS']
                }
            },
            include: { assignedNGO: true }
        });

        if (!activeRequest) {
            res.status(404).json({ success: false, message: "No active help request found" });
            return;
        }

        res.status(200).json({ success: true, message: "Found active help request", data: activeRequest });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getHelpRequestCount = async (req: Request, res: Response): Promise<void> => {
    const helpSeekerId = req.user.roleId;

    try {
        const count = await prisma.helpRequest.count({
            where: { userId: helpSeekerId }
        });

        res.status(200).json({ success: true, message: "Total request count", data: { count } });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};