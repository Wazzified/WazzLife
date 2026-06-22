import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    // We expect a multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Save to Database
    const journal = await prisma.journal.create({
      data: {
        imageUrl: blob.url,
        caption: caption || '',
      }
    });

    return NextResponse.json({ success: true, journal, blob });
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
