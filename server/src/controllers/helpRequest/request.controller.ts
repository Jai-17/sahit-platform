import { Request, Response } from "express";
import { prisma } from "../../db";
import { queue } from "../../utils/worker";
import redis from "../../utils/redis";

export const createRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Made by a verified user with access token
  // const userId = req.body.userId
  const userId = req.user.roleId;
  const actualUserId = req.user?.userId;
  const cacheKey = `cache:allHelpRequests-${userId}`;
  const cacheKeyAcceptedNGO = `cache:requestAcceptedByNGOForUser-${actualUserId}`;

  // HELP TYPE, URGENCY, STATUS ARE ENUMS
  const {
    helpType,
    title,
    description,
    attachments,
    hideId,
    hideFace,
    hideName,
    urgency,
  } = req.body;

  console.log("REQ BODY", req.body);

  try {
    const helpSeeker = await prisma.helpSeeker.findUnique({
      where: { id: userId },
    });
    if (!helpSeeker) {
      res
        .status(404)
        .json({ success: false, message: "Help Seeker with the ID not found" });
      return;
    }

    console.log("HELP SEEKER", helpSeeker);

    console.log("BEFORE ALREADY EXISTING REQUEST");

    const alreadyExistingRequest = await prisma.helpRequest.findFirst({
      where: {
        userId,
        status: {
          in: ["ACCEPTED_BY_NGO", "IN_PROGRESS", "SEND_TO_NGOS", "PENDING"],
        },
      },
    });

    if (alreadyExistingRequest) {
      res
        .status(501)
        .json({ success: false, message: "A request already exists" });
      return;
    }

    const similar = await prisma.helpRequest.findFirst({
      where: {
        userId,
        title,
        description,
        status: { notIn: ["DECLINED_BY_ALL", "DECLINED_BY_NGO", "RESOLVED"] },
      },
    });

    if (similar) {
      res
        .status(501)
        .json({ success: false, message: "Similar Request already exists" });
      return;
    }

    console.log("HELP REQUEST BEFORE", {
      userId,
      helpType,
      title,
      description,
      attachments,
      hideId,
      hideFace,
      hideName,
      urgency,
    });

    const helpRequest = await prisma.helpRequest.create({
      data: {
        userId,
        helpType,
        title,
        description,
        attachments,
        hideId,
        hideFace,
        hideName,
        urgency,
      },
    });

    console.log("HELP REQUEST", helpRequest);

    // await pushHelpRequests(helpRequest.id);
    await queue.add(
      "help-request",
      { helpRequestId: helpRequest.id },
      {
        removeOnComplete: { age: 3600, count: 1000 },
        removeOnFail: { age: 86400 },
      }
    );
    await redis.del(cacheKey);
    await redis.del(cacheKeyAcceptedNGO);

    res.status(200).json({
      success: true,
      message: "Help Request created successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Interal Server Error" });
  }
};

