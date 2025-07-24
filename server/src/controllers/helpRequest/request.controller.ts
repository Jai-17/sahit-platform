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

export const getUserHelpRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requestId = req.params.id;

  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
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
  const userId = req.user?.userId;
  console.log("COMING FROM CONTROLLER USER ID", userId);
  const requestId = req.body.requestId;

  try {
    const roleId = await prisma.nGO.findUnique({
      where: { userId },
      select: { id: true },
    });

    const updatedRequest = await prisma.helpRequestNGOStatus.update({
      where: {
        helpRequestId_ngoId: {
          helpRequestId: requestId,
          ngoId: roleId?.id!,
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
            id: true
          }
        }
      }
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

    res.status(200).json({
      success: true,
      message: "Help Request Successfully assigned to NGO",
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
