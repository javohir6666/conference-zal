import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const inputFile = 'public/images/IMG_8630.DNG';
const outputDir = 'public/images/optimized';
const outputFile = path.join(outputDir, 'IMG_8630.jpg');

async function optimizeSingleImage() {
  try {
    console.log('🖼️  Starting image optimization...');
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Get original file size
    const originalStats = await fs.stat(inputFile);
    const originalSize = originalStats.size;
    
    console.log(`📁 Processing: ${inputFile}`);
    console.log(`📊 Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Process the image
    await sharp(inputFile)
      .jpeg({ 
        quality: 80,
        progressive: true,
        mozjpeg: true
      })
      .resize(1920, 1080, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(outputFile);
    
    // Get optimized file size
    const optimizedStats = await fs.stat(outputFile);
    const optimizedSize = optimizedStats.size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📉 Size reduction: ${reduction}%`);
    console.log(`💾 Saved to: ${outputFile}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

optimizeSingleImage();
