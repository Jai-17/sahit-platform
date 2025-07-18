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
        status: { notIn: ["DECLINED_BY_ALL", "DECLINED_BY_NGO", "RESOLVED"] },
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
        removeOnComplete: { age: 3600, count: 1000 },
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

    res
      .status(200)
      .json({
        success: true,
        message: "Help Request Found",
        data: helpRequest,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptRequestNGO = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId
  console.log('COMING FROM CONTROLLER USER ID', userId);
  const requestId = req.body.requestId;

  try {
    const roleId = await prisma.nGO.findUnique({where: {userId}, select: {id: true}})
  
    const updatedRequest = await prisma.helpRequestNGOStatus.update({
      where: {
        helpRequestId_ngoId: {
          helpRequestId: requestId,
          ngoId: roleId?.id!
        }
      },
      data: {
        status: "ACCEPTED",
      }
    });

    if(!updatedRequest) {
      res.status(404).json({success: false, message: "No help request exists"});
      return;
    }

    res.status(200).json({ success: true, message: "Request accepted by NGO", data: updatedRequest });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({success: false, message: "Internal Server Error"});
  }
}

export const getRequestAcceptByNGO = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  try {
    const helpRequests = await prisma.helpSeeker.findMany({where: {userId}, select: { helpRequests: {select: {id: true}} }})
    const helpRequestIds = helpRequests.flatMap((hs) =>
  hs.helpRequests.map((req) => req.id)
);
    console.log(helpRequestIds);
    const acceptedByNGOs = await prisma.helpRequestNGOStatus.findMany({
      where: {
        helpRequestId: {
          in: helpRequestIds
        },
        status: "ACCEPTED",
      },
      include: {
        ngo: true,
      },
    });

    if(!acceptedByNGOs) {
      res.status(404).json({success: false, message: "Data is missing or invalid"});
      return;
    }

    res.status(200).json({success: true, message: "Found NGOS", data: acceptedByNGOs});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptRequestUser = async (req: Request, res: Response): Promise<void> => {
  const ngoId = req.body.ngoId;
  const helpRequestId = req.body.requestId;

  try {
    // 1. Assign the ngo to HelpRequestTable and update status
    await prisma.helpRequest.update({
      where: {id: helpRequestId},
      data: {
        assignedNGO: {
          connect: {id: ngoId},
        },
        status: "IN_PROGRESS",
        requestedNGOs: {
          set: [{id: ngoId}],
        }
      }
    })

    // 2. Delete other ngo status
    await prisma.helpRequestNGOStatus.deleteMany({
      where: {
        helpRequestId,
      }
    })

    res.status(200).json({success: true, message: "Help Request Successfully assigned to NGO"})
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({success: false, message: "Internal Server Error"});
  }
}