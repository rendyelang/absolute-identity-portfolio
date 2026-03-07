import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const techStacks = await prisma.techStack.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(techStacks);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const newTechStack = await prisma.techStack.create({
      data: { name: data.name, iconUrl: data.iconUrl },
    });

    return NextResponse.json(newTechStack, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
