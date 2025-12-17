# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**B0 (비제로) 웹 애플리케이션**은 지하 0층에서 출발하는 비행선을 타고 가상 세계를 여행하며 힐링과 자기성찰을 경험하는 온라인 커뮤니티의 메인 웹앱입니다.

- **기술 스택**: React 19 + TypeScript + Vite + React Router + Zustand + TanStack Query + Tailwind CSS 4 + Shadcn UI
- **인증**: Supabase Auth
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
- **Import 확장자**: 로컬 파일 import 시 `.ts` 또는 `.tsx` 확장자 명시 (예: `@/types.ts`, `@/components/ui/button.tsx`)

### React

- **React import 불필요**: React 19에서는 JSX 사용 시 React import 생략 가능
- **Self-closing 태그**: 자식이 없는 컴포넌트는 `<Component />` 형식
- **Hooks 규칙**: 항상 컴포넌트 최상위에서 호출

### Import 순서

import 문은 다음 순서로 그룹화 (빈 줄로 구분하지 않음):

1. UI 컴포넌트 (`@/components/ui/`)
2. 커스텀 컴포넌트 (`@/components/`)
3. React 및 외부 라이브러리 (`react`, `react-router`, `sonner` 등)
4. 커스텀 훅 (`@/hooks/`)
5. 유틸리티/타입 (`@/lib/`, `@/types.ts`)
6. 스토어 (`@/stores/`)
7. 에셋 (`@/assets/`)

```typescript
// 좋은 예
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { EmojiPicker } from "@/components/emoji-picker.tsx";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useUpdateMe } from "@/hooks/mutations/use-update-me.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/routes.ts";
```

### 컴포넌트 내부 구조 순서

컴포넌트 내부 코드는 다음 순서로 작성:

1. **상태 선언** (`useState`)
2. **라우터 훅** (`useNavigate`, `useLocation` 등)
3. **커스텀 훅** (mutation, query 훅 등)
4. **useEffect**
5. **유효성 검사 함수** (`validate...`)
6. **이벤트 핸들러** (`handle...`)
7. **return (JSX)**

```typescript
export default function ProfileCompletionPage() {
  // 1. 상태 선언
  const [nickname, setNickname] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌟");

  // 2. 라우터 훅
  const navigate = useNavigate();

  // 3. 커스텀 훅
  const { mutate: updateMe, isPending } = useUpdateMe({
    onSuccess: () => navigate(ROUTES.HOME, { replace: true }),
    onError: (error: B0ApiError) => toast.error(error.message),
  });

  // 4. useEffect (필요한 경우)

  // 5. 유효성 검사 함수
  const validateNickname = (value: string): string | null => {
    // ...
  };

  // 6. 이벤트 핸들러
  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // ...
  };

  // 7. return (JSX)
  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

## 프로젝트 구조

```
src/
├── api/              # 백엔드 API 함수 (도메인별 분리)
│   ├── auth.ts       # Supabase 인증 API 함수
│   └── users.ts      # 사용자 관련 API 함수
├── assets/           # 이미지, 폰트 등 정적 리소스
│   └── images/       # 이미지 파일
├── components/       # React 컴포넌트
│   ├── guards/       # 라우트 가드 컴포넌트 (AuthGuard, GuestGuard 등)
│   ├── layout/       # 레이아웃 컴포넌트 (MainLayout 등)
│   ├── onboarding/   # 온보딩 관련 컴포넌트
│   ├── terminal/     # B0 터미널 관련 컴포넌트 (도시 카드, 터미널 헤더 등)
│   ├── booking/      # 티켓 예매 관련 컴포넌트 (비행선 선택, 결제 요약 등)
│   └── ui/           # Shadcn UI 컴포넌트 (자동 생성)
├── hooks/            # 커스텀 훅
│   ├── mutations/    # TanStack Query mutation 훅
│   └── queries/      # TanStack Query query 훅
├── lib/              # 유틸리티 함수 및 설정
│   ├── api-client.ts # Axios 인스턴스 (인터셉터 포함)
│   ├── api-errors.ts # 에러 처리 유틸리티
│   ├── errors.ts     # Supabase 인증 에러 메시지 매핑
│   ├── query-client.ts # TanStack Query 클라이언트 및 queryKeys
│   ├── routes.ts     # 라우트 경로 상수
│   ├── supabase.ts   # Supabase 클라이언트
│   └── utils.ts      # cn() 등 유틸리티
├── pages/            # 페이지 컴포넌트
├── providers/        # 컨텍스트 프로바이더
│   └── auth-session-provider.tsx  # Supabase 인증 세션 관리
├── stores/           # Zustand 스토어
│   ├── auth-store.ts      # 인증 상태 관리
│   └── onboarding-store.ts # 온보딩 상태 관리
├── types.ts          # 공통 타입 정의
├── App.tsx           # 앱 루트 컴포넌트
├── root-route.tsx    # React Router 라우트 정의
├── main.tsx          # 애플리케이션 진입점
└── index.css         # 글로벌 스타일 (Tailwind + B0 테마)
```

### Path Alias

`@`를 사용하여 `src` 디렉토리를 참조:

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

## 아키텍처 패턴

### API 레이어 패턴

API 호출은 `src/api/` 디렉토리에 도메인별로 분리하여 관리:

```typescript
// src/api/users.ts
import type { DataResponse, User } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 현재 로그인한 사용자 정보 조회
 *
 * @throws {B0ApiError} NOT_FOUND_USER - 백엔드에 사용자가 존재하지 않는 경우
 */
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<DataResponse<User>>("/users/me");
  return data.data;
}
```

**규칙:**

- 함수 상단에 JSDoc 주석 작성 (설명, @throws 등)
- `apiClient` 인스턴스 사용 (자동으로 인증 토큰 첨부)
- **단일 데이터 반환**: `DataResponse<T>` 타입 사용 → `data.data` 추출하여 반환
- **목록 데이터 반환**: `ListResponse<T>` 타입 사용 → `data` 직접 반환 (pagination 정보 포함)
- Supabase 인증 API는 `src/api/auth.ts`에서 별도 관리

```typescript
// 단일 데이터 조회 예시
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<DataResponse<User>>("/users/me");
  return data.data; // DataResponse에서 data 추출
}

