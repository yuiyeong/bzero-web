# Google Analytics 이벤트 트래킹 문서

## 개요

- **측정 ID**: `G-HG4DR12CC9`
- **구현 방식**: gtag.js 직접 삽입
- **적용일**: 2026-01-03

## 핵심 파일

| 파일                   | 설명                  |
| ---------------------- | --------------------- |
| `index.html`           | gtag.js 스크립트 삽입 |
| `src/lib/analytics.ts` | 트래킹 유틸리티 함수  |
| `src/vite-env.d.ts`    | TypeScript 타입 정의  |

## 유틸리티 함수

```typescript
// src/lib/analytics.ts

// 일반 이벤트 트래킹
trackEvent(eventName: string, params?: Record<string, string | number | boolean | undefined>)

// 버튼 클릭 이벤트 (button_click 이벤트로 래핑)
trackButtonClick(buttonName: string, additionalParams?: Record<string, ...>)

// 페이지뷰 이벤트
trackPageView(pageTitle: string, pagePath: string)
```

---

## 페이지뷰 이벤트

### 중앙 처리 (MainLayout)

**파일**: `src/components/layout/main-layout.tsx`

```typescript
useEffect(() => {
  trackPageView(title, location.pathname);
}, [location.pathname, title]);
```

MainLayout을 사용하는 모든 페이지에서 자동으로 페이지뷰가 트래킹됩니다.

### MainLayout 외부 페이지

| 파일                            | 페이지 타이틀 | 경로              |
| ------------------------------- | ------------- | ----------------- |
| `src/pages/onboarding-page.tsx` | "온보딩"      | `/onboarding`     |
| `src/pages/dm-room-page.tsx`    | "1:1 대화"    | `/dm/${dmRoomId}` |

---

## 핵심 전환 이벤트

### 1. 인증 이벤트

#### 회원가입 성공/실패

**파일**: `src/pages/sign-up-page.tsx`

| 이벤트명         | 함수         | 트리거                    | 파라미터                 |
| ---------------- | ------------ | ------------------------- | ------------------------ |
| `signup_success` | `trackEvent` | 회원가입 mutation 성공 시 | -                        |
| `signup_error`   | `trackEvent` | 회원가입 mutation 실패 시 | `{ error_code: string }` |

```typescript
const { mutate: signUp } = useSignUp({
  onSuccess: () => {
    trackEvent("signup_success");
    // ...
  },
  onError: (e: AuthError) => {
    trackEvent("signup_error", { error_code: e.code });
    // ...
  },
});
```

#### 로그인 성공/실패

**파일**: `src/pages/sign-in-page.tsx`

| 이벤트명         | 함수         | 트리거                  | 파라미터                 |
| ---------------- | ------------ | ----------------------- | ------------------------ |
| `signin_success` | `trackEvent` | 로그인 mutation 성공 시 | -                        |
| `signin_error`   | `trackEvent` | 로그인 mutation 실패 시 | `{ error_code: string }` |

```typescript
const { mutate: signInWithPassword } = useSignInWithPassword({
  onSuccess: () => {
    trackEvent("signin_success");
    // ...
  },
  onError: (e: AuthError) => {
    trackEvent("signin_error", { error_code: e.code });
    // ...
  },
});
```

#### 프로필 완성

**파일**: `src/pages/profile-completion-page.tsx`

| 이벤트명           | 함수         | 트리거                           | 파라미터            |
| ------------------ | ------------ | -------------------------------- | ------------------- |
| `profile_complete` | `trackEvent` | 프로필 업데이트 mutation 성공 시 | `{ emoji: string }` |

```typescript
const { mutate: updateMe } = useUpdateMe({
  onSuccess: () => {
    trackEvent("profile_complete", { emoji: selectedEmoji });
    // ...
  },
});
```

#### 온보딩 시작

**파일**: `src/pages/onboarding-page.tsx`

