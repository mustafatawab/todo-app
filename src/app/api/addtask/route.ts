import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export async function POST(request: NextRequest) {
    const prisma = new PrismaClient();
  const { title, description, userId } = await request.json();

  if (!title || !description || !userId) {
    return NextResponse.json(
      { message: "Title, Description and UserId are required" },
      { status: 400 }
    );
  }


  

}