// 목록 데이터 조회 예시
export async function getActiveCities(offset = 0, limit = 20): Promise<ListResponse<City>> {
  const { data } = await apiClient.get<ListResponse<City>>("/cities", {
    params: { offset, limit },
  });
  return data; // ListResponse 전체 반환 (list + pagination)
}
```

### queryKeys 구조 (`src/lib/query-client.ts`)

TanStack Query의 쿼리 키는 도메인별로 그룹화하여 관리:

```typescript
export const queryKeys = {
  me: {
    all: ["user"],
    detail: ["user", "me"],
  },
  cities: {
    all: ["cities"],
    active: ["cities", "active"],
    detail: (cityId: string) => ["cities", cityId],
  },
  airships: {
    all: ["airships"],
  },
} as const;
```

**규칙:**

- 도메인별로 객체 그룹화 (`me`, `cities`, `airships` 등)
- `all`: 해당 도메인의 기본/전체 목록용 키
- `active`, `detail` 등: 특정 조건의 목록이나 상세 조회용 키
- 파라미터가 필요한 경우 함수로 정의 (예: `detail: (cityId: string) => [...]`)
- `as const`로 타입 안전성 확보

### TanStack Query 훅 패턴

#### Query 훅 (`src/hooks/queries/`)

```typescript
// src/hooks/queries/use-me.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMe } from "@/api/users.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { User } from "@/types.ts";

/**
 * 현재 로그인한 사용자 정보를 조회하는 쿼리 훅
 *
 * - retry: false로 설정하여 NOT_FOUND_USER 에러 시 재시도하지 않음
 * - AuthGuard에서 사용자 존재 여부 확인에 활용
 */
export function useMe(): UseQueryResult<User, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.me.detail,
    queryFn: getMe,
    retry: false,
  });
}
```

**규칙:**

- 파일명: `use-{도메인}.ts` (예: `use-me.ts`) 또는 `use-{형용사}-{도메인}.ts` (예: `use-active-cities.ts`)
- 함수명: `use{도메인}` (예: `useMe`) 또는 `use{형용사}{도메인}` (예: `useActiveCities`)
- **반환 타입 명시**: `UseQueryResult<T, B0ApiError>` 형태로 명시
- JSDoc 주석으로 훅의 용도와 특이사항 설명
- `queryKeys` 객체에서 쿼리 키 관리
- **옵션이 필요한 경우**: `Use{도메인}Options` 인터페이스 정의

```typescript
// 옵션이 있는 Query 훅 예시
interface UseCityOptions {
  enabled?: boolean;
}

