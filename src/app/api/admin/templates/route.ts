import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all templates or check template dependencies
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkId = searchParams.get('checkId');

    if (checkId) {
      const template = await db.template.findUnique({
        where: { id: checkId },
        include: { category: true },
      });

      if (!template) {
        return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 404 });
      }

      const invitationCount = await db.invitation.count({
        where: { templateId: checkId },
      });

      const sampleInvitations = await db.invitation.findMany({
        where: { templateId: checkId },
        select: { id: true, title: true, slug: true },
        take: 5,
      });

      return NextResponse.json({
        template,
        invitationCount,
        sampleInvitations,
      });
    }

    const templates = await db.template.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST create a new template
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryId, price, tier, previewImage, description, status } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Nama Template dan Kategori wajib diisi' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const defaultDesignSchema = JSON.stringify({
      theme: {
        primaryColor: '#D4AF37',
        secondaryColor: '#0F172A',
        accentColor: '#F59E0B',
        background: '#0F172A',
        cardBg: '#1E293B',
        fontColor: '#FFFFFF',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Montserrat',
      },
      ornament: 'gold-floral',
      animation: 'fade-up',
      enableBackgroundSilhouette: true,
      backgroundSilhouetteOpacity: 0.85,
      backgroundSilhouetteStyle: 'full',
      sections: [],
    });

    const newTemplate = await db.template.create({
      data: {
        name,
        slug,
        categoryId,
        price: parseInt(price) || 200000,
        tier: tier || 'PREMIUM',
        status: status || 'PUBLISHED',
        previewImage: previewImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        description: description || 'Template undangan pernikahan elegan.',
        designSchema: defaultDesignSchema,
      },
      include: { category: true },
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

// PUT edit a template
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, categoryId, price, tier, previewImage, description, status, designSchema } = body;

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined && name.trim() !== '') updateData.name = name;
    if (categoryId !== undefined && categoryId.trim() !== '') updateData.categoryId = categoryId;
    if (price !== undefined && price !== null && String(price).trim() !== '') updateData.price = parseInt(price) || 0;
    if (tier !== undefined) updateData.tier = tier;
    if (previewImage !== undefined) updateData.previewImage = previewImage;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (designSchema !== undefined) {
      updateData.designSchema = typeof designSchema === 'object' ? JSON.stringify(designSchema) : designSchema;
    }

    const updatedTemplate = await db.template.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json(updatedTemplate);
  } catch (error: any) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: error.message || 'Failed to update template' }, { status: 500 });
  }
}

// DELETE a template (Safe Archive vs Permanent Cascade)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const mode = searchParams.get('mode') || 'archive'; // 'archive' (soft safe delete) or 'permanent' (hard delete)

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    const targetTemplate = await db.template.findUnique({ where: { id } });
    if (!targetTemplate) {
      return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 404 });
    }

    const invitationCount = await db.invitation.count({ where: { templateId: id } });

    if (mode === 'archive') {
      // Safe Soft Delete: Mark status as ARCHIVED (hidden from catalog, client invitations stay active & safe)
      const updated = await db.template.update({
        where: { id },
        data: { status: 'ARCHIVED' },
        include: { category: true },
      });
      return NextResponse.json({
        success: true,
        mode: 'archive',
        message: `✓ Template "${targetTemplate.name}" telah diamankan ke status ARCHIVED. Undangan pengguna aktif tetap aman & tidak terganggu.`,
        template: updated,
      });
    }

    if (mode === 'permanent') {
      // If active user invitations exist, reassign them to another active template first to prevent breaking client sites
      if (invitationCount > 0) {
        const fallbackTemplate = await db.template.findFirst({
          where: { id: { not: id }, status: { not: 'ARCHIVED' } },
        });

        if (fallbackTemplate) {
          await db.invitation.updateMany({
            where: { templateId: id },
            data: { templateId: fallbackTemplate.id },
          });
        }
      }

      await db.template.delete({ where: { id } });
      return NextResponse.json({
        success: true,
        mode: 'permanent',
        message: `✓ Template "${targetTemplate.name}" telah dihapus secara permanen dari database.`,
      });
    }

    return NextResponse.json({ error: 'Invalid delete mode' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete template' }, { status: 500 });
  }
}
