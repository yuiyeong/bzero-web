# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**B0 (비제로) 웹 애플리케이션**은 지하 0층에서 출발하는 비행선을 타고 가상 세계를 여행하며 힐링과 자기성찰을 경험하는 온라인 커뮤니티의 메인 웹앱입니다.

- **기술 스택**: React 19 + TypeScript + Vite + React Router + Zustand + TanStack Query + Tailwind CSS 4 + Shadcn UI
- **패키지 매니저**: pnpm
- **Node.js**: 18.0.0 이상 필요

## 개발 명령어

### 기본 명령어

```bash
# 개발 서버 실행 (http://localhost:5173)
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### 코드 품질

```bash
# 린팅 검사
pnpm lint

# 린팅 문제 자동 수정
pnpm lint:fix

# 코드 포매팅
pnpm format
```

## 코드 스타일 가이드

### 주요 규칙

- **최대 줄 길이**: 120자
- **들여쓰기**: 스페이스 2칸
- **따옴표**: 큰따옴표 (JSX 포함)
- **세미콜론**: 항상 사용
- **Console**: `console.warn`, `console.error`만 허용 (일반 `console.log`는 경고)

### TypeScript

- **Type imports**: `import type { User } from './types'` 형식 사용
- **any 타입**: 가능한 피하기 (경고 발생)
- **사용하지 않는 변수**: `_` 접두사 사용 (예: `_event`)

### React

- **React import 불필요**: React 19에서는 JSX 사용 시 React import 생략 가능
- **Self-closing 태그**: 자식이 없는 컴포넌트는 `<Component />` 형식
- **Hooks 규칙**: 항상 컴포넌트 최상위에서 호출

## 프로젝트 구조

```
src/
├── assets/           # 이미지, 폰트 등 정적 리소스
├── components/       # React 컴포넌트
│   ├── layout/      # 레이아웃 컴포넌트 (MainLayout 등)
│   └── ui/          # Shadcn UI 컴포넌트 (자동 생성)
├── lib/             # 유틸리티 함수
│   ├── utils.ts     # cn() 등 유틸리티
│   └── query-client.ts  # TanStack Query 클라이언트
├── pages/           # 페이지 컴포넌트
│   ├── index-page.tsx       # 홈 페이지
│   ├── onboarding-page.tsx  # 온보딩 페이지
│   ├── sign-in-page.tsx     # 로그인 페이지
│   ├── sign-up-page.tsx     # 회원가입 페이지
│   └── profile-page.tsx     # 프로필 페이지
├── root-route.tsx   # React Router 라우트 정의
├── main.tsx         # 애플리케이션 진입점
└── index.css        # 글로벌 스타일 (Tailwind + B0 테마)
```

### Path Alias

`@`를 사용하여 `src` 디렉토리를 참조:

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

## UI 컴포넌트

### Shadcn UI

- **스타일**: New York
- **Base Color**: Neutral
- **아이콘**: Lucide React
- **추가된 컴포넌트**: alert-dialog, button, dialog, input, sonner, textarea

### 컴포넌트 추가 방법

```bash
# 버튼 컴포넌트 추가
npx shadcn@latest add button

# 카드 컴포넌트 추가
npx shadcn@latest add card