export function useCity(cityId: string | undefined, options?: UseCityOptions): UseQueryResult<City, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.cities.detail(cityId || ""),
    queryFn: () => getCityById(cityId!),
    enabled: options?.enabled !== false && !!cityId,
  });
}

// 목록 조회 Query 훅 예시
export function useActiveCities(offset = 0, limit = 20): UseQueryResult<ListResponse<City>, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.cities.active,
    queryFn: () => getActiveCities(offset, limit),
  });
}
```

#### Mutation 훅 (`src/hooks/mutations/`)

```typescript
// src/hooks/mutations/use-update-me.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/api/users.ts";
import type { UseMutationCallback, User } from "@/types.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";

/**
 * 사용자 정보 업데이트 mutation 훅
 *
 * 프로필 완성 페이지에서 닉네임, 이모지 설정 시 사용
 * 성공 시 캐시된 사용자 정보를 자동으로 업데이트
 */
export function useUpdateMe(callback?: UseMutationCallback<User, B0ApiError>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data: User) => {
      // 캐시된 사용자 정보 업데이트 (refetch 없이 즉시 반영)
      queryClient.setQueryData(queryKeys.me.detail, () => data);
      callback?.onSuccess?.(data);
    },
    onError: (error: B0ApiError) => {
      console.error(error);
      callback?.onError?.(error);
    },
  });
}
```

**규칙:**

- 파일명: `use-{동작}-{도메인}.ts` (예: `use-update-me.ts`, `use-sign-up.ts`)
- 함수명: `use{동작}{도메인}` (예: `useUpdateMe`, `useSignUp`)
- 콜백 타입: `UseMutationCallback<TData, TError>` 사용
- 성공 시 관련 쿼리 캐시 업데이트
- 에러는 `console.error`로 로깅 후 콜백 호출

### Zustand 스토어 패턴

```typescript
// src/stores/auth-store.ts
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { type Session } from "@supabase/supabase-js";

/**
 * 인증 상태 인터페이스
 */
interface AuthState {
  /** Supabase 세션 로드 완료 여부 */
  isLoaded: boolean;
  /** Supabase 인증 세션 (null이면 비로그인 상태) */
  session: Session | null;
}

interface AuthActions {
  actions: {
    setSession: (session: Session | null) => void;
  };
}

const initialState: AuthState = {
  isLoaded: false,
  session: null,
};

export const useAuthStore = create(
  devtools(
    combine(initialState, (set) => {
      const authActions: AuthActions = {
        actions: {
          setSession: (session: Session | null): void => {
            set({ isLoaded: true, session });
          },
        },
      };
      return authActions;
    }),
    {
      name: "authStore",
      enabled: import.meta.env.DEV,
    }
  )
);

// 개별 셀렉터 훅 (상태 분리로 불필요한 리렌더링 방지)
export const useAuthSession = () => useAuthStore((store) => store.session);
export const useAuthIsLoaded = () => useAuthStore((store) => store.isLoaded);
export const useSetAuthSession = () => useAuthStore((store) => store.actions.setSession);
```

**규칙:**

- 파일명: `{도메인}-store.ts` (예: `auth-store.ts`)
- 스토어 이름: `use{도메인}Store` (예: `useAuthStore`)
- `State`와 `Actions` 인터페이스 분리 정의
- `combine` 미들웨어로 상태와 액션 결합
- `devtools` 미들웨어 사용 (개발 환경에서만 활성화)
- 영속성 필요 시 `persist` 미들웨어 추가
- 복잡한 상태 업데이트 시 `immer` 미들웨어 사용
- **개별 셀렉터 훅 제공**: 상태별로 분리된 훅을 export하여 불필요한 리렌더링 방지

**미들웨어 조합 순서:**

```typescript
// 기본 (devtools + combine)
create(devtools(combine(initialState, (set) => ({ actions: { ... } }))))

// 영속성 필요 시 (devtools + persist + combine)
create(devtools(persist(combine(initialState, (set) => ({ ... })), { name: "storeName" })))

// immer 사용 시 (devtools + persist + immer + combine)
create(devtools(persist(immer(combine(initialState, (set) => ({ ... }))))))
```

### 라우트 가드 패턴

라우트 보호를 위한 가드 컴포넌트 (`src/components/guards/`):

```typescript
// src/components/guards/auth-guard.tsx
/**
 * 인증된 사용자만 접근할 수 있는 라우트를 보호하는 가드 컴포넌트
 *
 * 처리 흐름:
 * 1. Supabase 세션이 없으면 → 로그인 페이지로 리다이렉트
 * 2. 세션은 있지만 백엔드 User가 없으면 → 자동으로 User 생성 (최초 로그인 시)
 * 3. 프로필이 미완성이면 → 프로필 완성 페이지로 리다이렉트
 * 4. 모든 조건 통과 시 → 자식 라우트 렌더링
 */
