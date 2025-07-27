import { Queue, Worker } from "bullmq";
import redis from "./redis";
import { prisma } from "../db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { embeddings, qdrantVectorStore } from "./qdrant";

export const queue = new Queue("matchRequest", {
  connection: redis,
});

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

const worker = new Worker(
  "matchRequest",
  async (job) => {
    console.log("From Worker", job.data);
    const helpRequestId = job.data.helpRequestId;

    const request = await prisma.helpRequest.findUnique({
      where: { id: helpRequestId },
      include: { user: { select: { state: true, city: true } } },
    });
    if (!request) {
      console.error("Error no helprequest found with this id", helpRequestId);
    }
    console.log("Found Request");
    console.log("Request", request);

    // Can Update Matching Logic
    // UPDATE MATCHING LOGIC HERE

    // =================================== LLM MATCHING LOGIC ===================================
    const helpType = request!.helpType;
    const helpLocation = `${request!.user?.city}, ${request!.user?.state}`;
    const queryText = `${request!.title || ""} - ${request!.description || ""}`;
    const queryVector = await embeddings.embedQuery(queryText);

    // CALLING VECTOR STORE
    const qdrantResults =
      await qdrantVectorStore.similaritySearchVectorWithScore(queryVector, 20);
    console.log("Qdrant Results", qdrantResults);

    const ngoInfoList = qdrantResults.map(([doc], i) => ({
      id: doc.metadata.id,
      name: doc.metadata.name,
      city: doc.metadata.city,
      state: doc.metadata.state,
      supportTypes: doc.metadata.supportTypes,
      about: doc.pageContent,
    }));

    const formattedPrompt = `
    A person in "${helpLocation}" needs help with "${helpType}". Their help request is:
    "${request!.description}"

    Here are some NGOs who may be able to help:

    ${ngoInfoList
      .map(
        (ngo, i) =>
          `${i + 1}. ${ngo.name} (ID: ${ngo.id}) in ${ngo.city}, ${ngo.state}
      Supports: [${ngo.supportTypes.join(", ")}]
      About: ${ngo.about}`
      )
      .join("\n\n")}

    Please return a JSON array of the 3 most relevant NGO IDs. 
    Pick NGOs that:
    - Match the help type: "${helpType}"
    - Are close to "${helpLocation}" (even nearby cities)
    - Are relevant based on their description

    Only return the JSON array of IDs. Example: ["abc123", "def456", "ghi789"]`;

    const response = await llm.invoke(formattedPrompt);

    console.log("LLM Response", response);
    let rawContent = (response.content as string).trim();
    if (rawContent.startsWith("```json")) {
      rawContent = rawContent
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    }

    console.log("Raw Content", rawContent);

    let matchingNGOs: string[] = [];
    try {
      matchingNGOs = JSON.parse(rawContent);
    } catch (err) {
      console.error("❌ Failed to parse LLM response:", response.content);
      matchingNGOs = [];
    }
    // const matchingNGOs = await prisma.nGO.findMany({
    //   where: {
    //     supportTypes: { has: request?.helpType },
    //     city: request?.user.city,
    //     state: request?.user.state,
    //   },
    //   orderBy: {
    //     rating: "desc",
    //   },
    //   take: 3,
    // });
    // console.log("Sending Mails to NGOs");

    // Send Mails to NGO

    if (matchingNGOs.length > 0) {
      await prisma.helpRequest.update({
        where: { id: request?.id },
        data: {
          ngoId: matchingNGOs[0],
          requestedNGOs: {
            connect: matchingNGOs.map((id) => ({ id })),
          },
          status: "SEND_TO_NGOS",
        },
      });

      await prisma.helpRequestNGOStatus.createMany({
        data: matchingNGOs.map((ngoId) => ({
          helpRequestId: request!.id,
          ngoId: ngoId,
          status: "PENDING",
        })),
      });
    } else {
      await prisma.helpRequest.update({
        where: { id: request?.id },
        data: {
          status: "DECLINED_BY_ALL",
        },
      });
    }

    console.log("DATA Updated in DB");
  },
  {
    concurrency: 100,
    connection: redis,
  }
);

worker.pause();
