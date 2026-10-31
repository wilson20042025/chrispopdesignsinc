import { NextRequest, NextResponse } from 'next/server';
import { getPosts, savePost, deletePost } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: 'Post title is required' }, { status: 400 });
    }

    const post = await savePost(data);
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: error.message || 'Error saving post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const ok = await deletePost(id);
    if (!ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: error.message || 'Error deleting post' }, { status: 500 });
  }
}
