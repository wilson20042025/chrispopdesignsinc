import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategory, deleteCategory } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: 'Category title is required' }, { status: 400 });
    }

    const category = await saveCategory(data);
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error('Error saving category:', error);
    return NextResponse.json({ error: error.message || 'Error saving category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const ok = await deleteCategory(id);
    if (!ok) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: error.message || 'Error deleting category' }, { status: 500 });
  }
}
