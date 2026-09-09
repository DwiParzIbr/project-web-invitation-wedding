import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { templates: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST create a category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nama Kategori wajib diisi' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        description: description || '',
        icon: icon || 'Sparkles',
      },
      include: { templates: true },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// PUT edit a category
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, icon } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const updated = await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        icon,
      },
      include: { templates: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE a category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
