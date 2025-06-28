import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "../../utils/mongodb";
import Summary from "../../models/Summary";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, originalText, summary, summaryType, summaryLength } =
      await request.json();

    if (!title || !originalText || !summary) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const wordCount = summary
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    const newSummary = new Summary({
      userId: session.user.id,
      title: title.substring(0, 200), // Ensure title doesn't exceed limit
      originalText,
      summary,
      summaryType: summaryType || "general",
      summaryLength: summaryLength || "medium",
      wordCount,
    });

    const savedSummary = await newSummary.save();

    return NextResponse.json({
      id: savedSummary._id,
      message: "Summary saved successfully",
    });
  } catch (error) {
    console.error("Error saving summary:", error);
    return NextResponse.json(
      { error: "Failed to save summary" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const summaries = await Summary.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to last 50 summaries
      .select("title summary summaryType summaryLength wordCount createdAt");

    return NextResponse.json({ summaries });
  } catch (error) {
    console.error("Error fetching summaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    );
  }
}
