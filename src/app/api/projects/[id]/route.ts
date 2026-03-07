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

    // For many-to-many relationships in Prisma, to easily replace relations we can `set` them
    const tagsSet = data.tags?.map((t: string) => ({ id: t })) || [];
    const techStacksSet = data.techStacks?.map((t: string) => ({ id: t })) || [];

    const updatedProject = await prisma.project.update({
      where: { id },
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
        featured: data.featured,
        order: data.order,
        tags: { set: tagsSet },
        techStacks: { set: techStacksSet },
      },
      include: { tags: true, techStacks: true },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
