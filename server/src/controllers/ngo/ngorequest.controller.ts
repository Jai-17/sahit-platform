import { Request, Response } from "express";
import { prisma } from "../../db";
import redis from "../../utils/redis";
import chatClient, { deleteChatBetweenUsers } from "../../chat";

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
          status: true,
        },
      })
    );

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
      where: { ngoId: ngoId, status: {notIn: ["SEND_TO_NGOS"]} },
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
      },
      orderBy: {
        submittedAt: "desc"
      }
    });

    if (!helpRequests) {
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

export const getAllActiveHelpRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ngoId = req.user.roleId;
  const cacheKey = `cache:allActiveHelpRequestForNGO-${ngoId}`

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
      where: { ngoId: ngoId, status: {in: ["IN_PROGRESS", "PENDING"]} },
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

    if (!helpRequests) {
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
        title: true,
        description: true,
        hideName: true,
        hideFace: true,
        hideId: true,
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

export const ngoMarkAsResolved = async (req: Request, res: Response): Promise<void> => {
  const {requestId} = req.body;

  try {
    if (!requestId) {
      res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
      return;
    }

    const helpRequest = await prisma.helpRequest.findUnique({
      where: {id: requestId},
      include: {
        user: {select: {userId: true}},
        assignedNGO: {select: {userId: true}},
      }
    })

    if (!helpRequest) {
      res.status(404).json({
        success: false,
        message: "Help request not found",
      });
      return;
    }

    if(helpRequest.ngoResolved) {
      res.status(400).json({
        success: false,
        message: "Help request is already resolved by NGO",
      });
      return;
    }

    const updateData: any = {
      ngoResolved: true,
      status: "PENDING",
    }

    if(helpRequest.seekerResolved) {
      updateData.status = "RESOLVED";
      await deleteChatBetweenUsers(chatClient, helpRequest.user.userId, helpRequest.assignedNGO!.userId);
    }

    await prisma.helpRequest.update({
      where: {id: requestId},
      data: updateData,
    });

    redis.del(`cache:allActiveHelpRequestForNGO-${helpRequest.assignedNGO!.userId}`);
    redis.del(`cache:allHelpRequestForNGO-${helpRequest.assignedNGO!.userId}`);
    redis.del(`cache:allHelpRequests-${helpRequest.user.userId}`);
    redis.del(`cache:activeHelpRequestOfUser-${helpRequest.user.userId}`);

    res.status(200).json({
      success: true,
      message: updateData.status === "RESOLVED" ? "Help request marked as resolved" : "Marking as resolved from NGO side. Waiting for Help Seeker confirmation.",
    })
  } catch (error) {
    console.error("Error marking help request as resolved:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}