import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { db } from '@/app/database/db-server';
import { documents } from '@/app/database/schema';
import { processPDF } from '@/app/lib/pdf-processor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const threadId = formData.get('threadId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process PDF: extract text, chunk, and generate embeddings
    const chunks = await processPDF(buffer);

    // Save document to database
    const [document] = await db
      .insert(documents)
      .values({
        sourceType: 'upload',
        title: file.name,
        fileType: 'pdf',
        embeddingStatus: 'completed',
        uploadedByUserId: session.user.id,
        uploadedInThreadId: threadId || null,
        metadata: {
          chunks: chunks.map((chunk, index) => ({
            index,
            text: chunk.text,
            embedding: chunk.embedding,
          })),
          chunkCount: chunks.length,
          fileName: file.name,
          fileSize: file.size,
        },
      })
      .returning();

    return NextResponse.json({
      success: true,
      documentId: document.id,
      fileName: file.name,
      chunkCount: chunks.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
