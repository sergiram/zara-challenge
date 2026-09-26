import { useEffect, useState } from 'react';
import { trimImage } from '../utils/trimImage';

interface TrimmedImage {
  src: string;
  trimmedSrc: string;
}

export function useTrimmedImage(src: string): string | null {
  const [image, setImage] = useState<TrimmedImage | null>(null);

  useEffect(() => {
    let isCurrent = true;

    trimImage(src).then((trimmedSrc) => {
      if (isCurrent) setImage({ src, trimmedSrc });
    });

    return () => {
      isCurrent = false;
    };
  }, [src]);

  // Never return the cropped copy of a previous src while the new one is being processed
  return image?.src === src ? image.trimmedSrc : null;
}
