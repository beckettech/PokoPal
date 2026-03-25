import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, islandCode, images } = body;

    if (!title || !islandCode || !images || images.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // For now, log the submission (email sending would require an email service)
    // In production, you'd use Resend, SendGrid, or similar
    console.log("=== NEW ISLAND SUBMISSION ===");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Island Code:", islandCode);
    console.log("Images:", images.length, "attached");
    console.log("Review at: becketthoefling@gmail.com");
    console.log("=============================");

    // TODO: Send email to becketthoefling@gmail.com with approve/reject buttons
    // This would use an email service like Resend:
    // 
    // await resend.emails.send({
    //   from: "noreply@pokopia-guide.vercel.app",
    //   to: "becketthoefling@gmail.com",
    //   subject: `New Island Submission: ${title}`,
    //   html: `
    //     <h2>New Island Submission</h2>
    //     <p><strong>Title:</strong> ${title}</p>
    //     <p><strong>Code:</strong> ${islandCode}</p>
    //     <p><strong>Description:</strong> ${description}</p>
    //     ${images.map((img: string, i: number) => `<img src="${img}" alt="Screenshot ${i+1}" style="max-width:300px" />`).join('')}
    //     <hr />
    //     <a href="https://pokopia-guide.vercel.app/api/review-island?action=approve&code=${islandCode}">✅ Approve</a>
    //     <a href="https://pokopia-guide.vercel.app/api/review-island?action=reject&code=${islandCode}">❌ Reject</a>
    //   `
    // });

    return NextResponse.json({ success: true, message: "Submission received for review" });
  } catch (error) {
    console.error("Submit island error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