export const deleteRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requestId = req.params.requestId;
  const userId = req.user.roleId;
  console.log("USER ID", userId);
  console.log("REQUEST ID", requestId);
  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
    });

    if (!helpRequest) {
      res
        .status(404)
        .json({ success: false, message: "Help Request not found" });
      return;
    }

    if (helpRequest.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this request",
      });
      return;
    }

    await prisma.helpRequest.delete({
      where: { id: requestId },
    });

    redis.del(`cache:allHelpRequests-${userId}`);

    res.status(200).json({
      success: true,
      message: "Help Request deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getUserHelpRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requestId = req.params.id;
  const ngoId = req.query.ngoId as string;
  console.log("NGO ID", ngoId);
  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      include: {
        user: true,
        helpRequestNGOStatuses: {
          where: { ngoId },
          select: {
            status: true,
          },
        },
      },
    });
    if (!helpRequest) {
      res
        .status(404)
        .json({ success: false, message: "No help request exists" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Help Request Found",
      data: helpRequest,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptRequestNGO = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.roleId;
  console.log("COMING FROM CONTROLLER USER ID", userId);
  const requestId = req.body.requestId;

  try {
    const updatedRequest = await prisma.helpRequestNGOStatus.update({
      where: {
        helpRequestId_ngoId: {
          helpRequestId: requestId,
          ngoId: userId,
        },
      },
      data: {
        status: "ACCEPTED",
      },
    });

    if (!updatedRequest) {
      res
        .status(404)
        .json({ success: false, message: "No help request exists" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Request accepted by NGO",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const declineRequestNGO = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ngoId = req.user?.roleId;
  // const ngoId = "994edff7-8754-4d78-9f1d-0c595c0c4fa2";
  const helpRequestId = req.body.requestId;

  try {
    // 1.
    await prisma.helpRequestNGOStatus.deleteMany({
      where: {
        helpRequestId,
        ngoId,
      },
    });

    // 2.
    const remaining = await prisma.helpRequestNGOStatus.count({
      where: {
        helpRequestId,
      },
    });

    // 3.
    if (remaining === 0) {
      await prisma.helpRequest.update({
        where: { id: helpRequestId },
        data: {
          status: "DECLINED_BY_ALL",
        },
      });
    }

    redis.del(`cache:incomingRequests-${ngoId}`);

    res.status(200).json({
      success: true,
      message: "Request declined by NGO",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getRequestAcceptByNGO = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  const cacheKey = `cache:requestAcceptedByNGOForUser-${userId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Returning from cache");
      res.json({
        success: true,
        message: "Found Accepted Help Request from REDIS",
        data: JSON.parse(cached),
      });
      return;
    }

    const helpRequests = await prisma.helpSeeker.findMany({
      where: { userId },
      select: { helpRequests: { select: { id: true } } },
    });
    const helpRequestIds = helpRequests.flatMap((hs) =>
      hs.helpRequests.map((req) => req.id)
    );
    console.log(helpRequestIds);
    const acceptedByNGOs = await prisma.helpRequestNGOStatus.findMany({
      where: {
        helpRequestId: {
          in: helpRequestIds,
        },
        status: "ACCEPTED",
      },
      select: {
        updatedAt: true,
        helpRequestId: true,
        ngo: {
          select: {
            name: true,
            about: true,
            rating: true,
            replyTimeMins: true,
            supportTypes: true,
            id: true,
          },
        },
      },
    });

    if (!acceptedByNGOs) {
      res
        .status(404)
        .json({ success: false, message: "Data is missing or invalid" });
      return;
    }

    await redis.set(cacheKey, JSON.stringify(acceptedByNGOs), "EX", 1200);

    res
      .status(200)
      .json({ success: true, message: "Found NGOS", data: acceptedByNGOs });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptRequestUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ngoId = req.body.ngoId;
  const helpRequestId = req.body.requestId;
  const roleId = req.user.roleId;
  try {
    // 1. Assign the ngo to HelpRequestTable and update status
    await prisma.helpRequest.update({
      where: { id: helpRequestId },
      data: {
        assignedNGO: {
          connect: { id: ngoId },
        },
        status: "IN_PROGRESS",
        requestedNGOs: {
          set: [{ id: ngoId }],
        },
      },
    });

    // 2. Delete other ngo status
    await prisma.helpRequestNGOStatus.deleteMany({
      where: {
        helpRequestId,
      },
    });

    redis.del(`cache:allActiveHelpRequestForNGO-${ngoId}`);
    redis.del(`cache:incomingRequests-${ngoId}`);
    redis.del(`cache:activeHelpRequestOfUser-${roleId}`);
    redis.del(`cache:allHelpRequests-${roleId}`);
    redis.del(`cache:requestAcceptedByNGOForUser-${roleId}`);
    
    res.status(200).json({
      success: true,
      message: "Help Request Successfully assigned to NGO",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const declineRequestUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ngoId = req.body.ngoId;
  const helpRequestId = req.body.requestId;

  try {
    // 1. Delete this NGO's status entry for the help request
    await prisma.helpRequestNGOStatus.deleteMany({
      where: {
        helpRequestId,
        ngoId,
      },
    });

    // 2. Check if any other NGOs are left assigned to this help request
    const remainingNGOs = await prisma.helpRequestNGOStatus.count({
      where: {
        helpRequestId,
      },
    });

    // 3. If no NGOs are left, mark the help request as DECLINED_BY_ALL
    if (remainingNGOs === 0) {
      await prisma.helpRequest.update({
        where: { id: helpRequestId },
        data: {
          status: "DECLINED_BY_ALL",
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "NGO has declined the request successfully.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAdminStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cacheKey = "cache:adminStats";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Returning from cache");
      res.json(JSON.parse(cached));
      return;
    }

    const [
      activeNGOsCount,
      activeRequestsCount,
      totalHelpedCount,
      inactiveNGOsCount,
      totalHelpSeekersCount,
      ongoingRequestsCount,
      totalRequestsCount,
      pendingNGORequestsCount,
    ] = await Promise.all([
      prisma.nGO.count({
        where: {
          helpRequests: {
            some: {},
          },
        },
      }),

      prisma.helpRequest.count({
        where: {
          ngoId: { not: null },
          status: "IN_PROGRESS",
        },
      }),

      prisma.helpRequest.count({
        where: {
          status: "RESOLVED",
        },
      }),

      prisma.nGO.count({
        where: {
          OR: [
            { helpRequests: { none: {} } },
            {
              helpRequests: {
                none: {
                  status: "IN_PROGRESS",
                },
              },
            },
          ],
        },
      }),

      prisma.helpSeeker.count(),

      prisma.helpRequest.count({
        where: {
          status: "IN_PROGRESS",
        },
      }),

      prisma.helpRequest.count(),

      prisma.helpRequestNGOStatus.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

    await redis.set(
      cacheKey,
      JSON.stringify({
        activeNGOsCount,
        activeRequestsCount,
        totalHelpedCount,
        inactiveNGOsCount,
        totalHelpSeekersCount,
        ongoingRequestsCount,
        totalRequestsCount,
        pendingNGORequestsCount,
      }),
      "EX",
      1200
    );

    res.status(200).json({
      activeNGOsCount,
      activeRequestsCount,
      totalHelpedCount,
      inactiveNGOsCount,
      totalHelpSeekersCount,
      ongoingRequestsCount,
      totalRequestsCount,
      pendingNGORequestsCount,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