export default function AuthGuard() {
  // ... 구현
  return <Outlet />;
}
```

**가드 종류:**

- `AuthGuard`: 인증된 사용자만 접근 가능
- `GuestGuard`: 비인증 사용자(게스트)만 접근 가능
- `OnboardingGuard`: 온보딩 완료된 사용자만 접근 가능

**규칙:**

- 파일명: `{역할}-guard.tsx` (예: `auth-guard.tsx`)
- JSDoc으로 처리 흐름 문서화
- `Navigate`로 리다이렉트, `Outlet`으로 자식 라우트 렌더링
- 로딩 중에는 `GlobalLoader` 표시

### 프로바이더 패턴

앱 전역 상태/기능 제공 (`src/providers/`):

```typescript
// src/providers/auth-session-provider.tsx
/**
 * Supabase 인증 세션을 관리하는 Provider 컴포넌트
 *
 * 앱 최상단에서 Supabase 인증 상태 변화를 구독하고,
 * 세션 정보를 Zustand 스토어에 동기화함
 */
export default function AuthSessionProvider({ children }: { children: ReactNode }) {
  // ... 구현
  return children;
}
```

**규칙:**

- 파일명: `{기능}-provider.tsx`
- JSDoc으로 역할 설명
- 초기 로드 완료 전까지 `GlobalLoader` 표시

### 에러 처리 패턴

#### 백엔드 API 에러 (`src/lib/api-errors.ts`)

```typescript
// 에러 코드 상수 (백엔드와 동일하게 유지)
export const ErrorCode = {
  NOT_FOUND_USER: "NOT_FOUND_USER",
  // ...
} as const;

// 커스텀 에러 클래스
export class B0ApiError extends Error {
  code: string;
  statusCode: number;
  // ...
}

// Axios 에러를 B0ApiError로 변환
export function parseApiError(error: unknown): B0ApiError { ... }
```

#### Supabase 인증 에러 (`src/lib/errors.ts`)

```typescript
// 에러 코드 → 한국어 메시지 매핑
const AUTH_ERROR_MESSAGE_MAP: Record<string, string> = {
  email_exists: "이미 사용 중인 이메일입니다.",
  // ...
};

