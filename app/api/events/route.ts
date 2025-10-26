import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { listEvents, deleteFromGithub } from '@/lib/github';

export async function GET() {
  try {
    const events = await listEvents();
    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { path, sha } = await request.json();

    if (!path || !sha) {
      return NextResponse.json(
        { error: 'Path and SHA required' },
        { status: 400 }
      );
    }

    await deleteFromGithub(path, sha);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
