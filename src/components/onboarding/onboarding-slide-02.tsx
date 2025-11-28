import story03 from "@/assets/images/story03.webp";
import OnboardingSlide from "@/components/onboarding/onboarding-slide.tsx";
import { Button } from "@/components/ui/button.tsx";

interface Props {
  onStartClicked?: () => void;
}

export default function OnboardingSlide02({ onStartClicked }: Props) {
  return (
    <OnboardingSlide bgImage={story03} bgImageAlt="온보딩 스토리 세 번째">
      <div className="flex h-full flex-col items-center justify-end pb-32">
        <p className="text-3xl">B0 - 존재하지 않는 층</p>
        <p className="mt-4 text-xl">비행선에 탑승하세요.</p>

        <Button className="mt-12" size="lg" onClick={onStartClicked}>
          페레그리나로 떠나기
        </Button>
      </div>
    </OnboardingSlide>
  );
}
