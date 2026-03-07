import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    const newCert = await prisma.certificate.create({
      data: {
        title: data.title,
        titleEn: data.titleEn || null,
        issuer: data.issuer,
        date: data.date,
        description: data.description || null,
        descriptionEn: data.descriptionEn || null,
        imageUrl: data.imageUrl,
        credentialUrl: data.credentialUrl || null,
        order: data.order || 0,
      },
    });

    return NextResponse.json(newCert, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
