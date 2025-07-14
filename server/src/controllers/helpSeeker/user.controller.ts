import { Request, Response } from "express";
import { prisma } from "../../db";
import redis from "../../utils/redis";

export const getAllHelpSeekers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cacheKey = "HelpSeekers";

  try {
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("Returning from cache");
      res.json({
        success: true,
        message: "Found help seekers from REDIS",
        data: cached,
      });
      return;
    }

    const data = await prisma.helpSeeker.findMany({
      include: {
        user: {
          select: { isAdminApproved: true },
        },
      },
    });
    if (!data) {
      res
        .status(404)
        .json({ success: false, message: "No Help Seekers exists" });
      return;
    }

    await redis.set(cacheKey, data, { ex: 300 });

    res
      .status(200)
      .json({
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

  try {
    const helpSeeker = await prisma.helpSeeker.findUnique({
      where: { id: id },
      include: { user: { select: { isAdminApproved: true } } },
    });
    if (!helpSeeker) {
      res
        .status(404)
        .json({ success: false, message: "Help Seeker not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Help Seeker found", data: helpSeeker });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

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
    }

    if (!user?.isOnboarded) {
      res
        .status(402)
        .json({ success: false, message: "User is not onboarded yet" });
    }

    if (user?.isAdminApproved) {
      res
        .status(401)
        .json({ success: false, message: "User is already verified" });
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
