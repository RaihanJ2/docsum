import { NextResponse } from "next/server";

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

    const prompt = `You are a helpful assistant that creates clear, concise, and informative summaries of text documents.

Please summarize the following text. ${typeInstructions[summaryType]} ${lengthInstructions[summaryLength]}

Text to summarize:
${text}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens:
              summaryLength === "short"
                ? 300
                : summaryLength === "medium"
                ? 600
                : 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", errorData);
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (
      !result.candidates ||
      !result.candidates[0] ||
      !result.candidates[0].content
    ) {
      throw new Error("Invalid response from Gemini API");
    }

    const summary = result.candidates[0].content.parts[0].text;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      {
        error:
          "Failed to generate summary. Please check your API key and try again.",
      },
      { status: 500 }
    );
  }
}
