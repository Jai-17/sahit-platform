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
      select: {
        id: true,
        ngoId: true,
        hideFace: true,
        helpType: true,
        urgency: true,
        status: true,
        submittedAt: true,
        user: {
          select: {
            name: true,
            alias: true
          }
        }
      }
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
      select: {
        hideId: true,
        title: true,
        description: true,
        hideName: true,
        status: true,
        urgency: true,
        helpType: true,
        user: {
          select: {
            name: true,
            city: true,
            state: true,
            address: true,
            age: true,
            createdAt: true,
            occupation: true,
            jobType: true,
            company: true,
            idProofs: true,
            alias: true,
            photo: true,
            whatsapp: true,
            whatsappSame: true,
            email: true,
            contact: true,
            userId: true
          }
        },
        assignedNGO: {
          select: {
            representativeName: true,
            representativeTitle: true,
            representativeAvailability: true,
            about: true,
          }
        }
      }
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
