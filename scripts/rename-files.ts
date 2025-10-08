import fs from 'fs';
import path from 'path';

const OPTIMIZED_DIR = './public/images/optimized';

async function renameFiles() {
  try {
    const files = fs.readdirSync(OPTIMIZED_DIR);
    
    for (const file of files) {
      const oldPath = path.join(OPTIMIZED_DIR, file);
      
      // Replace spaces and parentheses with underscores
      const newFileName = file
        .replace(/\s+/g, '_')        // spaces to underscores
        .replace(/[()]/g, '_')       // parentheses to underscores
        .replace(/_+/g, '_')         // multiple underscores to single
        .replace(/_+\./g, '.');      // remove underscores before extension
      
      const newPath = path.join(OPTIMIZED_DIR, newFileName);
      
      if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} → ${newFileName}`);
      }
    }
    
    console.log('\n✅ All files renamed successfully!');
    console.log('\n📝 Update .env file with new names:');
    
    const renamedFiles = fs.readdirSync(OPTIMIZED_DIR);
    const imageFiles = renamedFiles.filter(f => f.endsWith('.jpg'));
    
    imageFiles.forEach((file, i) => {
      console.log(`VITE_GALLERY_IMG_${i+1}=/images/optimized/${file}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

renameFiles();
