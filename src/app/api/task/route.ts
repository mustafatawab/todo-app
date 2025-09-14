import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")
  const prisma = new PrismaClient();
  
  if (!userId) {
    return NextResponse.json({ message: "UserId is required" }, { status: 400 });
  }

  const tasks = await prisma.tasks.findMany({
    where: { userId }
  });
  return NextResponse.json({ tasks }, { status: 200 });
}



export async function POST(request: NextRequest) {
  try {
    
    const prisma = new PrismaClient();
    const { title, description, userId } = await request.json();
    
    if (!title || !description || !userId) {
      return NextResponse.json(
        { message: "Title, Description and UserId are required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const newTask = await prisma.tasks.create({
      data: {
        userId,
        title,
        description,
      },
    });
    
    return NextResponse.json(
      { message: "Task created successfully", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({error})
  }
}



export async function PUT(request:NextRequest) {
  
  const prisma = new PrismaClient();
  const { id, title, description, completed } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
  }

  const task = await prisma.tasks.findUnique({
    where: { id },
  });
  
  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  



  const updatedTask = await prisma.tasks.update({
    where: { id },
    data: { title, description, completed },
  });



  return NextResponse.json(
    { message: "Task updated successfully", task: updatedTask },
    { status: 200 }
  );
}


export async function DELETE(request:NextRequest) {
  const prisma = new PrismaClient();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
  }

  const task = await prisma.tasks.findUnique({
    where: { id },
  });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  await prisma.tasks.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
}