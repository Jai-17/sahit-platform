import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
})

export const qdrantVectorStore = new QdrantVectorStore(embeddings, {
  url: 'http://localhost:6333',
  collectionName: "sahit",
});