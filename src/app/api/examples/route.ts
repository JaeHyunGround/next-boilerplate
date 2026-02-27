import { NextResponse } from 'next/server';

const examples = [
  { id: 1, title: 'Example 1', status: 'published' as const },
  { id: 2, title: 'Example 2', status: 'draft' as const },
];

export async function GET() {
  return NextResponse.json(examples);
}
