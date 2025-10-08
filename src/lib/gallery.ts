// Dynamic image loading utility - OPTIMIZED IMAGES
export function getAllImagesFromFolders(): string[] {
  const images: string[] = [];
  
  // 1-slider images (optimized)
  const slider1Images = [
    '/images/optimized/1-slider/IMG_5276_2.jpg',
    '/images/optimized/1-slider/IMG_5277_2.jpg',
    '/images/optimized/1-slider/IMG_5278_2.jpg'
  ];
  
  // 2-slider images (optimized)
  const slider2Images = [
    '/images/optimized/2-slider/IMG_4576.jpg',
    '/images/optimized/2-slider/IMG_4577.jpg',
    '/images/optimized/2-slider/IMG_4578.jpg',
    '/images/optimized/2-slider/IMG_4579.jpg',
    '/images/optimized/2-slider/IMG_4580.jpg',
    '/images/optimized/2-slider/IMG_4581.jpg',
    '/images/optimized/2-slider/IMG_4582_3.jpg',
    '/images/optimized/2-slider/IMG_4583_3.jpg',
    '/images/optimized/2-slider/IMG_4584_3.jpg',
    '/images/optimized/2-slider/IMG_4586_3.jpg',
    '/images/optimized/2-slider/IMG_4587.jpg',
    '/images/optimized/2-slider/IMG_4588.jpg',
    '/images/optimized/2-slider/IMG_4589.jpg',
    '/images/optimized/2-slider/IMG_4590.jpg'
  ];
  
  // 3-slider images (optimized)
  const slider3Images = [
    '/images/optimized/3-slider/photo_2024-01-30_15-44-02.jpg',
    '/images/optimized/3-slider/photo_2024-01-30_15-44-06.jpg',
    '/images/optimized/3-slider/photo_2024-01-30_15-44-09.jpg',
    '/images/optimized/3-slider/photo_2024-01-30_15-44-10.jpg',
    '/images/optimized/3-slider/photo_2024-01-30_15-44-12.jpg'
  ];
  
  // Combine all images
  images.push(...slider1Images, ...slider2Images, ...slider3Images);
  
  return images;
}

export function getSliderImages(sliderId: '1' | '2' | '3'): string[] {
  switch (sliderId) {
    case '1':
      return [
        '/images/optimized/1-slider/IMG_5276_2.jpg',
        '/images/optimized/1-slider/IMG_5277_2.jpg',
        '/images/optimized/1-slider/IMG_5278_2.jpg'
      ];
    case '2':
      return [
        '/images/optimized/2-slider/IMG_4576.jpg',
        '/images/optimized/2-slider/IMG_4577.jpg',
        '/images/optimized/2-slider/IMG_4578.jpg',
        '/images/optimized/2-slider/IMG_4579.jpg',
        '/images/optimized/2-slider/IMG_4580.jpg',
        '/images/optimized/2-slider/IMG_4581.jpg',
        '/images/optimized/2-slider/IMG_4582_3.jpg',
        '/images/optimized/2-slider/IMG_4583_3.jpg',
        '/images/optimized/2-slider/IMG_4584_3.jpg',
        '/images/optimized/2-slider/IMG_4586_3.jpg',
        '/images/optimized/2-slider/IMG_4587.jpg',
        '/images/optimized/2-slider/IMG_4588.jpg',
        '/images/optimized/2-slider/IMG_4589.jpg',
        '/images/optimized/2-slider/IMG_4590.jpg'
      ];
    case '3':
      return [
        '/images/optimized/3-slider/photo_2024-01-30_15-44-02.jpg',
        '/images/optimized/3-slider/photo_2024-01-30_15-44-06.jpg',
        '/images/optimized/3-slider/photo_2024-01-30_15-44-09.jpg',
        '/images/optimized/3-slider/photo_2024-01-30_15-44-10.jpg',
        '/images/optimized/3-slider/photo_2024-01-30_15-44-12.jpg'
      ];
    default:
      return [];
  }
}
