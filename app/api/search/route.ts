import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Search PubMed for research papers
 */
async function searchPubMed(query: string, maxResults: number = 10) {
  try {
    // Step 1: Search for PMIDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const pmids = searchData.esearchresult?.idlist || [];

    if (pmids.length === 0) {
      return [];
    }

    // Step 2: Fetch details for these PMIDs
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;

    const fetchResponse = await fetch(fetchUrl);
    const fetchData = await fetchResponse.json();

    const papers = pmids.map((pmid: string) => {
      const paper = fetchData.result[pmid];
      return {
        id: `PMID:${pmid}`,
        title: paper?.title || 'No title',
        authors: paper?.authors?.map((a: { name: string }) => a.name).join(', ') || 'Unknown',
        year: paper?.pubdate?.split(' ')[0] || 'Unknown',
        source: 'PubMed',
        abstract: paper?.elocationid || '',
        doi: paper?.doi || '',
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
      };
    });

    return papers;
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

/**
 * Search arXiv for research papers
 */
async function searchArxiv(query: string, maxResults: number = 10) {
  try {
    const searchUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}`;

    const response = await fetch(searchUrl);
    const xmlText = await response.text();

    // Parse XML (simple regex approach for demo - in production use a proper XML parser)
    const entries = xmlText.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

    const papers = entries.map((entry) => {
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim() || 'No title';
      const authors = Array.from(entry.matchAll(/<name>(.*?)<\/name>/g)).map(m => m[1]).join(', ') || 'Unknown';
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1]?.split('T')[0] || 'Unknown';
      const summary = entry.match(/<summary>(.*?)<\/summary>/)?.[1]?.replace(/\s+/g, ' ').trim() || '';
      const id = entry.match(/<id>(.*?)<\/id>/)?.[1] || '';
      const arxivId = id.split('/').pop()?.replace('v', ' v') || '';

      return {
        id: `arXiv:${arxivId}`,
        title,
        authors,
        year: published.split('-')[0],
        source: 'arXiv',
        abstract: summary.substring(0, 300) + (summary.length > 300 ? '...' : ''),
        doi: '',
        url: id
      };
    });

    return papers;
  } catch (error) {
    console.error('arXiv search error:', error);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const source = searchParams.get('source') || 'both'; // 'pubmed', 'arxiv', or 'both'
    const maxResults = parseInt(searchParams.get('max') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    interface SearchResult {
      id: string;
      title: string;
      authors: string;
      year: string;
      source: string;
      abstract: string;
      doi: string;
      url: string;
    }

    let results: SearchResult[] = [];

    if (source === 'pubmed' || source === 'both') {
      const pubmedResults = await searchPubMed(query, maxResults);
      results = results.concat(pubmedResults);
    }

    if (source === 'arxiv' || source === 'both') {
      const arxivResults = await searchArxiv(query, maxResults);
      results = results.concat(arxivResults);
    }

    return NextResponse.json({ results, count: results.length });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search papers' },
      { status: 500 }
    );
  }
}
