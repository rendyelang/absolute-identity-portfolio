import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const newTag = await prisma.tag.create({
      data: { name: data.name, color: data.color },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
