const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('🧪 Testing PDF upload to server...\n');

    // First, we need to login to get a session
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123',
      }),
    });

    console.log('Login response:', loginResponse.status);

    // For testing, let's just test the PDF processing directly
    console.log('\n2. Testing PDF processing directly...\n');

    // Load the PDF
    const pdfPath = '2510.01185v1.pdf';
    const buffer = fs.readFileSync(pdfPath);

    // Import the processor
    const { processPDF } = require('./app/lib/pdf-processor.ts');

    console.log('Processing PDF...');
    const chunks = await processPDF(buffer);

    console.log('\n✅ SUCCESS!');
    console.log(`\nResults:`);
    console.log(`- Total chunks: ${chunks.length}`);
    console.log(`- Embedding dimensions: ${chunks[0].embedding.length}`);
    console.log(`- First chunk preview: ${chunks[0].text.substring(0, 100)}...`);
    console.log(`- Embedding type: ${chunks[0].embedding[0] !== undefined ? 'Generated' : 'Failed'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testUpload();
