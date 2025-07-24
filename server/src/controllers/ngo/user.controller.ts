import { Request, Response } from "express";
import redis from "../../utils/redis";
import { prisma } from "../../db";

export const getAllNgos = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cacheKey = "cache:AllNGOs";

  try {
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("Returning from cache");
      res.json({
        success: true,
        message: "Found NGOs from REDIS",
        data: JSON.parse(cached),
      });
      return;
    }

    const data = await prisma.nGO.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            isAdminApproved: true,
          },
        },
      },
    });

    if (!data || data.length === 0) {
      res.status(404).json({ success: false, message: "No NGOs found" });
      return;
    }

    const ngosWithResolvedCount = await Promise.all(
      data.map(async (ngo) => {
        const resolvedCount = await prisma.helpRequest.count({
          where: {
            ngoId: ngo.id,
            status: "RESOLVED",
          },
        });

        return {
          ...ngo,
          resolvedHelpRequestCount: resolvedCount,
        };
      })
    );

    // Cache the correct data with resolved counts
    await redis.set(cacheKey, JSON.stringify(ngosWithResolvedCount), "EX", 300);

    res.status(200).json({
      success: true,
      message: "Found NGOs from DB",
      data: ngosWithResolvedCount,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const registerNGO = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userIdFromToken = req.user?.userId;
  const emailFromToken = req.user?.email;
  const nameFromToken = req.user?.userName;
  const isVerifiedFromToken = req.user?.isVerified;
  const userRoleFromToken = req.user?.role;

  const {
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
    verifiedDocs,
  } = req.body;

  try {
    if (!isVerifiedFromToken || userRoleFromToken !== "NGO") {
      res
        .status(403)
        .json({ success: false, message: "Please verify your account first" });
      return;
    }

    if (!emailFromToken || !userIdFromToken) {
      res.status(400).json({ success: false, message: "User Data not found" });
      return;
    }

    const existingNGO = await prisma.nGO.findUnique({
      where: { userId: userIdFromToken },
    });

    if (existingNGO) {
      res
        .status(400)
        .json({ success: false, message: "NGO already registered" });
      return;
    }

    const ngo = await prisma.nGO.create({
      data: {
        userId: userIdFromToken,
        email: emailFromToken,
        name: nameFromToken,
        replyTimeMins: parseInt(replyTimeMins),
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
        verifiedDocs,
      },
    });

    const user = await prisma.user.update({
      where: { email: emailFromToken },
      data: { isOnboarded: true },
    });

    res.status(200).json({
      success: true,
      message: "NGO Registered Successfully",
      data: ngo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getNGOById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;

  try {
    const ngo = await prisma.nGO.findUnique({
      where: { id: id },
      select: {
        name: true,
        replyTimeMins: true,
        supportTypes: true,
        address: true,
        city: true,
        about: true,
        state: true,
        rating: true,
        createdAt: true,
        email: true,
        phone: true,
        whatsappNumber: true,
        whatsappSame: true,
        representativeAvailability: true,
        representativeName: true,
        representativeTitle: true,
        verifiedDocs: true,
        user: {
          select: {
            isAdminApproved: true,
            name: true,
          },
        },
      },
    });
    if (!ngo) {
      res.status(404).json({ success: false, message: "NGO not found" });
      return;
    }

    res.status(200).json({ success: true, message: "NGO found", data: ngo });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const approveNGO = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.body.userId;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log(req.body);
    console.log(user);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user?.isOnboarded) {
      res
        .status(402)
        .json({ success: false, message: "User is not onboarded yet" });
      return;
    }

    if (user?.isAdminApproved) {
      res
        .status(401)
        .json({ success: false, message: "User is already verified" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdminApproved: true },
    });
    res.status(200).json({
      success: true,
      message: "User Admin Approved Successfully",
      data: updatedUser.isAdminApproved,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const ngoDashboardStat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ngoId = req.user.roleId;
  const cacheKey = `cache:ngoStatFor-${ngoId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Returning from cache");
      res.json(JSON.parse(cached));
      return;
    }

    const activeRequests = await prisma.helpRequest.count({
      where: {
        ngoId: ngoId as string,
        status: "IN_PROGRESS",
      },
    });

    const newRequests = await prisma.helpRequestNGOStatus.count({
      where: {
        ngoId: ngoId as string,
      },
    });

    const totalHelped = await prisma.helpRequest.count({
      where: {
        ngoId: ngoId as string,
        status: "RESOLVED",
      },
    });

    await redis.set(
      cacheKey,
      JSON.stringify({ activeRequests, newRequests, totalHelped }),
      "EX",
      1200
    );

    res.json({
      activeRequests,
      newRequests,
      totalHelped,
    });
  } catch (error) {
    console.error("Error fetching NGO dashboard stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
