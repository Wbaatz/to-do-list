import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/lib/models/Todo';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: Request) {
  await dbConnect();
  const token = await getToken({ req: req as any, secret });

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized, GET' }, { status: 401 });
  }

  const todos = await Todo.find({ user: token.sub });
  return NextResponse.json({ success: true, data: todos });
}

export async function POST(req: Request) {
  await dbConnect();
  const token = await getToken({ req: req as any, secret });

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized, POST' }, { status: 401 });
  }

  const body = await req.json();
  const todo = await Todo.create({
    text: body.text,
    completed: false,
    user: token.sub,
  });

  return NextResponse.json({ success: true, data: todo }, { status: 201 });
}

export async function PUT(req: Request) {
  await dbConnect();
  const token = await getToken({ req: req as any, secret });

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized, PUT' }, { status: 401 });
  }

  const { id, completed } = await req.json();
  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: token.sub },
    { completed },
    { new: true }
  );

  return NextResponse.json({ success: true, data: todo });
}

export async function DELETE(req: Request) {
  await dbConnect();
  const token = await getToken({ req: req as any, secret });

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized, DELETE' }, { status: 401 });
  }

  const { id } = await req.json();
  await Todo.findOneAndDelete({ _id: id, user: token.sub });

  return NextResponse.json({ success: true });
}
