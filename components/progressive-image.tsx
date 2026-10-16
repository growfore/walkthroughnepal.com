import Image, { getImageProps, type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

type ProgressiveImageProps = Omit<ImageProps, "src" | "fill" | "placeholder" | "blurDataURL"> & {
  src: string
}

// Stacks a tiny blurred preview and a medium preview under the full image.
// Each layer paints as soon as it arrives, so the slot fills almost instantly
// and sharpens progressively. No JS: the full image sits on top and simply
// covers the previews once loaded, so LCP and SSR are unaffected.
export function ProgressiveImage({ src, alt, className, loading, preload, ...props }: ProgressiveImageProps) {
  if (src.endsWith(".svg")) {
    return <Image src={src} alt={alt} fill className={className} loading={loading} preload={preload} {...props} />
  }

  const previewLoading = preload ? "eager" : loading
  const tiny = getImageProps({ src, alt: "", width: 32, height: 32 }).props.src
  const medium = getImageProps({ src, alt: "", width: 192, height: 192 }).props.src
  const layer = "pointer-events-none absolute inset-0 h-full w-full object-cover"

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={tiny} alt="" aria-hidden="true" decoding="async" loading={previewLoading} className={cn(layer, "scale-110 blur-xl")} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={medium} alt="" aria-hidden="true" decoding="async" loading={previewLoading} className={cn(layer, "blur-sm")} />
      <Image src={src} alt={alt} fill className={className} loading={loading} preload={preload} {...props} />
    </div>
  )
}
