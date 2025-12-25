import fs from "fs/promises";
import path from "path";
import type { FeatureExtractionOutput } from "@huggingface/inference";
import { getHfClient } from "@/lib/huggingface";

type Chunk = {
  id: string;
  text: string;
  embedding: number[];
};

const DEFAULT_EMBEDDING_MODEL =
  process.env.HF_EMBEDDING_MODEL ?? "sentence-transformers/all-MiniLM-L6-v2";
const PORTFOLIO_PATH = path.join(process.cwd(), "data", "portfolio.md");
const PROJECTS_PATH = path.join(process.cwd(), "data", "projects.json");
const SKILLS_PATH = path.join(process.cwd(), "data", "skills.json");
const WORK_EXPERIENCE_PATH = path.join(
  process.cwd(),
  "data",
  "work-experience.json"
);
const CONTACTS_PATH = path.join(process.cwd(), "data", "contacts.json");
const MAX_CHUNK_CHARS = 600;
const TOP_K = 3;

let cachedChunks: Chunk[] | null = null;

const chunkText = (input: string) => {
  const rawBlocks = input
    .split(/\n{2,}/g)
    .map((block) => block.trim())
    .filter(Boolean);

  const chunks: string[] = [];

  for (const block of rawBlocks) {
    if (block.length <= MAX_CHUNK_CHARS) {
      chunks.push(block);
      continue;
    }

    let cursor = 0;
    while (cursor < block.length) {
      chunks.push(block.slice(cursor, cursor + MAX_CHUNK_CHARS));
      cursor += MAX_CHUNK_CHARS;
    }
  }

  return chunks;
};

const normalizeEmbedding = (output: FeatureExtractionOutput) => {
  if (output.length === 0) {
    return [];
  }

  const first = output[0];
  if (Array.isArray(first)) {
    const second = first[0];
    if (Array.isArray(second)) {
      return second as number[];
    }
    return first as number[];
  }

  return output as number[];
};

const cosineSimilarity = (a: number[], b: number[]) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const buildChunks = async (): Promise<Chunk[]> => {
  const markdown = await fs.readFile(PORTFOLIO_PATH, "utf-8");
  let projectsSection = "";
  let skillsSection = "";
  let workSection = "";
  let contactsSection = "";

  try {
    const projectData = await fs.readFile(PROJECTS_PATH, "utf-8");
    const parsed = JSON.parse(projectData);
    if (Array.isArray(parsed)) {
      const lines = parsed
        .map((project) => {
          if (!project || typeof project !== "object") {
            return null;
          }
          const title = "title" in project ? String(project.title) : "";
          const description =
            "description" in project ? String(project.description) : "";
          const link = "link" in project ? String(project.link) : "";
          const tech = Array.isArray((project as { tech?: unknown }).tech)
            ? (project as { tech: unknown[] }).tech.map(String).join(", ")
            : "";

          if (!title && !description) {
            return null;
          }

          const parts = [
            title && `Title: ${title}`,
            description && `Description: ${description}`,
            tech && `Tech: ${tech}`,
            link && `Link: ${link}`,
          ].filter(Boolean);

          return parts.join("\n");
        })
        .filter(Boolean);

      if (lines.length) {
        projectsSection =
          "Projects (data/projects.json):\n" + lines.join("\n\n");
      }
    }
  } catch {
    projectsSection = "";
  }

  try {
    const skillsData = await fs.readFile(SKILLS_PATH, "utf-8");
    const parsed = JSON.parse(skillsData);
    if (Array.isArray(parsed)) {
      const names = parsed
        .map((skill) => {
          if (!skill || typeof skill !== "object") {
            return null;
          }
          return "name" in skill ? String(skill.name) : null;
        })
        .filter(Boolean);

      if (names.length) {
        skillsSection = `Skills (data/skills.json):\n${names.join(", ")}`;
      }
    }
  } catch {
    skillsSection = "";
  }

  try {
    const workData = await fs.readFile(WORK_EXPERIENCE_PATH, "utf-8");
    const parsed = JSON.parse(workData);
    if (Array.isArray(parsed)) {
      const lines = parsed
        .map((job) => {
          if (!job || typeof job !== "object") {
            return null;
          }
          const company = "company" in job ? String(job.company) : "";
          const position = "position" in job ? String(job.position) : "";
          const year = "year" in job ? String(job.year) : "";
          const jd = Array.isArray((job as { jd?: unknown }).jd)
            ? (job as { jd: unknown[] }).jd.map(String).join(" ")
            : "";
          const tech = Array.isArray((job as { tech?: unknown }).tech)
            ? (job as { tech: unknown[] }).tech.map(String).join(", ")
            : "";

          if (!company && !position) {
            return null;
          }

          const parts = [
            company && `Company: ${company}`,
            position && `Role: ${position}`,
            year && `Dates: ${year}`,
            jd && `Details: ${jd}`,
            tech && `Tech: ${tech}`,
          ].filter(Boolean);

          return parts.join("\n");
        })
        .filter(Boolean);

      if (lines.length) {
        workSection =
          "Work Experience (data/work-experience.json):\n" +
          lines.join("\n\n");
      }
    }
  } catch {
    workSection = "";
  }

  try {
    const contactsData = await fs.readFile(CONTACTS_PATH, "utf-8");
    const parsed = JSON.parse(contactsData);
    if (Array.isArray(parsed)) {
      const lines = parsed
        .map((contact) => {
          if (!contact || typeof contact !== "object") {
            return null;
          }
          const link = "link" in contact ? String(contact.link) : "";
          const tooltip = "tooltip" in contact ? String(contact.tooltip) : "";

          if (!link) {
            return null;
          }

          return tooltip ? `${tooltip}: ${link}` : link;
        })
        .filter(Boolean);

      if (lines.length) {
        contactsSection =
          "Contact Links (data/contacts.json):\n" + lines.join("\n");
      }
    }
  } catch {
    contactsSection = "";
  }

  const combinedParts = [
    markdown,
    projectsSection,
    skillsSection,
    workSection,
    contactsSection,
  ].filter(Boolean);
  const combined = combinedParts.join("\n\n");
  const rawChunks = chunkText(combined);
  const client = getHfClient();

  const chunks: Chunk[] = [];
  for (let i = 0; i < rawChunks.length; i += 1) {
    const text = rawChunks[i];
    const embedding = await client.featureExtraction({
      model: DEFAULT_EMBEDDING_MODEL,
      inputs: text,
    });

    chunks.push({
      id: `chunk-${i + 1}`,
      text,
      embedding: normalizeEmbedding(embedding),
    });
  }

  return chunks;
};

export const getRagContext = async (query: string) => {
  try {
    if (!cachedChunks) {
      cachedChunks = await buildChunks();
    }

    const client = getHfClient();
    const queryEmbedding = await client.featureExtraction({
      model: DEFAULT_EMBEDDING_MODEL,
      inputs: query,
    });
    const normalizedQuery = normalizeEmbedding(queryEmbedding);

    const ranked = cachedChunks
      .map((chunk) => ({
        chunk,
        score: cosineSimilarity(normalizedQuery, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K)
      .map((entry) => entry.chunk.text);

    if (ranked.length === 0) {
      return "";
    }

    return ranked.join("\n\n");
  } catch {
    return "";
  }
};
