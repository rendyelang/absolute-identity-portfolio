import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    const newEducation = await prisma.education.create({
      data: {
        institution: data.institution,
        degree: data.degree,
        startDate: data.startDate,
        endDate: data.endDate || null,
        gpa: data.gpa || null,
        logoUrl: data.logoUrl || null,
        order: data.order || 0,
      },
    });

    return NextResponse.json(newEducation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
