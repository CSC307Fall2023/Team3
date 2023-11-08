import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";


export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const todos = await prisma.toDo.findMany({
      where: {
        userId: {
          equals: loggedInData.user?.id
        }
      }
    });
    return NextResponse.json(todos);
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}


export async function POST(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const { done, value } = await request.json();
    const todo = await prisma.toDo.create({
      data: {
        userId: loggedInData.user?.id,
        done,
        value
      }
    });
    return NextResponse.json(todo);
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}


export async function DELETE(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const index = await request.json();
    const deleteTodo = await prisma.toDo.delete({
      where: {
        id: {
          equals: index
        }
      }, 
    });
    return NextResponse.json(index);
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}


export async function PATCH(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const { idx, isDone } = await request.json();
    const updateTodo = await prisma.toDo.update({
      where: {
        id: idx
      }, 
      data: {
        done: isDone
      }, 
    });
    return NextResponse.json(isDone);
  }
  return NextResponse.json({error: 'not signed in'}, {status: 403});
}
