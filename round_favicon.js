const sharp = require('sharp');
const fs = require('fs');

async function roundCorners() {
  const inputPath = 'public/favicon.png';
  const outputPath = 'public/favicon_rounded.png';
  
  try {
    const metadata = await sharp(inputPath).metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    // We want to make the corners rounder, say 20% of the width
    const rx = Math.round(width * 0.2);
    
    // Create an SVG mask with rounded corners
    const roundedCorners = Buffer.from(
      `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${rx}"/></svg>`
    );
    
    await sharp(inputPath)
      .composite([{
        input: roundedCorners,
        blend: 'dest-in'
      }])
      .png()
      .toFile(outputPath);
      
    console.log('Successfully rounded corners!');
  } catch (error) {
    console.error('Error:', error);
  }
}

roundCorners();
