import { useEffect, useState } from 'react';
import { trimImage } from '../utils/trimImage';

export function useTrimmedImage(src: string): string | null {
  const [trimmedSrc, setTrimmedSrc] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    trimImage(src).then((result) => {
      if (isCurrent) setTrimmedSrc(result);
    });

    return () => {
      isCurrent = false;
    };
  }, [src]);

  // While a new src is processed the previous crop stays on screen, as a plain <img> does when its
  // src changes. Unmounting it instead would make the image blink when switching colours.
  return trimmedSrc;
}
