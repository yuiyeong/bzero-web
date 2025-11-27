import story02 from "@/assets/images/story02.webp";
import OnboardingSlide from "@/components/onboarding/onboarding-slide.tsx";

const appName = "B0";
const storyLines = ["화면에", appName, "라는 앱이", "설치되어 있습니다."];

export default function OnboardingSlide01() {
  return (
    <OnboardingSlide bgImage={story02} bgImageAlt="온보딩 스토리 두 번째">
      <div className="flex h-full flex-col items-center justify-end gap-2 pb-32">
        {storyLines.map((line, index) => (
          <p key={index} className={line === appName ? "text-3xl font-medium" : "text-2xl"}>
            {line}
          </p>
        ))}
      </div>
    </OnboardingSlide>
  );
}
