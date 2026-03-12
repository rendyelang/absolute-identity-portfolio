import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const updatedActivity = await prisma.activity.update({
      where: { id },
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
        order: data.order,
      },
    });

    return NextResponse.json(updatedActivity);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.activity.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
