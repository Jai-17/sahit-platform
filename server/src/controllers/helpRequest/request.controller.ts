import { Request, Response } from "express";
import { prisma } from "../../db";
import { queue } from "../../utils/worker";

export const createRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Made by a verified user with access token
  // const userId = req.body.userId
  const userId = "9af9c5f5-ea2a-42e9-80d3-d55c3c90f8de";

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

    const similar = await prisma.helpRequest.findFirst({
      where: {
        userId,
        title,
        description,
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
    });

    if (similar) {
      res
        .status(501)
        .json({ success: false, message: "Similar Request already exists" });
      return;
    }

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

    // await pushHelpRequests(helpRequest.id);
    await queue.add(
      "help-request",
      { helpRequestId: helpRequest.id },
      {
        removeOnComplete: {age: 3600, count: 1000},
        removeOnFail: { age: 86400 },
      }
    );

    res.status(200).json({
      success: true,
      message: "Help Request created successfully",
      data: helpRequest,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Interal Server Error" });
  }
};
