import story01 from "@/assets/images/story01.webp";
import OnboardingSlide from "@/components/onboarding/onboarding-slide.tsx";

const storyLines = ["어느 날 밤", "당신은", "의문의 핸드폰을", "발견했습니다."];

export default function OnboardingSlide00() {
  return (
    <OnboardingSlide bgImage={story01} bgImageAlt="온보딩 스토리 첫 번째">
      <div className="flex h-full flex-col items-center justify-end gap-2 pb-32">
        {storyLines.map((line, index) => (
          <p key={index} className="text-2xl">
            {line}
          </p>
        ))}
      </div>
    </OnboardingSlide>
  );
}
