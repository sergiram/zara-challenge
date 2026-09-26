// The visible area is detected on a downscaled copy: much faster and precise enough
const DETECTION_SIZE = 200;
const ALPHA_THRESHOLD = 20;
// A couple of API images have an opaque white background instead of a transparent one
const WHITE_THRESHOLD = 240;

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const cache = new Map<string, Promise<string>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
}

function getContentBounds(image: HTMLImageElement): Bounds | null {
  const { naturalWidth, naturalHeight } = image;
  const scale = Math.min(1, DETECTION_SIZE / Math.max(naturalWidth, naturalHeight));
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);

  const alphaAt = (x: number, y: number) => data[(y * width + x) * 4 + 3];
  const hasOpaqueBackground = [
    alphaAt(0, 0),
    alphaAt(width - 1, 0),
    alphaAt(0, height - 1),
    alphaAt(width - 1, height - 1),
  ].every((alpha) => alpha === 255);

  const isBackground = (x: number, y: number) => {
    const index = (y * width + x) * 4;
    if (data[index + 3] <= ALPHA_THRESHOLD) return true;
    return (
      hasOpaqueBackground &&
      Math.min(data[index], data[index + 1], data[index + 2]) >= WHITE_THRESHOLD
    );
  };

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isBackground(x, y)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < 0) return null;

  // One extra detection pixel on each side so downscaling never crops the phone's edges
  const left = Math.max(0, minX - 1);
  const top = Math.max(0, minY - 1);
  const right = Math.min(width, maxX + 2);
  const bottom = Math.min(height, maxY + 2);

  return {
    x: left / scale,
    y: top / scale,
    width: (right - left) / scale,
    height: (bottom - top) / scale,
  };
}

async function trim(src: string): Promise<string> {
  const image = await loadImage(src);
  const bounds = getContentBounds(image);
  if (!bounds) return src;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bounds.width);
  canvas.height = Math.round(bounds.height);
  const context = canvas.getContext('2d');
  if (!context) return src;

  context.drawImage(
    image,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
  return blob ? URL.createObjectURL(blob) : src;
}

/**
 * Crops the empty margin around a product image and resolves to a URL of the cropped copy.
 * Each API image carries a different margin, so without this the phones render at
 * inconsistent sizes. Falls back to the original URL if the image can't be processed.
 */
export function trimImage(src: string): Promise<string> {
  let result = cache.get(src);

  if (!result) {
    result = trim(src).catch(() => src);
    cache.set(src, result);
  }

  return result;
}