| 이벤트명           | 함수               | 트리거                       | 파라미터 |
| ------------------ | ------------------ | ---------------------------- | -------- |
| `onboarding_start` | `trackButtonClick` | "여행 시작하기" 버튼 클릭 시 | -        |

```typescript
const handleStartClicked = () => {
  trackButtonClick("onboarding_start");
  // ...
};
```

---

### 2. 여행 이벤트

#### 도시 선택

**파일**: `src/components/terminal/city-card.tsx`

| 이벤트명      | 함수               | 트리거                              | 파라미터                                 |
| ------------- | ------------------ | ----------------------------------- | ---------------------------------------- |
| `city_select` | `trackButtonClick` | 도시 카드의 "예매하기" 버튼 클릭 시 | `{ city_id: string, city_name: string }` |

```typescript
const handleBookingClick = () => {
  if (isComingSoon) return;
  trackButtonClick("city_select", { city_id: city.city_id, city_name: city.name });
  // ...
};
```

#### 비행선 선택

**파일**: `src/pages/ticket-booking-page.tsx`

| 이벤트명         | 함수               | 트리거              | 파라미터                 |
| ---------------- | ------------------ | ------------------- | ------------------------ |
| `airship_select` | `trackButtonClick` | 비행선 카드 선택 시 | `{ airship_id: string }` |

```typescript
const handleSelectAirship = (airshipId: string) => {
  trackButtonClick("airship_select", { airship_id: airshipId });
  setSelectedAirshipId(airshipId);
};
```

#### 티켓 구매 성공/실패

**파일**: `src/pages/ticket-booking-page.tsx`

| 이벤트명                  | 함수         | 트리거                     | 파라미터                         |
| ------------------------- | ------------ | -------------------------- | -------------------------------- |
| `ticket_purchase_success` | `trackEvent` | 티켓 구매 mutation 성공 시 | `{ city_id, airship_id, price }` |
| `ticket_purchase_error`   | `trackEvent` | 티켓 구매 mutation 실패 시 | `{ error_code: string }`         |

```typescript
const { mutate: purchaseTicket } = usePurchaseTicket({
  onSuccess: (ticket) => {
    trackEvent("ticket_purchase_success", {
      city_id: ticket.city.city_id,
      airship_id: ticket.airship.airship_id,
      price: ticket.cost_points,
    });
    // ...
  },
  onError: (error: B0ApiError) => {
    trackEvent("ticket_purchase_error", { error_code: error.code });
    // ...
  },
});
```

#### 도시 도착

**파일**: `src/pages/boarding-page.tsx`

| 이벤트명  | 함수         | 트리거                              | 파라미터              |
| --------- | ------------ | ----------------------------------- | --------------------- |
| `arrival` | `trackEvent` | 비행선 도착 후 게스트하우스 이동 시 | `{ city_id: string }` |

```typescript
const handleArrival = useCallback(async () => {
  if (ticket) {
    trackEvent("arrival", { city_id: ticket.city.city_id });
  }
  // ...
}, [queryClient, navigate, ticket]);
```

---

### 3. 게스트하우스 이벤트

#### 공간 선택

**파일**: `src/components/guesthouse/space-list.tsx`

| 이벤트명       | 함수               | 트리거                                    | 파라미터                 |
| -------------- | ------------------ | ----------------------------------------- | ------------------------ |
| `space_select` | `trackButtonClick` | 공간 카드(사랑방/라운지/개인숙소) 클릭 시 | `{ space_type: string }` |

```typescript
const handleSpaceClick = (spaceType: SpaceType) => {
  if (!guesthouseId) return;
  trackButtonClick("space_select", { space_type: spaceType });
  // ...
};
```

**space_type 값**: `living_room`, `lounge`, `private_room`

#### 체크아웃 성공

**파일**: `src/pages/private-room-page.tsx`

| 이벤트명           | 함수         | 트리거                    | 파라미터 |
| ------------------ | ------------ | ------------------------- | -------- |
| `checkout_success` | `trackEvent` | 체크아웃 mutation 성공 시 | -        |

