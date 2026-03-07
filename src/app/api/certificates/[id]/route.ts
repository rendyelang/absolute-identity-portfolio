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

    const updatedCert = await prisma.certificate.update({
      where: { id },
      data: {
        title: data.title,
        titleEn: data.titleEn || null,
        issuer: data.issuer,
        date: data.date,
        description: data.description || null,
        descriptionEn: data.descriptionEn || null,
        imageUrl: data.imageUrl,
        credentialUrl: data.credentialUrl || null,
        order: data.order,
      },
    });

    return NextResponse.json(updatedCert);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.certificate.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
