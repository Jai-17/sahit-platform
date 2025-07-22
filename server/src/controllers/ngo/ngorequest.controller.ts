import { Request, Response } from "express";
import { prisma } from "../../db";
import redis from "../../utils/redis";

export const getIncomingHelpRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.roleId;
  const cacheKey = `cache:incomingRequests-${userId}`
  console.log("Coming from here", userId);
  try {
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      console.log("Returning from cache");
      res.json({
        success: true,
        message: "Found Incoming Request from REDIS",
        data: JSON.parse(cached),
      });
      return;
    }

    const helpRequests = (
      await prisma.helpRequestNGOStatus.findMany({
        where: {
          ngoId: userId,
        },
        select: {
          helpRequest: {
            select: {
              id: true,
              description: true,
              helpType: true,
              status: true,
              submittedAt: true,
              title: true,
              urgency: true,
              user: {
                select: {
                  city: true,
                  state: true,
                },
              },
            },
          },
        },
      })
    ).map((item) => item.helpRequest);

    if (!helpRequests) {
      res.status(404).json({ success: false, message: "NGO Not Found" });
      return;
    }

    await redis.set(cacheKey, JSON.stringify(helpRequests), "EX", 300);

    res.status(200).json({
      success: true,
      message: "Incoming Requests",
      data: helpRequests,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllHelpRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ngoId = req.user.roleId;
  const cacheKey = `cache:allHelpRequestForNGO-${ngoId}`

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
      where: { ngoId: ngoId },
      include: { user: true },
    });

    if (!helpRequests || helpRequests.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "No help requests found" });
      return;
    }

    await redis.set(cacheKey, JSON.stringify(helpRequests), "EX", 1200);


    res
      .status(200)
      .json({
        success: true,
        message: "Found help requests",
        data: helpRequests,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get active requests
export const getHelpRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const helpRequestId = req.params.id;

  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: helpRequestId },
      include: { user: true, assignedNGO: true },
    });

    if (!helpRequest) {
      res
        .status(404)
        .json({ success: false, message: "No help request found" });
      return;
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Help Request by Id Found",
        data: helpRequest,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
