import { Request, Response } from "express";
import { prisma } from "../../db";

enum UserRole {
  NGO = "NGO",
  HELP_SEEKER = "HELP_SEEKER",
  ADMIN = "ADMIN",
}

export const createAward = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  const roleId = req.user?.roleId;
  // const userId = "04593350-fdf6-48c3-91d4-fec9379f0652";
  // const role = "HELP_SEEKER";
  // const roleId = "9af9c5f5-ea2a-42e9-80d3-d55c3c90f8de";
  const { workDone, reason } = req.body;

  if (!userId || !role || !roleId) {
    res.status(400).json({ error: "User ID, role, and role ID are required." });
    return;
  }

  if (!workDone || !reason) {
    res.status(400).json({ error: "Work done and reason are required." });
    return;
  }

  try {
    const awardExists = await prisma.awards.findFirst({
      where: {
        userId,
        roleId,
        role,
      },
    });

    if (awardExists) {
      res.status(400).json({
        success: false,
        message: "Award already submitted for this user and role.",
      });
      return;
    }

    await prisma.awards.create({
      data: {
        userId,
        roleId,
        role,
        workDone,
        reason,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Award created successfully." });
  } catch (error) {
    console.error("Error creating award:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getAwardsByRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const role = req.params.role;

  try {
    let awards;
    if (role == "HELP_SEEKER") {
      awards = await prisma.awards.findMany({
        where: { role: { in: [UserRole.HELP_SEEKER] } },
      });
    } else if (role == "NGO") {
      awards = await prisma.awards.findMany({
        where: { role: { in: [UserRole.NGO] } },
      });
    }

    if(!awards) {
        res.status(404).json({success: false, message: "No awards found for this role." });
        return;
    }

    res.status(200).json({ success: true, messages: "Found Awards List", data: awards });
  } catch (error) {
    console.error("Error fetching awards by role:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getAwardDetailsById = async (req: Request, res: Response): Promise<void> => {
  const awardId = req.params.id;

  try {
    const award = await prisma.awards.findUnique({
      where: { id: awardId },
    });

    if (!award) {
      res.status(404).json({ success: false, message: "Award not found." });
      return;
    }

    res.status(200).json({ success: true, data: award });
  } catch (error) {
    console.error("Error fetching award details:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

export const changeAwardStatus = async (req: Request, res: Response): Promise<void> => {
  const {awardId, status} = req.body;

  try {
    await prisma.awards.update({
      where: {id: awardId},
      data: {status}
    })

    res.status(200).json({ success: true, message: "Award status updated successfully." });
  } catch (error) {
    console.error("Error changing award status:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}