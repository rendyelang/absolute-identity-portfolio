import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const profile = await prisma.profile.findFirst();

    if (!profile) {
      const newProfile = await prisma.profile.create({
        data: {
          name: data.name,
          title: data.title,
          titleEn: data.titleEn || null,
          bio: data.bio,
          bioEn: data.bioEn || null,
          avatarUrl: data.avatarUrl,
          resumeUrl: data.resumeUrl,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
          email: data.email,
        },
      });
      return NextResponse.json(newProfile);
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        name: data.name,
        title: data.title,
        titleEn: data.titleEn || null,
        bio: data.bio,
        bioEn: data.bioEn || null,
        avatarUrl: data.avatarUrl,
        resumeUrl: data.resumeUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        email: data.email,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
