# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**B0 (비제로) 웹 애플리케이션**은 지하 0층에서 출발하는 비행선을 타고 가상 세계를 여행하며 힐링과 자기성찰을 경험하는 온라인 커뮤니티의 메인 웹앱입니다.

- **기술 스택**: React 19 + TypeScript + Vite + Zustand + TanStack Query + Tailwind CSS + Shadcn UI
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
├── assets/         # 이미지, 폰트 등 정적 리소스
├── components/     # React 컴포넌트
│   └── ui/        # Shadcn UI 컴포넌트 (자동 생성)
├── lib/           # 유틸리티 함수 (utils.ts 등)
├── App.tsx        # 루트 컴포넌트
├── main.tsx       # 애플리케이션 진입점
└── index.css      # 글로벌 스타일 (Tailwind)
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

## 상태 관리 패턴

### 클라이언트 상태

- **Zustand**: 경량 전역 상태 관리 라이브러리
- 사용자 정보, UI 상태 등 클라이언트 상태 관리에 사용

### 서버 상태

- **TanStack Query**: 서버 데이터 페칭, 캐싱, 동기화
- API 호출, 데이터 페칭 및 캐시 관리에 사용
- **DevTools**: 개발 환경에서 활성화

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
2. **6개 도시**: 세렌시아(관계), 로렌시아(회복), 에테리아(사랑), 드리모스(꿈), 셀레니아(성찰), 아벤투라(모험)
3. **게스트하우스**:
   - **혼합형**: AI 호스트가 이벤트 진행 (불멍, 별멍 등), 최대 6명/룸
   - **조용한 방**: 개인 대화와 자기성찰 중심
4. **라운지**: 1:1 대화 공간
5. **개인 숙소**: 일기 작성(50P), 문답지 작성(50P)

## 참고 문서

프로젝트 루트의 `../docs/` 디렉토리에는 다음 문서들이 있습니다:

- **00-concept.md**: 프로젝트 컨셉, 핵심 아이디어, 타겟 사용자 등 기획 문서
- **01-mvp.md**: MVP 개발 로드맵, 기능 명세, 상세 요구사항

기능 구현 시 반드시 해당 문서를 참고하여 프로젝트 컨셉과 요구사항에 맞게 개발해야 합니다.
