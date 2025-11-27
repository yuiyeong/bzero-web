# B0 (비제로) - 지하 0층 🎈

> 숨겨진 지하 0층에서 출발하는 비행선을 타고 가상 세계를 여행하며 힐링과 자기성찰을 경험하는 온라인 커뮤니티

## 프로젝트 소개

**B0(비제로)**는 지하 0층에서 출발하는 비행선을 타고 이세계를 여행하며, 게스트하우스에서 사람들을 만나고 자기성찰을 하는 온라인 커뮤니티 서비스입니다.

어느 날 방에서 발견한 신비한 핸드폰에 설치된 앱, B0. 존재하지 않는 층으로의 초대를 받아보세요.

## 주요 기능

### 🎭 핵심 컨셉

1. **지하 0층 발견**: 어느 날 방에서 발견한 신비한 핸드폰에 설치된 앱, B0 - 존재하지 않는 층으로의 초대
2. **비행선 터미널**: B0은 여러 이세계 도시로 가는 비행선이 출발하는 숨겨진 정류장
3. **가상 세계 여행**: 5개의 테마가 다른 도시를 비행선을 타고 여행
4. **게스트하우스**: 각 도시의 게스트하우스에서 다른 여행자들을 만나 이야기 나누기
   - **혼합형**: 정해진 시간에 함께하는 이벤트 중심 (불멍, 별멍 등)
   - **조용한 방**: 개인적인 대화와 자기성찰 중심 (No 파티)
5. **라운지**: 같은 게스트하우스 사람들과 1:1 대화를 나눌 수 있는 공간
6. **자기성찰**: 개인 숙소에서 일기를 쓰고, 질문에 답하며 자신을 돌아보기
7. **AI 호스트**: 친절한 호스트가 대화를 이끌고 이벤트를 진행

## 기술 스택

### 코어

- **React** 19.1.1 - UI 라이브러리
- **TypeScript** 5.9.3 - 타입 안정성
- **Vite** 7.1.7 - 빌드 도구 및 개발 서버

### 상태 관리

- **Zustand** 5.0.8 - 경량 클라이언트 상태 관리
- **TanStack Query** 5.90.6 - 서버 상태 관리 및 데이터 페칭

### 라우팅

- **React Router** 7.9.5 - 클라이언트 사이드 라우팅

### 스타일링 & UI

- **Tailwind CSS** 4.1.16 - 유틸리티 우선 CSS 프레임워크
- **Shadcn UI** - 접근성을 고려한 재사용 가능한 컴포넌트 (New York 스타일)
- **Radix UI** - 헤드리스 UI 컴포넌트 프리미티브
- **Lucide React** - 아이콘 라이브러리
- **class-variance-authority** - 타입 안전한 컴포넌트 변형 관리

### 코드 품질

- **ESLint** - 코드 린팅
- **Prettier** - 코드 포매팅
- **TypeScript ESLint** - TypeScript 린팅 규칙

## 시작하기

### 필수 요구사항

- **Node.js** 18.0.0 이상
- **pnpm** 8.0.0 이상 (패키지 매니저)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd bzero-web

# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

## 개발 명령어

```bash
# 개발 서버 시작
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드된 앱 미리보기
pnpm preview

# 코드 린팅
pnpm lint

# 린팅 문제 자동 수정
pnpm lint:fix

# 코드 포매팅
pnpm format
```

## 프로젝트 구조

```
bzero-web/
├── public/              # 정적 파일
├── src/
│   ├── assets/         # 이미지, 폰트 등 리소스
│   ├── components/     # React 컴포넌트
│   │   ├── layout/    # 레이아웃 컴포넌트
│   │   └── ui/        # Shadcn UI 컴포넌트
│   ├── lib/           # 유틸리티 함수
│   │   ├── utils.ts   # cn() 등 유틸리티
│   │   └── query-client.ts  # TanStack Query 클라이언트
│   ├── pages/         # 페이지 컴포넌트
│   ├── root-route.tsx # React Router 라우트 정의
│   ├── main.tsx       # 애플리케이션 진입점
│   └── index.css      # 글로벌 스타일 (Tailwind + B0 테마)
├── components.json     # Shadcn UI 설정
├── eslint.config.js    # ESLint 설정
├── prettier.config.js  # Prettier 설정
├── tsconfig.json       # TypeScript 설정
└── vite.config.ts      # Vite 설정
```

## 개발 가이드

### 코드 스타일

이 프로젝트는 일관된 코드 스타일을 위해 ESLint와 Prettier를 사용합니다.

#### 주요 규칙

- **최대 줄 길이**: 120자
- **들여쓰기**: 스페이스 2칸
- **따옴표**: 큰따옴표 사용 (JSX 포함)
- **세미콜론**: 항상 사용
- **Console**: `console.warn`, `console.error`만 허용

#### TypeScript

```typescript
// ✅ Good: Type import 사용
import type {User} from './types';

// ✅ Good: 사용하지 않는 변수는 _ 접두사
const handleClick = (_event: MouseEvent) => { ...
};

// ❌ Bad: any 타입 사용 (경고)
const data: any = fetchData();
```

#### React

```typescript
// ✅ Good: Self-closing 태그
<Component / >

// ✅ Good: React import 불필요 (React 19)
function MyComponent() {
    return <div>Hello < /div>;
}

// ✅ Good: Hooks 규칙 준수
const [state, setState] = useState(0);
```

### Path Alias

`@`를 사용하여 src 디렉토리를 참조할 수 있습니다:

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
```

### Shadcn UI 컴포넌트 추가

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## 테마 시스템

B0 프로젝트는 다크 모드 기반의 커스텀 테마를 사용합니다.

### 브랜드 색상

| 색상 | HEX | 용도 |
|------|-----|------|
| B0 Purple | `#9333EA` | 메인 브랜드 색상 |
| Light Purple | `#C084FC` | 보조 강조 색상 |
| Deep Navy | `#0F0F23` | 배경 색상 |
| Card Navy | `#1A1B3C` | 카드 배경 색상 |

### 도시별 테마 색상

| 도시 | 테마 | 색상 |
|------|------|------|
| 세렌시아 | 관계 | `#F97316` (노을빛 오렌지) |
| 로렌시아 | 회복 | `#22C55E` (숲 초록) |
| 엠마시아 | 희망 | `#84CC16` (밝은 라임) |
| 다마린 | 고요 | `#64748B` (안개 슬레이트) |
| 갈리시아 | 성찰 | `#F59E0B` (황금빛 앰버) |

### 커스텀 유틸리티 클래스

```css
.glass            /* 글래스모피즘 효과 */
.gradient-sunset  /* 노을 그라데이션 */
.gradient-bg      /* 배경 그라데이션 */
.gradient-overlay /* 이미지 오버레이 */
```

## 라우트

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | IndexPage | 홈 페이지 |
| `/onboarding` | OnboardingPage | 온보딩 페이지 |
| `/sign-in` | SignInPage | 로그인 페이지 |
| `/sign-up` | SignUpPage | 회원가입 페이지 |
| `/profile` | ProfilePage | 프로필 페이지 |
