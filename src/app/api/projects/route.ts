import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: {
        tags: true,
        techStacks: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Connect tags and techStacks if provided
    const tagsConnect = data.tags?.map((t: string) => ({ id: t })) || [];
    const techStacksConnect = data.techStacks?.map((t: string) => ({ id: t })) || [];

    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        titleEn: data.titleEn || null,
        description: data.description,
        descriptionEn: data.descriptionEn || null,
        longDesc: data.longDesc,
        longDescEn: data.longDescEn || null,
        imageUrl: data.imageUrl,
        liveUrl: data.liveUrl,
        repoUrl: data.repoUrl,
        featured: data.featured || false,
        order: data.order || 0,
        tags: { connect: tagsConnect },
        techStacks: { connect: techStacksConnect },
      },
      include: {
        tags: true,
        techStacks: true,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
