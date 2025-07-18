import { Queue, Worker } from "bullmq";
import redis from "./redis";
import { prisma } from "../db";

export const queue = new Queue("matchRequest", {
    connection: redis
})

const worker = new Worker('matchRequest', async job => {
    console.log("From Worker", job.data);
    const helpRequestId = job.data.helpRequestId;

    const request = await prisma.helpRequest.findUnique({where: {id: helpRequestId}});
    if(!request) {
        console.error("Error no helprequest found with this id", helpRequestId);
    }
    console.log("Found Request");

    const requestingUser = await prisma.helpSeeker.findUnique({where: {id: request?.userId}, select: {city: true, state: true}})

    // Can Update Matching Logic
    const matchingNGOs = await prisma.nGO.findMany({
        where: {
            supportTypes: {has: request?.helpType},
            city: requestingUser?.city,
            state: requestingUser?.state,
        },
        orderBy: {
            rating: 'desc',
        },
        take: 3
    })
    console.log("Sending Mails to NGOs");

    // Send Mails to NGO
    
    if(matchingNGOs.length > 0) {
        await prisma.helpRequest.update({
            where: {id: request?.id},
            data: {
                ngoId: matchingNGOs[0].id,
                requestedNGOs: {
                    connect: matchingNGOs.map(ngo => ({id: ngo.id}))
                },
                status: "SEND_TO_NGOS",
            }
        })

        await prisma.helpRequestNGOStatus.createMany({
            data: matchingNGOs.map(ngo => ({
                helpRequestId: request!.id,
                ngoId: ngo.id,
                status: 'PENDING'
            }))
        })
    } else {
        await prisma.helpRequest.update({
            where: {id: request?.id},
            data: {
                status: "DECLINED_BY_ALL",
            }
        })
    }

    console.log("DATA Updated in DB");
}, {
    concurrency: 100, connection: redis
})

worker.pause();