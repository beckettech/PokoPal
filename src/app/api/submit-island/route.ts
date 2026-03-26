import { NextRequest, NextResponse } from "next/server";
import { cloudIslandsPosts } from "@/lib/pokemon-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, islandCode, images, author } = body;

    if (!title || !islandCode || !images || images.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!author || !author.startsWith("@")) {
      return NextResponse.json({ error: "Please provide your @handle" }, { status: 400 });
    }

    // Check for duplicate island code
    const existing = cloudIslandsPosts.find(
      (post) => post.islandCode.toUpperCase() === islandCode.toUpperCase()
    );

    if (existing) {
      return NextResponse.json(
        { error: `Island code ${islandCode} already exists (${existing.title})` },
        { status: 409 }
      );
    }

    console.log("=== NEW ISLAND SUBMISSION ===");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Island Code:", islandCode);
    console.log("Author:", author);
    console.log("Images:", images.length, "attached");
    console.log("Review at: becketthoefling@gmail.com");
    console.log("=============================");

    return NextResponse.json({ success: true, message: "Submission received for review" });
  } catch (error) {
    console.error("Submit island error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
