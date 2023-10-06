import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function PUT(request, { params }) {
   const loggedInData = await checkLoggedIn();
   const id = parseInt(params.id);
   if (loggedInData.loggedIn && id) {
    const { value, done } = await request.json();
    console.log("finding", {id, done, value, ownerId: loggedInData.user.id});
    try {
      const todo = await prisma.toDo.update({
        where: {
          id, ownerId: loggedInData.user.id
        }, 
        data: {
          value, 
          done
        }
      });
      return NextResponse.json(todo);
    } catch {
      return NextResponse.json({error: 'record not found'}, {status: 401});
    }
   }
   return NextResponse.json({error: 'not signed in'}, {status: 403});
}

export async function COMPLETE(request, { params }) {
  const loggedInData = await checkLoggedIn();
  const id = +params.id;
  if (loggedInData.loggedIn && id) {
    const updatedTodo = await prisma.toDo.update({
      where: {
        id,
        ownerId: loggedInData.user?.id
      },
      data: {
        done: true
      }
    });

    return NextResponse.json({ updated: updatedTodo });
  }

  return NextResponse.json({ error: 'Not signed in or invalid ID' }, { status: 403 });
}
