# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**B0(비제로)**는 지하 0층에서 출발하는 비행선을 타고 이세계를 여행하며, 게스트하우스에서 사람들을 만나고 자기성찰을 하는 온라인 커뮤니티 서비스입니다.

### 핵심 컨셉

- **지하 0층**: 신비한 핸드폰 앱을 통해 접근하는 숨겨진 공간
- **비행선 터미널**: 6개의 테마별 도시로 가는 비행선이 출발하는 장소
- **게스트하우스**: 혼합형(이벤트 중심)과 조용한 방(자기성찰 중심) 두 가지 타입
- **라운지**: 1:1 대화 공간
- **AI 호스트**: 대화를 이끌고 이벤트를 진행

## 기술 스택

- **프레임워크**: React 19.1.1 + Vite 7.1.7
- **라우팅**: React Router 7.9.5
- **상태관리**: Zustand 5.0.8
- **서버 상태**: TanStack Query 5.90.6
- **스타일링**: Tailwind CSS 4.1.16
- **UI 컴포넌트**: Radix UI + Shadcn UI (New York 스타일)
- **아이콘**: Lucide React
- **언어**: TypeScript 5.9.3

## 개발 명령어

### 개발 서버

```bash
pnpm dev
```

### 빌드

```bash
pnpm build
```

빌드 과정: TypeScript 컴파일 (`tsc -b`) → Vite 빌드

### 린팅 및 포매팅

```bash
# ESLint 검사
pnpm lint

# ESLint 자동 수정
pnpm lint:fix

# Prettier 포매팅
pnpm format
```

### 프리뷰

```bash
pnpm preview
```

## 프로젝트 구조

```
src/
├── assets/         # 정적 리소스 (이미지, 폰트 등)
├── components/     # React 컴포넌트
│   └── ui/        # Shadcn UI 컴포넌트들이 위치할 디렉토리
├── lib/           # 유틸리티 함수 (utils.ts 등)
├── App.tsx        # 메인 앱 컴포넌트
├── main.tsx       # 애플리케이션 진입점
└── index.css      # 글로벌 스타일 (Tailwind 설정 포함)
```

## 코드 스타일 규칙

### TypeScript

- 사용하지 않는 변수/인자는 `_`로 시작 (예: `_unused`)
- `any` 타입 사용 시 경고 발생
- Type import는 `type` 키워드 사용 권장: `import type { Foo } from './foo'`

### React

- React 17+ 스타일 (jsx-runtime 사용, import React 불필요)
- 컴포넌트는 대문자로 시작
- Self-closing 태그 권장: `<Component />`
- React Hooks 규칙 준수

### 포매팅

- 최대 줄 길이: 120자
- 들여쓰기: 스페이스 2칸
- 세미콜론 사용
- JSX는 큰따옴표, 일반 코드는 큰따옴표 사용
- Trailing comma: ES5 스타일
- Tailwind 클래스는 자동 정렬됨

### Console

- `console.log` 사용 금지 (경고)
- `console.warn`, `console.error`만 허용

## Path Alias

`@`를 사용하여 src 디렉토리 참조:

```typescript
import {cn} from '@/lib/utils';
import Button from '@/components/ui/button';
```

## Shadcn UI 컴포넌트

- 스타일: New York
- 베이스 컬러: Neutral
- CSS Variables 사용
- 아이콘: Lucide React
- 컴포넌트 경로: `@/components/ui`
- 유틸 함수: `@/lib/utils`

## 주의사항

- 이 프로젝트는 초기 단계로, 현재는 기본 구조만 구축되어 있음
- 향후 추가될 기능: 라우팅 구조, 상태관리 패턴, API 통신 로직, 인증/권한 시스템
- pnpm을 패키지 매니저로 사용
