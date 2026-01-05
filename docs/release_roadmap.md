# 🚀 B0 Service Release Roadmap

본 문서는 서비스 배포를 위한 필수 작업(Pre-release)과 고도화 계획(Post-release)을 기술적으로 정의한 문서입니다.

## 📋 1. 배포 전 필수 작업 (Pre-release: Priority 0)

안정적이고 완성도 높은 서비스를 위해 반드시 해결해야 할 항목입니다.

### 🛠 버그 수정 및 안정화 (Bug Fixes)

시스템의 신뢰성을 무너뜨리는 치명적인 결함을 수정합니다.

- [ ] **체크아웃 로직 완전 해결** `[Frontend/React]` `[TanStack Query]`
  - [ ] `/current` 호출 시 404/500 에러 핸들링 강화 (무한 로딩 방지).
  - [ ] 체크아웃 성공 시 `queryClient.invalidateQueries` 호출 후 `/terminal`로 명시적 리다이렉트 (`navigate(..., { replace: true })`).
- [ ] **정원(Capacity) 관리 시스템 복구** `[Backend/FastAPI]`
  - [ ] 체크아웃 트랜잭션 내에서 `Rooms.current_capacity` 감소(-1) 로직 원자성(Atomicity) 보장.
  - [ ] 동시성 이슈 방지를 위한 DB Lock 또는 Redis 분산 락 검토.
- [ ] **데이터 격리 (Data Isolation)** `[Database/SQLAlchemy]`
  - [ ] **Issue**: 이전 체류에서 쓴 일기가 현재 체류에서도 보이는 현상.
  - [ ] **Fix**: 일기/문답 조회 쿼리에 `WHERE room_stay_id = :current_stay_id` 조건 필수 적용.
- [ ] **에러 핸들링 (500 Error)** `[Frontend/React]`
  - [ ] 대화 재신청 시 발생하는 서버 에러(500) 방어를 위한 UI 수정.
  - [ ] '거절' 버튼 제거 또는 비활성화 처리로 엣지 케이스 차단.

### ✨ UI/UX 개선 (User Experience)

사용자 혼란을 줄이고 서비스의 규모감을 전달합니다.

- [ ] **채팅 입력창 최적화** `[CSS/Tailwind]`
  - [ ] iOS Safari 가상 키보드 대응: `visualViewport` API 활용 또는 `interactive-widget=resizes-content` 메타 태그 적용.
  - [ ] `input` 폰트 사이즈 16px 이상으로 설정하여 자동 확대(Zoom-in) 방지.
- [ ] **마이페이지 히스토리** `[Frontend/React]`
  - [ ] 과거 `room_stay_id` 기반 일기/문답 리스트 조회 UI 구현.
- [ ] **세계관 확장 (Coming Soon)** `[Frontend/UI]`
  - [ ] 미오픈 도시(3개) 카드를 리스트에 추가하고 `Disabled` 및 '항로 개척 중' 뱃지 처리.

### 💰 보상 및 기능 (Feature & Logic)

유저 리텐션과 운영 효율을 위한 최소 기능셋입니다.

- [ ] **출석 보상(Daily Login)** `[Backend/FastAPI]`
  - [ ] 유저 접속 시 `last_login_at` 체크 → 날짜 변경 시 100P 지급 및 `point_transactions` 기록.
- [ ] **문의하기 연결** `[Frontend/React]`
  - [ ] 설정 페이지 내 '문의하기' 버튼 클릭 시 Google Form 외부 링크로 연결 (`target="_blank"`).
- [ ] **수요 검증 (Fake Door)** `[Frontend/GA4]`
  - [ ] 포인트 부족 모달에 '포인트 무료 충전 요청' 버튼 배치.
  - [ ] 클릭 시 실제 지급 대신 "준비 중입니다" 토스트 노출 및 GA 이벤트 전송.

### 📊 데이터 추적 (Analytics)

PMF 검증을 위한 데이터 파이프라인 구축.

- [ ] **GA4 초기 구성** `[React-GA4]`
  - [ ] `navigation_click`, `view_error`, `point_request_click` 등 핵심 이벤트 계측 코드 삽입.

---

## 💡 Technical Data Design Guide (구현 조언)

### 1. 데이터 격리 (Data Isolation) 아키텍처

현재 `room_stay_id` 기준 쿼리가 제대로 동작하지 않는 것으로 보입니다. 이는 **Tenant 격리**와 유사하게 접근해야 합니다.

- **Principle**: "모든 체류 데이터(일기, 문답)는 그 데이터가 생성된 `room_stay_id`에 종속된다."
- **Pitfall**: 단순히 `user_id`로만 조회하면 과거/현재 데이터가 섞입니다.
- **Implementation**:

  ```python
  # BAD
  stmt = select(Diary).where(Diary.user_id == user_id)

  # GOOD
  stmt = select(Diary).where(
      Diary.user_id == user_id,
      Diary.room_stay_id == current_room_stay_id  # 필수 조건
  )
  ```

### 2. GA4 Event Log 설계

- **포인트 요청 버튼(Fake Door)**: 단순히 클릭 수만 세지 말고, **'누가(Point Range)'**, **'언제(Context)'** 눌렀는지 파악해야 합니다.
  - Event: `demand_verification_click`
  - Params:
    - `feature_name`: "free_point_charge"
    - `current_balance`: 30 (유저의 절박함 측정)
    - `source`: "modal_insufficient_points"

---

## 📈 2. 배포 후 고도화 로드맵 (Post-release)

| 구분            | 항목                 | 상세 내용 & 기술 전략                                                                                                                           |
| :-------------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **시스템 관리** | **데이터 클렌징**    | • **주기**: 매일 새벽 4시 (트래픽 최저 시간)<br>• **대상**: 7일 지난 채팅 로그 Hard Delete (개인정보 최소화)<br>• **Tech**: Celery Beat + Redis |
| **수익 모델**   | **리워드 시스템**    | • **포인트 요청** 데이터 분석 결과를 토대로 보상 체계 구체화<br>• 퀘스트(글쓰기), 광고 시청, 추천인 코드 등 도입 검토                           |
| **기능 고도화** | **회고(Retrospect)** | • **Update 기능**: 지난 일기/문답 수정 기능 (단, `updated_at` 기록)<br>• **감정 분석**: 일기 키워드 추출을 통한 월간 감정 리포트 제공 (NLP)     |
