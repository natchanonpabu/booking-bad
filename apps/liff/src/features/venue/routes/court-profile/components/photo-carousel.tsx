import { useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/utils';

/** CSS scroll-snap, no library: shadcn's carousel wraps embla, and this behaves better
    in an old in-app webview for a job that is three photos wide (DESIGN.md §6). */
export function PhotoCarousel({ slides }: { slides: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="relative">
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-xl no-scrollbar"
      >
        {slides.map((slide) => (
          <img
            key={slide.src}
            src={asset(slide.src)}
            alt={slide.alt}
            width={860}
            height={480}
            className="aspect-[16/9] w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-space-sm left-0 right-0 flex justify-center gap-1.5">
        {slides.map((slide, i) => (
          <span
            key={slide.src}
            className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-4 bg-card' : 'w-1.5 bg-card/60')}
          />
        ))}
      </div>
      <span className="pointer-events-none absolute right-space-sm top-space-sm rounded-full bg-primary/70 px-2 py-0.5 font-label-sm text-label-sm text-on-primary">
        {index + 1} / {slides.length}
      </span>
    </div>
  );
}