export function generateAuthErrorMessage(error: Error): string { ... }
```

### 페이지 컴포넌트 패턴

```typescript
// src/pages/sign-in-page.tsx
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { mutate: signInWithPassword, isPending } = useSignInWithPassword({
    onSuccess: () => navigate(ROUTES.HOME, { replace: true }),
    onError: (e: AuthError) => {
      if (e.code === "email_not_confirmed") {
        navigate(ROUTES.EMAIL_VERIFICATION, { replace: true });
      } else {
        toast.error(generateAuthErrorMessage(e));
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 유효성 검사
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    signInWithPassword({ email, password });
  };

  return (
    <form className="flex h-full flex-col py-8" onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

**규칙:**

- mutation 훅에서 `onSuccess`/`onError` 콜백으로 네비게이션 및 에러 처리
- 폼 제출 전 클라이언트 유효성 검사
- 에러 메시지는 `toast.error()`로 표시
- `isPending` 상태로 입력 필드 및 버튼 비활성화

### 로딩/에러 상태 처리 패턴

페이지에서 여러 Query를 사용할 때의 로딩/에러 상태 통합 처리:

```typescript
export default function TerminalPage() {
  const { data: cityListData, isLoading: isCitiesLoading, isError: isCitiesError } = useActiveCities();
  const { data: airshipListData, isLoading: isAirshipsLoading, isError: isAirshipsError } = useAirships();

  // 로딩/에러 상태 통합
  const isLoading = isCitiesLoading || isAirshipsLoading;
  const isError = isCitiesError || isAirshipsError;

  // 데이터 추출 (기본값 제공)
  const cities = cityListData?.list ?? [];
  const airships = airshipListData?.list ?? [];

  return (
    <CityList cities={cities} isLoading={isLoading} isError={isError} />
  );
}
```

**리스트 컴포넌트에서 로딩/에러 처리:**

```typescript
interface CityListProps {
  cities: City[];
  isLoading: boolean;
  isError: boolean;
}

export function CityList({ cities, isLoading, isError }: CityListProps) {
  if (isLoading) {
    return <div className="text-zinc-400">로딩 중...</div>;
  }

  if (isError) {
    return <div className="text-red-400">도시 목록을 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {cities.map((city) => <CityCard key={city.city_id} city={city} />)}
    </div>
  );
}
```

## UI 컴포넌트

### Shadcn UI

- **스타일**: New York
- **Base Color**: Neutral
- **아이콘**: Lucide React
- **추가된 컴포넌트**: alert-dialog, button, carousel, dialog, input, label, sonner, textarea

### 컴포넌트 추가 방법

```bash
npx shadcn@latest add button card dialog
```

추가된 컴포넌트는 `src/components/ui/` 디렉토리에 자동 생성됩니다.

### 커스텀 컴포넌트 패턴

```typescript
// src/components/emoji-picker.tsx
interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  disabled?: boolean;
}

export function EmojiPicker({ value, onChange, disabled }: EmojiPickerProps) {
  return (
    <div className="...">
      {PROFILE_EMOJIS.map((emoji) => (
        <Button
          key={emoji}
          type="button"
          variant="ghost"
          onClick={() => onChange(emoji)}
          disabled={disabled}
          className={cn("...", value === emoji && "...")}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}
```

**규칙:**

- Props 인터페이스 정의
- `cn()` 유틸리티로 조건부 클래스 적용
- `disabled` prop 지원

### 도메인별 컴포넌트 폴더 구조

관련 컴포넌트들은 도메인별 폴더로 그룹화:

```
src/components/
├── terminal/           # B0 터미널 관련
│   ├── terminal-header.tsx
│   ├── terminal-title.tsx
│   ├── terminal-info.tsx
│   ├── city-card.tsx
│   └── city-list.tsx
├── booking/            # 티켓 예매 관련
│   ├── city-info.tsx
│   ├── airship-selector.tsx
│   ├── payment-summary.tsx
│   └── purchase-button.tsx
├── onboarding/         # 온보딩 관련
│   ├── onboarding-slide.tsx
│   ├── onboarding-slide-00.tsx
│   └── ...
└── guards/             # 라우트 가드
    ├── auth-guard.tsx
    ├── guest-guard.tsx
    └── onboarding-guard.tsx
```

**도메인 폴더 생성 기준:**

- 특정 페이지나 기능에서만 사용되는 컴포넌트가 3개 이상일 때
- 페이지명 또는 기능명을 폴더명으로 사용 (예: `terminal`, `booking`)
- 폴더 내 컴포넌트는 해당 도메인의 페이지에서만 사용

**공통 컴포넌트 위치:**

- 여러 페이지에서 사용되는 컴포넌트: `src/components/` 루트에 배치
- 예: `global-loader.tsx`, `emoji-picker.tsx`, `email-status-message.tsx`

### 이미지 표시 (URL 기반)

URL을 통해 이미지를 표시할 때는 반드시 `ImageWithSkeleton` 컴포넌트를 사용:

```typescript
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton.tsx";

// 기본 사용
<ImageWithSkeleton
  src={imageUrl}
  alt="설명"
  className="h-12 w-12 rounded-xl"
/>

// fallback 지정 (이미지 로드 실패 시 표시)
<ImageWithSkeleton
  src={imageUrl}
  alt="설명"
  className="h-12 w-12 rounded-xl"
  fallback={<span className="text-2xl">🏙️</span>}
/>
```

**ImageWithSkeleton 특징:**

- 로딩 중: Skeleton 애니메이션 표시
- 로딩 완료: 이미지 표시
- 로드 실패: fallback 표시 (없으면 빈 상태)

**규칙:**

- URL 기반 이미지는 항상 `ImageWithSkeleton` 사용 (일반 `<img>` 태그 사용 금지)
- `className`에 크기와 둥글기 지정
- 로드 실패 시 대체 UI가 필요하면 `fallback` prop 사용

## 라우팅

- **React Router**: `react-router` 사용 (v7+)
- 라우트 정의: `src/root-route.tsx`
- 라우트 경로 상수: `src/lib/routes.ts`
- 레이아웃: `MainLayout`으로 공통 헤더 관리
- 라우트 핸들: `title`과 `isRoot` 속성 정의

### 중첩 라우트 구조

라우트는 Guard → Layout → 페이지 순서로 중첩:

```typescript
{
  element: <OnboardingGuard />,  // 최상위 가드
  children: [
    {
      element: <MainLayout />,   // 레이아웃
      children: [
        {
          element: <GuestGuard />,  // 접근 제어 가드
          children: [
            { path: ROUTES.AUTH, element: <AuthPage /> },
            { path: ROUTES.SIGN_IN, element: <SignInPage /> },
          ],
        },
        {
          element: <AuthGuard />,   // 인증 가드
          children: [
            { path: ROUTES.HOME, element: <IndexPage /> },
            { path: ROUTES.TERMINAL, element: <TerminalPage /> },
          ],
        },
      ],
    },
  ],
}
```

**가드 적용 순서:**

1. `OnboardingGuard`: 온보딩 완료 여부 확인
2. `GuestGuard` 또는 `AuthGuard`: 인증 상태에 따른 접근 제어

### 라우트 경로 상수

```typescript
// src/lib/routes.ts
export const ROUTES = {
  HOME: "/",
  ONBOARDING: "/onboarding",
  AUTH: "/auth",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  EMAIL_VERIFICATION: "/auth/email-verification",
  EMAIL_CONFIRMED: "/auth/email-confirmed",
  PROFILE_COMPLETION: "/profile-completion",
  TERMINAL: "/terminal",
  TICKET_BOOKING: "/terminal/booking/:cityId",
} as const;
```

**규칙:**

- 모든 라우트 경로는 `ROUTES` 상수에서 관리
- 새 라우트 추가 시 `ROUTES`에 먼저 정의

### 현재 라우트 구조

| 경로                        | 페이지                | 가드       | 설명                             |
| --------------------------- | --------------------- | ---------- | -------------------------------- |
| `/onboarding`               | OnboardingPage        | 없음       | 온보딩 페이지                    |
| `/auth`                     | AuthPage              | GuestGuard | 인증 시작 (로그인/회원가입 선택) |
| `/auth/sign-in`             | SignInPage            | GuestGuard | 로그인                           |
| `/auth/sign-up`             | SignUpPage            | GuestGuard | 회원가입                         |
| `/auth/email-verification`  | EmailVerificationPage | GuestGuard | 이메일 인증 안내                 |
| `/auth/email-confirmed`     | EmailConfirmedPage    | 없음       | 이메일 인증 완료                 |
| `/`                         | IndexPage             | AuthGuard  | 홈 (메인)                        |
| `/profile-completion`       | ProfileCompletionPage | AuthGuard  | 프로필 완성                      |
| `/terminal`                 | TerminalPage          | AuthGuard  | B0 비행선 터미널                 |
| `/terminal/booking/:cityId` | TicketBookingPage     | AuthGuard  | 비행선 티켓 예매                 |

### 라우트 핸들

```typescript
{
  path: ROUTES.SIGN_IN,
  element: <SignInPage />,
  handle: { title: "로그인", isRoot: false },
}
```

- `title`: 헤더에 표시될 페이지 제목
- `isRoot`: `true`이면 뒤로가기 버튼 숨김

## 타입 정의 패턴

공통 타입은 `src/types.ts`에서 도메인별로 그룹화하여 관리:

```typescript
// ============================================================================
// API 응답 타입
// ============================================================================

/** 백엔드 API 성공 응답 래퍼 타입 (단일 데이터) */
export interface DataResponse<T> {
  data: T;
}

/** 백엔드 API 리스트 응답 래퍼 타입 */
export interface ListResponse<T> {
  list: T[];
  pagination: Pagination;
}

// ============================================================================
// 사용자 관련 타입
// ============================================================================

/** 사용자 정보 (백엔드 User 모델과 동일) */
export interface User {
  user_id: string;
  email: string | null;
  nickname: string | null;
  // ...
}

// ============================================================================
// 도시 관련 타입
// ============================================================================

/** 도시 정보 (백엔드 City 모델과 동일) */
export interface City {
  city_id: string;
  name: string;
  // ...
}
```

**규칙:**

- **섹션 구분자**: `// ============================================================================` 사용
- **도메인별 그룹화**: API 응답, 인증, 사용자, 도시, 비행선 등으로 분리
- **JSDoc 주석**: 모든 인터페이스와 중요 필드에 설명 추가
- **백엔드 동기화**: 도메인 타입은 백엔드 모델과 동일하게 유지
- **네이밍**: `{도메인}` (예: `User`, `City`) 또는 `{동작}{도메인}RequestBody` (예: `UpdateUserRequestBody`)

## 테마 시스템

### B0 브랜드 색상 (index.css)

```css
/* 브랜드 주요 색상 */
--b0-purple: #9333ea /* 메인 보라색 */ --b0-light-purple: #c084fc /* 밝은 보라색 */ --b0-pink-purple: #f0abfc
  /* 핑크 보라색 */ --b0-deep-navy: #0f0f23 /* 딥 네이비 (배경) */ --b0-card-navy: #1a1b3c /* 카드 네이비 */
  /* 도시별 테마 색상 */ --city-serensia: #f97316 /* 관계, 노을빛 오렌지 */ --city-lorensia: #22c55e /* 회복, 숲 초록 */
  --city-emmasia: #84cc16 /* 희망, 밝은 라임 */ --city-damarin: #64748b /* 고요, 안개 슬레이트 */
  --city-galicia: #f59e0b /* 성찰, 황금빛 앰버 */;
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
- 새로운 API 함수 추가 시 JSDoc 주석 작성
- 새로운 훅 추가 시 적절한 디렉토리에 파일 생성 (`queries/` 또는 `mutations/`)
- 새로운 라우트 추가 시 `ROUTES` 상수에 먼저 정의
- **백엔드 API 스펙 확인 시 반드시 OpenAPI 문서 참조**: https://api.basementzero.cloud/openapi.json

## 안티 패턴 (하지 말아야 할 것)

### API 호출

```typescript
// ❌ 잘못된 예: 컴포넌트에서 직접 API 호출
export default function MyPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data").then((res) => setData(res));
  }, []);
}

// ✅ 올바른 예: hooks/queries 디렉토리의 훅 사용
export default function MyPage() {
  const { data } = useMyData();
}
```

### 라우트 경로

```typescript
// ❌ 잘못된 예: 하드코딩된 경로
navigate("/auth/sign-in");
<Link to="/profile-completion">

// ✅ 올바른 예: ROUTES 상수 사용
navigate(ROUTES.SIGN_IN);
<Link to={ROUTES.PROFILE_COMPLETION}>
```

### 에러 처리

```typescript
// ❌ 잘못된 예: alert 사용
if (error) {
  alert(error.message);
}

// ✅ 올바른 예: toast 사용
if (error) {
  toast.error(error.message);
}
```

### 상태 관리

```typescript
// ❌ 잘못된 예: 전체 스토어 구독 (불필요한 리렌더링 발생)
const store = useAuthStore();
const session = store.session;

// ✅ 올바른 예: 셀렉터 훅 사용
const session = useAuthSession();
```

### Props 인터페이스

```typescript
// ❌ 잘못된 예: 인라인 타입 또는 Props 이름 미사용
function MyComponent({ value, onChange }: { value: string; onChange: () => void }) {}

// ✅ 올바른 예: Props 인터페이스 별도 정의
interface MyComponentProps {
  value: string;
  onChange: () => void;
}

function MyComponent({ value, onChange }: MyComponentProps) {}
```

### 컴포넌트 Export

```typescript
// ❌ 잘못된 예: named export (페이지/가드/프로바이더)
export function SignInPage() {}

// ✅ 올바른 예: default export (페이지/가드/프로바이더)
export default function SignInPage() {}

// 예외: UI 컴포넌트나 유틸리티 컴포넌트는 named export 가능
export function EmojiPicker() {}
```

### 조건부 스타일

```typescript
// ❌ 잘못된 예: 삼항 연산자로 전체 클래스 교체
className={isActive ? "bg-primary text-white p-4" : "bg-gray-100 text-black p-4"}

// ✅ 올바른 예: cn() 유틸리티로 조건부 클래스 추가
className={cn("p-4", isActive ? "bg-primary text-white" : "bg-gray-100 text-black")}
// 또는
className={cn("p-4 bg-gray-100", isActive && "bg-primary text-white")}
```

### 상수 정의

```typescript
// ❌ 잘못된 예: 컴포넌트 내부에 상수 정의
export default function OnboardingPage() {
  const SLIDE_COUNT = 3;
  // ...
}

// ✅ 올바른 예: 컴포넌트 외부에 상수 정의
const SLIDE_COUNT = 3;

export default function OnboardingPage() {
  // ...
}
```

### Import 확장자

```typescript
// ❌ 잘못된 예: 확장자 생략
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/queries/use-me";

// ✅ 올바른 예: 확장자 명시
import { Button } from "@/components/ui/button.tsx";
import { useMe } from "@/hooks/queries/use-me.ts";
```

### 데이터 기본값

```typescript
// ❌ 잘못된 예: undefined 체크 없이 바로 사용
const cities = cityListData.list;

// ✅ 올바른 예: nullish coalescing으로 기본값 제공
const cities = cityListData?.list ?? [];
```

### Query 훅 반환 타입

```typescript
// ❌ 잘못된 예: 반환 타입 생략
export function useMe() {
  return useQuery({ ... });
}

// ✅ 올바른 예: UseQueryResult 타입 명시
export function useMe(): UseQueryResult<User, B0ApiError> {
  return useQuery({ ... });
}
```

## 커밋 전 필수 작업

**커밋하기 전에 반드시 다음 명령어를 순서대로 실행:**

```bash
pnpm format    # 코드 포매팅
pnpm lint:fix  # 린트 오류 자동 수정
```

린트 오류가 모두 해결된 후에만 커밋을 진행합니다.

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

## 핵심 개념

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

## 네이밍 컨벤션

### 페이지

- 파일명: `kebab-case` + `-page.tsx` (예: `sign-in-page.tsx`)
- 컴포넌트명: `PascalCase` + `Page` (예: `SignInPage`)

### 컴포넌트

- 파일명: `kebab-case.tsx` (예: `emoji-picker.tsx`, `global-loader.tsx`)
- 컴포넌트명: `PascalCase` (예: `EmojiPicker`, `GlobalLoader`)

### 훅

- Query 훅: `use-{도메인}.ts` → `use{도메인}()` (예: `use-me.ts` → `useMe()`)
- Mutation 훅: `use-{동작}-{도메인}.ts` → `use{동작}{도메인}()` (예: `use-update-me.ts` → `useUpdateMe()`)

### 스토어

- 파일명: `{도메인}-store.ts` (예: `auth-store.ts`)
- 스토어 훅: `use{도메인}Store` (예: `useAuthStore`)
- 셀렉터 훅: `use{도메인}{상태}` (예: `useAuthSession`, `useAuthIsLoaded`)

### API 함수

- 파일명: `{도메인}.ts` (예: `users.ts`, `auth.ts`, `cities.ts`, `airships.ts`)
- 함수명: `{동작}{대상}` (예: `getMe`, `updateMe`, `signUp`)
- 조회: `get{대상}` (예: `getMe`, `getCityById`, `getActiveCities`)
- 생성: `create{대상}` (예: `createMe`)
- 수정: `update{대상}` (예: `updateMe`)
- 삭제: `delete{대상}`

### 도메인별 컴포넌트

- 폴더명: `{도메인}/` (예: `terminal/`, `booking/`, `onboarding/`)
- 파일명: `{도메인}-{역할}.tsx` 또는 `{역할}.tsx` (예: `terminal-header.tsx`, `city-card.tsx`)
- 컴포넌트명: `{도메인}{역할}` 또는 `{역할}` (예: `TerminalHeader`, `CityCard`)

### 가드 컴포넌트

- 파일명: `{역할}-guard.tsx` (예: `auth-guard.tsx`)
- 컴포넌트명: `{역할}Guard` (예: `AuthGuard`)

### 프로바이더 컴포넌트

- 파일명: `{기능}-provider.tsx` (예: `auth-session-provider.tsx`)
- 컴포넌트명: `{기능}Provider` (예: `AuthSessionProvider`)

### 이벤트 핸들러

- 네이밍: `handle{대상}{동작}` (예: `handleEmailChange`, `handleSubmit`, `handleStartClicked`)
- Props로 전달되는 콜백: `on{대상}{동작}` (예: `onStartClicked`, `onChange`)

```typescript
// 컴포넌트 내부 핸들러
const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => { ... };
const handleSubmit = (e: FormEvent) => { ... };
const handleStartClicked = () => { ... };

// Props로 받는 콜백
interface Props {
  onStartClicked?: () => void;
  onChange: (value: string) => void;
}
```

### 유효성 검사 함수

- 네이밍: `validate{대상}` (예: `validateNickname`, `validateEmail`)
- 반환: 에러 메시지 문자열 또는 `null` (유효한 경우)

```typescript
const validateNickname = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return "닉네임을 입력해주세요.";
  if (trimmed.length < 2 || trimmed.length > 10) return "닉네임은 2~10자로 입력해주세요.";
  return null;
};
```