```typescript
const { mutate: checkout } = useMutation({
  mutationFn: checkoutCurrentStay,
  onSuccess: () => {
    trackEvent("checkout_success");
    // ...
  },
});
```

#### 일기 저장 성공

**파일**: `src/pages/diary-page.tsx`

| 이벤트명             | 함수         | 트리거                     | 파라미터 |
| -------------------- | ------------ | -------------------------- | -------- |
| `diary_save_success` | `trackEvent` | 일기 저장 mutation 성공 시 | -        |

```typescript
const { mutate: submitDiary } = useMutation({
  mutationFn: createDiary,
  onSuccess: () => {
    trackEvent("diary_save_success");
    // ...
  },
});
```

#### 문답지 답변 성공

**파일**: `src/pages/questionnaire-page.tsx`

| 이벤트명                       | 함수         | 트리거                       | 파라미터 |
| ------------------------------ | ------------ | ---------------------------- | -------- |
| `questionnaire_answer_success` | `trackEvent` | 문답지 답변 mutation 성공 시 | -        |

```typescript
const { mutate: submitAnswer } = useMutation({
  mutationFn: createQuestionnaire,
  onSuccess: () => {
    trackEvent("questionnaire_answer_success");
    // ...
  },
});
```

---

## 이벤트 요약 테이블

| 카테고리     | 이벤트명                       | 파일                        | 파라미터                         |
| ------------ | ------------------------------ | --------------------------- | -------------------------------- |
| 인증         | `signup_success`               | sign-up-page.tsx            | -                                |
| 인증         | `signup_error`                 | sign-up-page.tsx            | `error_code`                     |
| 인증         | `signin_success`               | sign-in-page.tsx            | -                                |
| 인증         | `signin_error`                 | sign-in-page.tsx            | `error_code`                     |
| 인증         | `profile_complete`             | profile-completion-page.tsx | `emoji`                          |
| 온보딩       | `onboarding_start`             | onboarding-page.tsx         | -                                |
| 여행         | `city_select`                  | city-card.tsx               | `city_id`, `city_name`           |
| 여행         | `airship_select`               | ticket-booking-page.tsx     | `airship_id`                     |
| 여행         | `ticket_purchase_success`      | ticket-booking-page.tsx     | `city_id`, `airship_id`, `price` |
| 여행         | `ticket_purchase_error`        | ticket-booking-page.tsx     | `error_code`                     |
| 여행         | `arrival`                      | boarding-page.tsx           | `city_id`                        |
| 게스트하우스 | `space_select`                 | space-list.tsx              | `space_type`                     |
| 게스트하우스 | `checkout_success`             | private-room-page.tsx       | -                                |
| 게스트하우스 | `diary_save_success`           | diary-page.tsx              | -                                |
| 게스트하우스 | `questionnaire_answer_success` | questionnaire-page.tsx      | -                                |

---

## 이벤트 네이밍 규칙

```
{category}_{action}[_{result}]
```

- **category**: 도메인/기능 영역 (signup, signin, ticket, diary 등)
- **action**: 수행 동작 (purchase, save, select 등)
- **result**: 결과 (success, error) - 선택적

### 예시

- `signup_success` - 회원가입 성공
- `ticket_purchase_error` - 티켓 구매 실패
- `city_select` - 도시 선택 (결과 없음)

---

## 제외된 이벤트

다음 이벤트는 의도적으로 트래킹에서 제외되었습니다:

- 채팅 메시지 전송 (living-room, dm-room)
- 단순 네비게이션 버튼 (뒤로가기 등)
- 폼 입력 변경 이벤트
- 모달 열기/닫기

---

## GA4 디버깅

개발 환경에서 이벤트 확인 방법:

1. Chrome 확장 프로그램 [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) 설치
2. 또는 GA4 실시간 보고서에서 확인: [Google Analytics](https://analytics.google.com/) → 보고서 → 실시간
