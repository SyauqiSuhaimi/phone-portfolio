import { HfInference } from "@huggingface/inference";

let client: HfInference | null = null;

export function getHfClient(): HfInference {
  if (!process.env.HF_ACCESS_TOKEN) {
    throw new Error("HF_ACCESS_TOKEN is not set in the environment.");
  }

  if (!client) {
    client = new HfInference(process.env.HF_ACCESS_TOKEN);
  }

  return client;
}
