import { ImageOff } from "lucide-react";
import { useState, type ImgHTMLAttributes } from "react";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string | null;
};

/**
 * Prevent a bad/expired remote image URL from leaving a broken-image icon.
 * If the primary image fails, the optional bundled fallback is tried once.
 * If that also fails, a neutral image placeholder is rendered.
 */
export function SafeImage({ fallbackSrc, src, alt = "", onError, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const currentSrc = failed ? undefined : usingFallback ? fallbackSrc ?? undefined : src;

  if (!currentSrc) {
    return (
      <div className={props.className} role="img" aria-label={alt || "Image unavailable"}>
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event);
        if (!usingFallback && fallbackSrc && fallbackSrc !== src) {
          setUsingFallback(true);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
