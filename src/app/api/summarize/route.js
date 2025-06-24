import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { text, summaryType, summaryLength } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const lengthInstructions = {
      short: "Keep it concise, 1-2 paragraphs maximum.",
      medium: "Provide a moderate summary, 3-4 paragraphs.",
      long: "Create a detailed summary, 5 or more paragraphs.",
    };

    const typeInstructions = {
      general: "Provide a comprehensive general summary.",
      bullets: "Format the summary as clear bullet points.",
      tldr: "Create a TL;DR (Too Long; Didn't Read) summary.",
      "key-points": "Extract and list the key points.",
      executive: "Write an executive summary suitable for business contexts.",
    };

    const prompt = `Please summarize the following text. ${typeInstructions[summaryType]} ${lengthInstructions[summaryLength]}

Text to summarize:
${text}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates clear, concise, and informative summaries of text documents.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens:
        summaryLength === "short"
          ? 300
          : summaryLength === "medium"
          ? 600
          : 1000,
      temperature: 0.3,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
