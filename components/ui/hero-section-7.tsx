import React from "react";

import { cn } from "@/lib/utils";

interface FloatingImageProps {
  src: string;
  alt: string;
  className: string;
}

export interface FloatingFoodHeroProps {
  title: string;
  description: string;
  images: FloatingImageProps[];
  className?: string;
  children?: React.ReactNode;
}

const Swirls = () => (
  <>
    <svg
      className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3 text-[color:var(--brand-soft)]"
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M515.266 181.33C377.943 51.564 128.537 136.256 50.8123 293.565C-26.9127 450.874 125.728 600 125.728 600"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <svg
      className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-[color:var(--brand-soft)]"
      width="700"
      height="700"
      viewBox="0 0 700 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M26.8838 528.274C193.934 689.816 480.051 637.218 594.397 451.983C708.742 266.748 543.953 2.22235 543.953 2.22235"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </>
);

export function FloatingFoodHero({
  title,
  description,
  images,
  className,
  children,
}: FloatingFoodHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-[color:var(--bg)] py-20 md:py-32 lg:min-h-[80vh]",
        className,
      )}
    >
      <div className="absolute inset-0 z-0 opacity-80">
        <Swirls />
      </div>

      <div className="absolute inset-0 z-10">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={cn("absolute object-contain", image.className)}
            style={{ animationDelay: `${index * 300}ms` }}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      <div className="relative z-20 mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-pretty text-lg leading-8 text-[color:var(--muted)]">
          {description}
        </p>
        {children ? <div className="mt-8 flex justify-center">{children}</div> : null}
      </div>
    </section>
  );
}

