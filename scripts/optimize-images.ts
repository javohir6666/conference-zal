import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = './public/images';
const OUTPUT_DIR = './public/images/optimized';
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
const QUALITY = 80;

// Folders to process
const FOLDERS = ['1-slider', '2-slider', '3-slider'];

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create subdirectories for each slider
FOLDERS.forEach(folder => {
  const outputSubDir = path.join(OUTPUT_DIR, folder);
  if (!fs.existsSync(outputSubDir)) {
    fs.mkdirSync(outputSubDir, { recursive: true });
  }
});

async function optimizeImage(inputPath: string, outputPath: string, folderName: string) {
  try {
    const stats = fs.statSync(inputPath);
    const fileSizeKB = stats.size / 1024;
    const fileName = path.basename(inputPath);
    
    console.log(`Processing [${folderName}]: ${fileName} (${fileSizeKB.toFixed(1)} KB)`);
    
    // Create WebP version
    await sharp(inputPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath.replace(/\.[^/.]+$/, '.webp'));
      
    // Create optimized JPEG version
    await sharp(inputPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toFile(outputPath.replace(/\.[^/.]+$/, '.jpg'));
      
    const newStats = fs.statSync(outputPath.replace(/\.[^/.]+$/, '.jpg'));
    const newSizeKB = newStats.size / 1024;
    const savings = ((fileSizeKB - newSizeKB) / fileSizeKB * 100).toFixed(1);
    
    console.log(`✓ Optimized: ${newSizeKB.toFixed(1)} KB (${savings}% smaller)`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

async function optimizeLogo() {
  const logoPath = path.join(INPUT_DIR, 'Логотип.png');
  const outputLogoPath = path.join(OUTPUT_DIR, 'Логотип.png');
  
  if (fs.existsSync(logoPath)) {
    try {
      console.log('Processing logo: Логотип.png');
      
      // Optimize logo - smaller size, maintain transparency
      await sharp(logoPath)
        .resize(400, 200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputLogoPath);
        
      const stats = fs.statSync(logoPath);
      const newStats = fs.statSync(outputLogoPath);
      const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
      
      console.log(`✓ Logo optimized: ${(newStats.size / 1024).toFixed(1)} KB (${savings}% smaller)`);
    } catch (error) {
      console.error('Error processing logo:', error);
    }
  }
}

async function optimizeAllImages() {
  try {
    let totalImages = 0;
    
    console.log('🖼️  Starting image optimization...\n');
    
    // Process each slider folder
    for (const folder of FOLDERS) {
      const folderPath = path.join(INPUT_DIR, folder);
      const outputFolderPath = path.join(OUTPUT_DIR, folder);
      
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|webp)$/i.test(file)
        );
        
        console.log(`\n📁 Processing ${folder}/ (${imageFiles.length} images):`);
        
        for (const file of imageFiles) {
          const inputPath = path.join(folderPath, file);
          const outputPath = path.join(outputFolderPath, file);
          await optimizeImage(inputPath, outputPath, folder);
          totalImages++;
        }
      }
    }
    
    // Process logo
    await optimizeLogo();
    
    console.log(`\n✅ All images optimized successfully!`);
    console.log(`📊 Total processed: ${totalImages} images + 1 logo`);
    console.log('\n📝 Next steps:');
    console.log('1. Update .env file to use /images/optimized/ paths');
    console.log('2. Test loading speed in browser');
    console.log('3. Check WebP support in different browsers');
  } catch (error) {
    console.error('Error:', error);
  }
}

optimizeAllImages();
