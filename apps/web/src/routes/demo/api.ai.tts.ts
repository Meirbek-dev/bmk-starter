import { generateSpeech } from "@tanstack/ai";
import { openaiSpeech } from "@tanstack/ai-openai";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/api/ai/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const {
          text,
          voice = "alloy",
          model = "tts-1",
          format = "mp3",
          speed = 1,
        } = body;

        if (!text || text.trim().length === 0) {
          return Response.json(
            {
              error: "Text is required",
            },
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        if (!process.env.OPENAI_API_KEY) {
          return Response.json(
            {
              error: "OPENAI_API_KEY is not configured",
            },
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        try {
          const adapter = openaiSpeech(model);

          const result = await generateSpeech({
            adapter,
            text,
            voice,
            format,
            speed,
          });

          return Response.json(
            {
              id: result.id,
              model: result.model,
              audio: result.audio,
              format: result.format,
              contentType: result.contentType,
              duration: result.duration,
            },
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          return Response.json(
            {
              error: error.message || "An error occurred",
            },
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
