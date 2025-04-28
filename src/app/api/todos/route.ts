import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Todo from '@/lib/models/Todo';

// GET /api/todos
export async function GET() {
  await dbConnect();
  const todos = await Todo.find({});
  return NextResponse.json({ success: true, data: todos });
}

// POST /api/todos
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const todo = await Todo.create(body);
    return NextResponse.json({ success: true, data: todo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT /api/todos
export async function PUT(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, completed } = body;
    const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
    return NextResponse.json({ success: true, data: todo });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE /api/todos
export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id } = body;
    await Todo.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
