export default {
  // 기본 포맷팅 규칙
  printWidth: 120, // 한 줄 최대 길이
  tabWidth: 2, // 탭 너비
  useTabs: false, // 스페이스 사용
  semi: true, // 세미콜론 사용
  singleQuote: false, // 작은따옴표 사용
  quoteProps: "as-needed", // 필요한 경우만 객체 속성에 따옴표

  // JSX 관련
  jsxSingleQuote: false, // JSX에서는 큰따옴표

  // 배열, 객체 등의 마지막 쉼표
  trailingComma: "es5", // ES5에서 유효한 곳에만 trailing comma

  // 괄호 관련
  bracketSpacing: true, // 객체 리터럴 괄호 내부 공백
  bracketSameLine: false, // JSX 태그의 > 를 다음 줄에
  arrowParens: "always", // 화살표 함수 파라미터 괄호 항상 사용

  // 줄바꿈 설정
  endOfLine: "lf", // Unix 스타일 줄바꿈 (Windows에서도 Git이 자동 변환)

  // Tailwind CSS 정렬 플러그인 (선택사항)
  plugins: ["prettier-plugin-tailwindcss"],
};
