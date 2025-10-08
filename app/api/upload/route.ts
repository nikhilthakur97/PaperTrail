import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { db } from '@/app/database/db-server';
import { documents } from '@/app/database/schema';
import { processMultimodalPDF } from '@/app/lib/pdf-multimodal-processor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for processing large PDFs with images

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

    // Process PDF with multimodal extraction (text + images)
    const chunks = await processMultimodalPDF(buffer);

    // Count text and image chunks
    const textChunks = chunks.filter(c => c.type === 'text');
    const imageChunks = chunks.filter(c => c.type === 'image');

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
          chunks: chunks.map((chunk) => {
            if (chunk.type === 'text') {
              return {
                type: 'text',
                index: chunk.index,
                text: chunk.text,
                embedding: chunk.embedding,
              };
            } else {
              return {
                type: 'image',
                index: chunk.index,
                pageNumber: chunk.pageNumber,
                imageData: chunk.imageData,
                description: chunk.description,
                embedding: chunk.embedding,
              };
            }
          }),
          chunkCount: chunks.length,
          textChunkCount: textChunks.length,
          imageChunkCount: imageChunks.length,
          fileName: file.name,
          fileSize: file.size,
          hasVisualContent: imageChunks.length > 0,
        },
      })
      .returning();

    return NextResponse.json({
      success: true,
      documentId: document.id,
      fileName: file.name,
      chunkCount: chunks.length,
      textChunks: textChunks.length,
      imageChunks: imageChunks.length,
      message: imageChunks.length > 0
        ? `Processed ${textChunks.length} text chunks and ${imageChunks.length} images (tables/charts/diagrams)`
        : `Processed ${textChunks.length} text chunks`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
