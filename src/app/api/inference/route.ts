import { NextResponse } from "next/server";
import { getHfClient } from "@/lib/huggingface";
import { getRagContext } from "@/lib/rag";

export const runtime = "nodejs";

const DEFAULT_MODEL =
  process.env.HF_MODEL ?? "deepseek-ai/DeepSeek-V3.2";
const DEFAULT_PROVIDER = process.env.HF_PROVIDER ?? "novita";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type InferencePayload = {
  prompt?: string;
  messages?: ChatMessage[];
  model?: string;
  provider?: string;
  maxNewTokens?: number;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  repetitionPenalty?: number;
};

const UNSUPPORTED_REPLY =
  "I can only answer questions related to my portfolio, projects, and experience.";

const getScopePrompt = (question: string) => [
  {
    role: "system" as const,
    content:
      "You are a strict classifier. Reply with only 'true' or 'false'.",
  },
  {
    role: "user" as const,
    content:
      "Question: \"" +
      question +
      "\"\nIs this about the person's portfolio, projects, skills, experience, contact, or hiring availability?",
  },
];

const parseBoolean = (value: string) =>
  value.trim().toLowerCase().startsWith("true");

export async function POST(request: Request) {
  let payload: InferencePayload | null = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    const client = getHfClient();
    const model =
      typeof payload?.model === "string" ? payload.model : DEFAULT_MODEL;
    const provider =
      typeof payload?.provider === "string"
        ? payload.provider
        : DEFAULT_PROVIDER;
    const temperature =
      typeof payload?.temperature === "number" ? payload.temperature : undefined;
    const topP =
      typeof payload?.topP === "number" ? payload.topP : undefined;
    const repetitionPenalty =
      typeof payload?.repetitionPenalty === "number"
        ? payload.repetitionPenalty
        : undefined;

    if (Array.isArray(payload?.messages) && payload.messages.length > 0) {
      const messages = payload.messages.filter(
        (message): message is ChatMessage =>
          message &&
          (message.role === "system" ||
            message.role === "user" ||
            message.role === "assistant") &&
          typeof message.content === "string"
      );

      if (messages.length === 0) {
        return NextResponse.json(
          { error: "messages_required" },
          { status: 400 }
        );
      }

      const lastUserMessage = [...messages]
        .reverse()
        .find((message) => message.role === "user");
      if (lastUserMessage) {
        const scopeCheck = await client.chatCompletion({
          model,
          messages: getScopePrompt(lastUserMessage.content),
          max_tokens: 5,
          temperature: 0,
        });
        const scopeText = scopeCheck.choices?.[0]?.message?.content ?? "false";
        if (!parseBoolean(scopeText)) {
          return NextResponse.json({
            text: UNSUPPORTED_REPLY,
            model,
          });
        }
      }

      const maxTokens =
        typeof payload.maxTokens === "number"
          ? payload.maxTokens
          : typeof payload.maxNewTokens === "number"
            ? payload.maxNewTokens
            : undefined;

      const context = await getRagContext(lastUserMessage.content);
      const contextMessage = context
        ? [
            {
              role: "system" as const,
              content:
                "Portfolio context:\n" +
                context +
                "\nUse this context to answer accurately.",
            },
          ]
        : [];

      const result = await client.chatCompletion({
        model,
        messages: [...contextMessage, ...messages],
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        repetition_penalty: repetitionPenalty,
        provider,
      });

      const content = result.choices?.[0]?.message?.content ?? "";

      return NextResponse.json({
        text: content,
        model,
      });
    }

    if (!payload?.prompt || typeof payload.prompt !== "string") {
      return NextResponse.json({ error: "prompt_required" }, { status: 400 });
    }

    const prompt = payload.prompt.trim();
    if (!prompt) {
      return NextResponse.json({ error: "prompt_required" }, { status: 400 });
    }

    const scopeCheck = await client.chatCompletion({
      model,
      messages: getScopePrompt(prompt),
      max_tokens: 5,
      temperature: 0,
    });
    const scopeText = scopeCheck.choices?.[0]?.message?.content ?? "false";
    if (!parseBoolean(scopeText)) {
      return NextResponse.json({
        text: UNSUPPORTED_REPLY,
        model,
      });
    }

    const parameters: Record<string, number> = {};

    const context = await getRagContext(prompt);
    const promptWithContext = context
      ? "Portfolio context:\n" + context + "\n\nQuestion:\n" + prompt
      : prompt;

    if (typeof payload.maxNewTokens === "number") {
      parameters.max_new_tokens = payload.maxNewTokens;
    }

    if (temperature !== undefined) {
      parameters.temperature = temperature;
    }

    if (topP !== undefined) {
      parameters.top_p = topP;
    }

    if (repetitionPenalty !== undefined) {
      parameters.repetition_penalty = repetitionPenalty;
    }

    const result = await client.textGeneration({
      model,
      inputs: promptWithContext,
      parameters: Object.keys(parameters).length ? parameters : undefined,
      provider,
    });

    return NextResponse.json({
      text: result.generated_text,
      model,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "inference_failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
