import { Canvas as FabricCanvas } from 'fabric';

export const createCanvas = (canvasElement: HTMLCanvasElement): FabricCanvas => {
  return new FabricCanvas(canvasElement, {
    width: 600,
    height: 400,
    backgroundColor: '#ffffff',
  });
};

export const disposeCanvas = (canvas: FabricCanvas | null): void => {
  if (canvas) {
    console.log('Disposing canvas');
    canvas.dispose();
  }
};

export const getCanvasCenter = (canvas: FabricCanvas) => {
  return canvas.getCenter();
};