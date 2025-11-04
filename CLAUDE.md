# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**B0 (비제로)**는 지하 0층에서 출발하는 비행선을 타고 이세계를 여행하며, 게스트하우스에서 사람들을 만나고 자기성찰을 하는 온라인 커뮤니티 서비스입니다. 현재 프로젝트는 초기 단계로, MVP 개발을 진행
중입니다.

### 핵심 가치와 목표

- **빠른 실험**: 기능을 빠르게 추가하고 제거하며 사용자 반응에 따라 조정할 수 있는 유연한 구조 유지
- **가설 검증**: 여행/게스트하우스 컨셉이 깊이 있는 대화를 유도하고 몰입감을 주는지 데이터로 확인
- **실제 사용 가능한 서비스**: 20-30대 직장인이 실제로 사용할 수 있는 완성도 있는 서비스 구축

자세한 컨셉은 `docs/concept.md` 참조

## 개발 환경 및 명령어

### 필수 요구사항

- Node.js 18.x 이상
- pnpm (패키지 매니저)

### 주요 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:5173)
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview

# 린팅
pnpm lint          # ESLint 검사
pnpm lint:fix      # ESLint 자동 수정

# 포맷팅
pnpm format        # Prettier 적용
```

## 기술 스택 및 아키텍처

### 핵심 기술

- **React 19.1.1** - 최신 React 기능 활용
- **TypeScript** - 엄격한 타입 체크 (`strict: true`)
- **Vite** - 빌드 도구
- **Tailwind CSS 4** - 유틸리티 퍼스트 스타일링
- **React Router 7** - 라우팅
- **Zustand** - 전역 상태 관리 (경량)
- **TanStack Query** - 서버 상태 관리 및 데이터 페칭

### UI 컴포넌트 시스템

프로젝트는 **shadcn/ui**를 사용합니다:

- 스타일: `new-york` 스타일
- 컴포넌트는 `src/components/ui/`에 위치
- 아이콘: Lucide React
- 테마: CSS Variables 기반 (`neutral` base color)
- shadcn CLI를 통해 필요한 컴포넌트 추가 가능

### Path Alias

모든 import는 `@` 별칭을 사용하여 절대 경로로 작성:

```typescript
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {useStore} from '@/hooks/useStore'
```

설정된 alias:

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/ui` → `src/components/ui`
- `@/utils` → `src/lib/utils`

## 코드 작성 가이드

### TypeScript

- **strict mode** 활성화: `noUnusedLocals`, `noUnusedParameters` 포함
- 명시적 `any` 사용은 경고 표시
- Type imports는 `type` 키워드 사용 권장: `import type { Props } from './types'`
- 미사용 변수는 `_`로 prefix (예: `_unused`)

### React 컴포넌트

- React 19 기능 활용 (automatic JSX runtime, 새로운 hooks 등)
- 함수형 컴포넌트 사용
- Props는 TypeScript interface로 명시
- React hooks 규칙 준수 (ESLint가 자동 검사)
- Fast Refresh를 위해 컴포넌트는 named export 또는 default export 사용

### 상태 관리 전략

1. **로컬 상태**: React hooks (`useState`, `useReducer`)
2. **전역 상태**: Zustand - UI 상태, 사용자 설정 등
3. **서버 상태**: TanStack Query - API 데이터, 캐싱, 동기화

### 스타일링

- **Tailwind CSS** 사용
- Prettier plugin이 Tailwind 클래스를 자동 정렬
- `cn()` 유틸리티 함수로 조건부 클래스 병합:
  ```typescript
  import { cn } from '@/lib/utils'

  <div className={cn("base-class", condition && "conditional-class")} />
  ```
- CSS 파일은 필요시에만 사용 (글로벌 스타일, 애니메이션 등)

### 코드 스타일

#### ESLint 규칙

- `no-console`: `console.log` 사용 금지 (`console.warn`, `console.error`는 허용)
- React component는 JSX 파일 최상위에서만 export (Fast Refresh)
- 자체 닫힘 태그 사용 권장: `<Component />`

#### Prettier 설정

- 줄 길이: 120자
- 세미콜론: 사용
- 따옴표: 큰따옴표 (JSX 포함)
- Trailing comma: ES5 스타일
- 화살표 함수 파라미터: 항상 괄호 사용

## 프로젝트 구조 원칙

### 디렉토리 구조

```
src/
├── components/      # 재사용 가능한 컴포넌트
│   └── ui/         # shadcn/ui 컴포넌트
├── lib/            # 유틸리티 함수, 헬퍼
├── hooks/          # 커스텀 React hooks
├── pages/          # 페이지 컴포넌트 (라우트별)
├── stores/         # Zustand 스토어
├── api/            # API 클라이언트, TanStack Query hooks
└── types/          # TypeScript 타입 정의
```

### 컴포넌트 구성

- **Atomic Design** 개념 참고 (엄격하게 따르지는 않음)
- 재사용 가능한 UI 컴포넌트는 `components/` 또는 `components/ui/`
- 비즈니스 로직이 포함된 컴포넌트는 도메인별로 구조화
- 페이지 레벨 컴포넌트는 `pages/`에 위치

## 특별히 주의할 사항

### UTF-8 인코딩

모든 파일은 **UTF-8 인코딩**을 사용합니다. 새 파일 생성 시 반드시 UTF-8로 저장하세요.

### 언어

- 코드: 영어 (변수명, 함수명, 주석)
- 문서 (README, 주석): 한국어 가능
- UI 텍스트: 한국어 (타겟 사용자가 한국인)

### 빠른 반복을 위한 원칙

1. **Feature Flags**: 기능을 쉽게 켜고 끌 수 있도록 설계
2. **모듈화**: 기능을 독립적으로 추가/제거 가능하게 구성
3. **데이터 수집**: 사용자 행동 분석을 위한 이벤트 로깅 고려

### 성능 고려사항

- TanStack Query의 캐싱 전략 활용
- React.memo, useMemo, useCallback 필요시 사용 (과도한 최적화 지양)
- 코드 스플리팅: React Router의 lazy loading 활용

## 워크플로우

### 새 기능 개발

1. 필요한 shadcn/ui 컴포넌트가 있다면 먼저 추가
2. 타입 정의 (`types/`)
3. API 클라이언트 작성 (`api/`)
4. 컴포넌트 구현 (`components/` 또는 `pages/`)
5. 상태 관리 추가 (필요시)
6. 린트 및 포맷팅 확인

### 코드 품질 체크

커밋 전:

```bash
pnpm lint:fix  # 자동 수정 가능한 린트 오류 수정
pnpm format    # 코드 포맷팅
pnpm build     # 빌드 확인
```

## 참고 문서

- **프로젝트 컨셉**: `docs/concept.md`
- **README**: 프로젝트 소개 및 시작 가이드
- **shadcn/ui**: https://ui.shadcn.com
- **TanStack Query**: https://tanstack.com/query
- **Zustand**: https://zustand-demo.pmnd.rs
