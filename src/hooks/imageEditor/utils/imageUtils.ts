import { Canvas as FabricCanvas, FabricImage } from 'fabric';

export const loadAndScaleImage = async (
  imageUrl: string,
  canvas: FabricCanvas
): Promise<FabricImage> => {
  const img = await FabricImage.fromURL(imageUrl, {
    crossOrigin: 'anonymous'
  });

  console.log('Image loaded successfully', img);
  
  if (!img.width || !img.height) {
    throw new Error('Image dimensions are invalid');
  }

  // Scale image to fit canvas while maintaining aspect ratio
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const imgWidth = img.width;
  const imgHeight = img.height;
  
  console.log('Canvas dimensions:', canvasWidth, canvasHeight);
  console.log('Image dimensions:', imgWidth, imgHeight);
  
  const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight) * 0.8; // 80% of canvas
  img.scale(scale);
  
  // Center the image
  const scaledWidth = imgWidth * scale;
  const scaledHeight = imgHeight * scale;
  
  img.set({
    left: (canvasWidth - scaledWidth) / 2,
    top: (canvasHeight - scaledHeight) / 2,
    selectable: true,
    hasControls: true,
    hasBorders: true,
  });
  
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.renderAll();
  
  console.log('Image added to canvas and centered');
  return img;
};