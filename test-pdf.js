const fs = require('fs');
const path = require('path');

async function testPDFProcessing() {
  try {
    console.log('Testing PDF processing...\n');

    // Read the PDF file
    const pdfPath = path.join(__dirname, '2510.01185v1.pdf');
    const buffer = fs.readFileSync(pdfPath);
    console.log(`✓ PDF file loaded: ${(buffer.length / 1024 / 1024).toFixed(2)} MB\n`);

    // Test pdf-parse-fork
    console.log('Testing pdf-parse-fork...');
    const pdfParse = require('pdf-parse-fork');
    const data = await pdfParse(buffer);

    console.log(`✓ PDF parsed successfully!`);
    console.log(`  - Pages: ${data.numpages}`);
    console.log(`  - Text length: ${data.text.length} characters`);
    console.log(`  - First 200 chars: ${data.text.substring(0, 200).replace(/\n/g, ' ')}...\n`);

    // Test chunking
    const paragraphs = data.text.split(/\n\n+/).filter(p => p.trim().length > 0);
    console.log(`✓ Text can be chunked`);
    console.log(`  - Paragraphs: ${paragraphs.length}\n`);

    console.log('✅ All PDF processing tests passed!');
    console.log('\nThe upload endpoint should work now. Try uploading via the UI.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testPDFProcessing();
