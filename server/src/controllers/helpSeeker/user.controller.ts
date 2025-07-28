import { Request, Response } from "express";
import { prisma } from "../../db";
import redis from "../../utils/redis";

export const getAllHelpSeekers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cacheKey = "cache:HelpSeekers";

  try {
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("Returning from cache");
      res.json({
        success: true,
        message: "Found help seekers from REDIS",
        data: JSON.parse(cached),
      });
      return;
    }

    const data = await prisma.helpSeeker.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        createdAt: true,
        _count: {
          select: {
            helpRequests: true,
          }
        },
        helpRequests: {
          orderBy: { submittedAt: "desc" },
          take: 1,
          select: {
            status: true,
          },
        },
        user: {
          select: {
            isAdminApproved: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    if (!data) {
      res
        .status(404)
        .json({ success: false, message: "No Help Seekers exists" });
      return;
    }

    await redis.set(cacheKey, JSON.stringify(data), "EX", 300);

    res.status(200).json({
      success: true,
      message: "Found help seekers from DB",
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getHelpSeekerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  const detailLevel = req.query.detail;

  console.log("Detail Level:", detailLevel, detailLevel === "basic");

  try {
    let helpSeeker;

    if (detailLevel === "basic") {
      helpSeeker = await prisma.helpSeeker.findUnique({
        where: { id },
        select: {
          name: true,
          occupation: true,
          state: true,
          city: true,
          address: true,
          company: true,
          jobType: true,
          age: true,
          contact: true,
          whatsapp: true,
          alias: true,
          idProofs: true,
          user: {
            select: {
              isAdminApproved: true,
            },
          },
        },
      });
    } else {
      helpSeeker = await prisma.helpSeeker.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              isAdminApproved: true,
            },
          },
          helpRequests: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              submittedAt: true,
            },
            orderBy: { submittedAt: "desc" },
            take: 1,
          },
        },
      });
    }

    if (!helpSeeker) {
      res
        .status(404)
        .json({ success: false, message: "Help Seeker not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Help Seeker found",
      data: helpSeeker,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// OVERALL ADMIN APPROVE
export const approveHelpSeeker = async (
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