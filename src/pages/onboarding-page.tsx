import { Carousel, type CarouselApi, CarouselContent } from "@/components/ui/carousel.tsx";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";
import OnboardingSlide00 from "@/components/onboarding/onboarding-slide-00.tsx";
import OnboardingSlide01 from "@/components/onboarding/onboarding-slide-01.tsx";
import OnboardingSlide02 from "@/components/onboarding/onboarding-slide-02.tsx";
import { useOnboardingMakeCompleted } from "@/stores/onboarding-store.ts";
import { useNavigate } from "react-router";

const SLIDE_COUNT = 3;

export default function OnboardingPage() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const makeOnboardingCompleted = useOnboardingMakeCompleted();
  const navigate = useNavigate();

  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());

    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleStartClicked = () => {
    makeOnboardingCompleted();
    navigate("/");
  };

  return (
    <div className="relative h-screen w-full">
      <Carousel setApi={setApi} className="h-screen w-full">
        <CarouselContent className="-ml-0">
          <OnboardingSlide00 />
          <OnboardingSlide01 />
          <OnboardingSlide02 onStartClicked={handleStartClicked} />
        </CarouselContent>
      </Carousel>

      {/* Indicator Dots */}
      <div className="absolute bottom-12 flex w-full justify-center gap-4">
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
          <button
            className={cn("h-4 w-4 rounded-full bg-white/40", { "bg-white": currentSlide === index })}
            key={index}
            aria-label={`슬라이드 ${index + 1}로 이동`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
