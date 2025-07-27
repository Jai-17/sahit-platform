import { Request, Response } from "express";
import { prisma } from "../../db";
import redis from "../../utils/redis";
import chatClient, { deleteChatBetweenUsers } from "../../chat";

export const getAllHelpRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const helpSeekerId = req.user.roleId;
  const cacheKey = `cache:allHelpRequests-${helpSeekerId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Returning from cache");
      res.json({
        success: true,
        message: "Found Help Request from REDIS",
        data: JSON.parse(cached),
      });
      return;
    }

    const helpRequests = await prisma.helpRequest.findMany({
      where: { userId: helpSeekerId },
      select: {
        id: true,
        ngoId: true,
        helpType: true,
        urgency: true,
        status: true,
        submittedAt: true,
        assignedNGO: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!helpRequests || helpRequests.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "No help requests found" });
      return;
    }

    await redis.set(cacheKey, JSON.stringify(helpRequests), "EX", 1200);

    res.status(200).json({
      success: true,
      message: "Found help requests",
      data: helpRequests,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getActiveHelpRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const helpSeekerId = req.user.roleId;
  const cacheKey = `cache:activeHelpRequestOfUser-${helpSeekerId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Returning from cache");
      res.json({
        success: true,
        message: "Found Active Help Request from REDIS",
        data: JSON.parse(cached),
      });
      return;
    }

    const activeRequest = await prisma.helpRequest.findFirst({
      where: {
        userId: helpSeekerId,
        status: {
          in: ["IN_PROGRESS", "SEND_TO_NGOS"],
        },
      },
      select: {
        id: true,
        helpType: true,
        urgency: true,
        status: true,
        submittedAt: true,
        assignedNGO: { select: { name: true } },
      },
    });

    if (!activeRequest) {
      res
        .status(404)
        .json({ success: false, message: "No active help request found" });
      return;
    }

    await redis.set(cacheKey, JSON.stringify(activeRequest), "EX", 1200);

    res.status(200).json({
      success: true,
      message: "Found active help request",
      data: activeRequest,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getActiveHelpRequestDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const helpSeekerId = req.user.roleId;

  try {
    const activeRequest = await prisma.helpRequest.findFirst({
      where: {
        userId: helpSeekerId,
        status: {
          in: ["IN_PROGRESS", "SEND_TO_NGOS"],
        },
      },
      select: {
        title: true,
        description: true,
        status: true,
        urgency: true,
        helpType: true,
        assignedNGO: {
          select: {
            name: true,
            about: true,
            city: true,
            state: true,
            address: true,
            rating: true,
            createdAt: true,
            supportTypes: true,
            replyTimeMins: true,
            email: true,
            phone: true,
            whatsappNumber: true,
            whatsappSame: true,
            representativeAvailability: true,
            representativeName: true,
            representativeTitle: true,
            userId: true,
          },
        },
      },
    });

    if (!activeRequest) {
      res
        .status(404)
        .json({ success: false, message: "No active help request found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Found active help request",
      data: activeRequest,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getHelpRequestCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const helpSeekerId = req.user.roleId;

  try {
    const count = await prisma.helpRequest.count({
      where: { userId: helpSeekerId },
    });

    res
      .status(200)
      .json({ success: true, message: "Total request count", data: { count } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const giveFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const helpSeekerId = req.user.roleId;
  const { ngoId, rating, content } = req.body;

  try {
    if (!ngoId || !rating || !content) {
      res.status(400).json({
        success: false,
        message: "NGO ID, rating, and content are required",
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.feedback.create({
        data: {
          userId: helpSeekerId,
          ngoId,
          rating,
          content,
        },
      });

      const { _avg } = await tx.feedback.aggregate({
        where: { ngoId },
        _avg: {
          rating: true,
        },
      });
      
      await tx.nGO.update({
        where: { id: ngoId },
        data: {
          rating: _avg.rating || 0,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const helpSeekerMarkAsResolved = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { requestId } = req.body;

  try {
    if (!requestId) {
      res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
      return;
    }

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      include: {
        user: { select: { userId: true } },
        assignedNGO: { select: { userId: true } },
      },
    });

    if (!helpRequest) {
      res.status(404).json({
        success: false,
        message: "Help request not found",
      });
      return;
    }

    if (helpRequest.seekerResolved) {
      res.status(409).json({
        success: false,
        message: "You have already marked this request as resolved",
      });
      return;
    }

    const updateData: any = {
      seekerResolved: true,
    };

    if (helpRequest.ngoResolved) {
      updateData.status = "RESOLVED";
      await deleteChatBetweenUsers(
        chatClient,
        helpRequest.user.userId,
        helpRequest.assignedNGO!.userId
      );
    }

    await prisma.helpRequest.update({
      where: { id: requestId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message:
        updateData.status === "RESOLVED"
          ? "Request fully resolved"
          : "Marked as resolved from your side. Waiting for NGO confirmation.",
    });
  } catch (error) {
    console.error("Error marking help request as resolved:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getHelpRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const helpRequestId = req.params.id;

  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: helpRequestId },
      select: {
        title: true,
        description: true,
        status: true,
        urgency: true,
        helpType: true,
        assignedNGO: {
          select: {
            id: true,
            representativeName: true,
            representativeTitle: true,
            representativeAvailability: true,
            about: true,
            name: true,
            city: true,
            state: true,
            address: true,
            rating: true,
            createdAt: true,
            supportTypes: true,
            replyTimeMins: true,
            email: true,
            phone: true,
            whatsappNumber: true,
            userId: true,
          },
        },
      },
    });

    if (!helpRequest) {
      res
        .status(404)
        .json({ success: false, message: "No help request found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Help Request by Id Found",
      data: helpRequest,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
