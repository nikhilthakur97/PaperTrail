import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { db } from '@/app/database/db-server';
import { documents } from '@/app/database/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all documents for this user
    const userDocuments = await db
      .select({
        id: documents.id,
        title: documents.title,
        sourceType: documents.sourceType,
        fileType: documents.fileType,
        embeddingStatus: documents.embeddingStatus,
        createdAt: documents.createdAt,
      })
      .from(documents)
      .where(eq(documents.uploadedByUserId, session.user.id))
      .orderBy(documents.createdAt);

    // Add chunk count from metadata
    const fullDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.uploadedByUserId, session.user.id));

    const docsWithChunkCount = userDocuments.map((doc) => {
      const fullDoc = fullDocs.find((d) => d.id === doc.id);
      const chunkCount =
        fullDoc?.metadata && typeof fullDoc.metadata === 'object' && 'chunkCount' in fullDoc.metadata
          ? (fullDoc.metadata as { chunkCount?: number }).chunkCount ?? 0
          : 0;

      return {
        ...doc,
        chunkCount,
      };
    });

    return NextResponse.json({ documents: docsWithChunkCount });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Verify document belongs to user before deleting
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!document || document.uploadedByUserId !== session.user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete the document
    await db.delete(documents).where(eq(documents.id, documentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
