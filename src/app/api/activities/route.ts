import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const newActivity = await prisma.activity.create({
      data: {
        title: data.title,
        titleEn: data.titleEn || null,
        organizer: data.organizer,
        type: data.type,
        logoUrl: data.logoUrl || null,
        date: data.date,
        endDate: data.endDate || null,
        achievement: data.achievement || null,
        achievementEn: data.achievementEn || null,
        description: data.description,
        descriptionEn: data.descriptionEn || null,
        certificateUrl: data.certificateUrl || null,
        order: data.order || 0,
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
