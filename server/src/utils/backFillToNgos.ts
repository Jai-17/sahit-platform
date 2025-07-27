import { PrismaClient } from '@prisma/client';
import { qdrantVectorStore } from './qdrant';
import { config } from 'dotenv';
config();

const prisma = new PrismaClient();

export async function backfillNGOsToQdrant() {
    console.log("🔄 Fetching NGOs from database...");
  try {
    const ngos = await prisma.nGO.findMany();

    if (ngos.length === 0) {
      console.log("No NGOs found in DB to backfill.");
      return;
    }

    const documents = ngos.map((ngo) => ({
      pageContent: ngo.about || "",
      metadata: {
        id: ngo.id,
        name: ngo.name,
        supportTypes: ngo.supportTypes,
        city: ngo.city,
        state: ngo.state,
        address: ngo.address,
      },
    }));

    await qdrantVectorStore.addDocuments(documents);

    console.log(`✅ Successfully backfilled ${documents.length} NGOs to Qdrant.`);
  } catch (error) {
    console.error("❌ Error during backfill:", error);
  } finally {
    await prisma.$disconnect();
  }
}