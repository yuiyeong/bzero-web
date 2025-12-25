import { CarouselItem } from "@/components/ui/carousel.tsx";
import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  bgImage: string;
  bgImageAlt: string;
}

export default function OnboardingSlide({ bgImage, bgImageAlt, children }: Props) {
  return (
    <CarouselItem className="h-screen-safe relative pl-0">
      <img className="h-full w-full object-cover" src={bgImage} alt={bgImageAlt} />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 z-10">{children}</div>
    </CarouselItem>
  );
}