# 여러 컴포넌트 한 번에 추가
npx shadcn@latest add button card dialog
```

추가된 컴포넌트는 `src/components/ui/` 디렉토리에 자동 생성됩니다.

## 라우팅

- **React Router**: `react-router` 사용 (v7+)
- 라우트 정의: `src/root-route.tsx`
- 레이아웃: `MainLayout`으로 공통 헤더/푸터 관리
- 라우트별 타이틀: `handle.title`로 정의

### 현재 라우트

| 경로 | 페이지 | 레이아웃 |
|------|--------|----------|
| `/` | IndexPage (홈) | MainLayout |
| `/onboarding` | OnboardingPage | 없음 |
| `/sign-in` | SignInPage | MainLayout |
| `/sign-up` | SignUpPage | MainLayout |
| `/profile` | ProfilePage | MainLayout |

## 상태 관리 패턴

### 클라이언트 상태

- **Zustand**: 경량 전역 상태 관리 라이브러리
- 사용자 정보, UI 상태 등 클라이언트 상태 관리에 사용

### 서버 상태

- **TanStack Query**: 서버 데이터 페칭, 캐싱, 동기화
- API 호출, 데이터 페칭 및 캐시 관리에 사용
- **DevTools**: 개발 환경에서 활성화

## 테마 시스템

### B0 브랜드 색상 (index.css)

B0 프로젝트의 커스텀 색상 변수들이 정의되어 있습니다:

```css
/* 브랜드 주요 색상 */
--b0-purple: #9333EA      /* 메인 보라색 */
--b0-light-purple: #C084FC /* 밝은 보라색 */
--b0-pink-purple: #F0ABFC  /* 핑크 보라색 */
--b0-deep-navy: #0F0F23    /* 딥 네이비 (배경) */
--b0-card-navy: #1A1B3C    /* 카드 네이비 */

/* 도시별 테마 색상 */
--city-serensia: #F97316   /* 관계, 노을빛 오렌지 */
--city-lorensia: #22C55E   /* 회복, 숲 초록 */
--city-emmasia: #84CC16    /* 희망, 밝은 라임 */
--city-damarin: #64748B    /* 고요, 안개 슬레이트 */
--city-galicia: #F59E0B    /* 성찰, 황금빛 앰버 */
```

### Tailwind 유틸리티 클래스

```css
.glass          /* 글래스모피즘 효과 */
.gradient-sunset /* 노을 그라데이션 (히어로 섹션용) */
.gradient-bg    /* 배경 그라데이션 */
.gradient-overlay /* 이미지 오버레이 그라데이션 */
```

### 다크 모드

- B0 프로젝트는 **다크 모드가 기본**입니다
- `.dark` 클래스로 다크 모드 스타일 적용

## 작업시 반드시 먼저 해야할 일

- 코드를 생성하거나 수정할 때는 기존 코드와 비슷한 형태로 작성할 것

## 커밋 메시지 규칙

아래 prefix 중 하나를 반드시 사용:

- `feat:` 기능 개발 관련
- `fix:` 오류 개선 혹은 버그 패치
- `docs:` 문서화 작업
- `test:` 테스트 관련
- `conf:` 환경설정 관련
- `build:` 빌드 작업 관련
- `ci:` Continuous Integration 관련
- `chore:` 패키지 매니저, 스크립트 등
- `style:` 코드 포매팅 관련

커밋 제목은 구나 절의 형태로 작성하기.

### 핵심 개념

1. **B0 (지하 0층)**: 비행선 터미널 - 여러 이세계 도시로 가는 출발점
2. **5개 도시**: 세렌시아(관계), 로렌시아(회복), 엠마시아(희망), 다마린(고요), 갈리시아(성찰)
3. **게스트하우스**:
   - **혼합형**: AI 호스트가 이벤트 진행 (불멍, 별멍 등), 최대 6명/룸
   - **조용한 방**: 개인 대화와 자기성찰 중심
4. **라운지**: 1:1 대화 공간
5. **개인 숙소**: 일기 작성(50P), 문답지 작성(50P)

## 참고 문서

프로젝트 루트의 `../docs/` 디렉토리에는 다음 문서들이 있습니다:

- **00-concept.md**: 프로젝트 컨셉, 핵심 아이디어, 타겟 사용자 등 기획 문서
- **01-mvp.md**: MVP 개발 로드맵, 기능 명세, 상세 요구사항
- **02-design-system.md**: 디자인 시스템 (색상, 타이포, 컴포넌트)
- **03-screens.md**: 화면 명세서 (와이어프레임)

기능 구현 시 반드시 해당 문서를 참고하여 프로젝트 컨셉과 요구사항에 맞게 개발해야 합니다.

## 페이지 네이밍 컨벤션

- 페이지 컴포넌트 파일명: `kebab-case` + `-page.tsx` (예: `sign-in-page.tsx`)
- 페이지 컴포넌트 이름: `PascalCase` + `Page` (예: `SignInPage`)
- 라우트 핸들에 `title` 속성으로 페이지 제목 설정
