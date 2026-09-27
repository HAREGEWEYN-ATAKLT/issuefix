import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;

    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      include: {
        bobRuns: true,
        findings: {
          include: {
            evidences: true,
            verification: true,
            decision: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Failed to load review:", error);

    return NextResponse.json(
      { error: "Failed to load review" },
      { status: 500 }
    );
  }
}