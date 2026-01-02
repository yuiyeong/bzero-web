# Lounge (1:1 Chat) Implementation Plan

## Overview

This document outlines the plan to implement the Lounge (1:1 Chat) feature in the `bzero-web` frontend. The backend is already implemented, providing necessary REST APIs and Socket.IO events.

## 1. Feature Requirements (Updated with Wireframes)

- **Lounge Main (Chat List - `/guesthouse/:cityId/lounge`)**:
  - **Header**: Back button, Title "라운지".
  - **Traveler List**:
    - Lists users currently checked in the same guesthouse.
    - **Item UI**: Avatar (Emoji), Nickname.
    - **Action Button**:
      - **None**: "대화 신청" (Request DM).
      - **Pending (Sent)**: "취소" (Cancel Request) - Red button, "응답을 기다리는 중..." status text.
      - **Pending (Received)**: "수락/거절" (Accept/Reject).
      - **Active**: "대화하기" (Enter Chat) or direct entry.
  - **Empty State**: "아직 다른 여행자가 없어요" with sleeping icon.

- **Chat Room (Message View - `/chat/:dmRoomId`)**:
  - **Header**: Back button, Counterpart Avatar + Nickname.
  - **Message List**:
    - **Mine**: Right aligned, purple background.
    - **Others**: Left aligned, with avatar & nickname, gray background.
  - **Input Area**: Text input + Send button (arrow icon).

## 2. API Integration

### REST API (`src/api/dm.ts`)

| Method | Endpoint                         | Description                                             |
| :----- | :------------------------------- | :------------------------------------------------------ |
| `POST` | `/dm/requests`                   | Request 1:1 DM with a user                              |
| `POST` | `/dm/requests/{dmRoomId}/accept` | Accept received DM request                              |
| `POST` | `/dm/requests/{dmRoomId}/reject` | Reject received DM request                              |
| `GET`  | `/dm/rooms`                      | Get list of my DM rooms (params: status, limit, offset) |
| `GET`  | `/dm/rooms/{dmRoomId}/messages`  | Get message history (params: cursor, limit)             |

### Socket.IO Events (`src/lib/socket-client.ts`)

- **Emit (Client -> Server)**:
  - `join_dm_room`: `{ dm_room_id: string }`
  - `send_dm_message`: `{ dm_room_id: string, content: string }`
- **Listen (Server -> Client)**:
  - `new_dm_message`: `{ message: DirectMessageResponse }`
  - `dm_request_notification`: `{ dm_room_id: string, from_user_id: string }`
  - `dm_status_changed`: `{ dm_room_id: string, status: string, updated_by: string }`

## 3. Frontend Architecture

### 3.1. Types (`src/types.ts`)

- `DirectMessage`: Message entity.
- `DirectMessageRoom`: Room entity with participants.
- `DMStatus`: `pending` | `accepted` | `active` | `rejected` | `ended`.

### 3.2. Data Interface (`src/api/dm.ts`)

- Implement functions: `requestDM`, `acceptDM`, `rejectDM`, `getMyDMRooms`, `getDMMessages`.

### 3.3. State Management (React Query)

- `useMyDMRooms`: Query for fetching room list.
- `useDMMessages`: Infinite Query for fetching messages.
- `useRequestDM`: Mutation for requesting chat.
- `useAcceptDM`: Mutation for accepting chat.
- `useRejectDM`: Mutation for rejecting chat.

### 3.4. Components & Pages

#### `pages/LoungePage.tsx`

- **Route**: `/guesthouse/:guesthouseId/lounge`
- **Logic**:
  - Fetch current travelers in guesthouse (Needs API or derived from room list?).
  - _Correction_: The wireframe suggests listing "Same guesthouse travelers". The backend `get_my_dm_rooms` returns _existing_ rooms. We might need a way to look up _potential_ chat partners (other users in the lobby) if `get_my_dm_rooms` only returns established connections.
  - _Clarification_: `bzero/docs` implies requesting DM from "Lounge". If `get_my_dm_rooms` is the only list, then we can only see people we already interacted with. We likely need a `getTravelersInGuesthouse` API or similar.
  - _Assumption_: For MVP, we might only list _active/pending_ connections returned by `get_my_dm_rooms`. Or if there's a "User List" API, we use it.
  - _Refinement_: Let's stick to `getMyDMRooms` for now. If "New Chat" is needed, we need to know who is there. (Checking `bzero-api`... `CurrentUserService` might have logic, or `RoomStay` list).
  - _Action_: Will implement assuming `getMyDMRooms` is the primary list for now.

- **Components**:
  - `TravelerItem`: Displays user info and action button.

#### `pages/DMRoomPage.tsx`

- **Route**: `/chat/:dmRoomId` (or `/guesthouse/:guesthouseId/dm/:dmRoomId`)
- **Logic**:
  - Join Socket room on mount.
  - Fetch messages (Infinite Scroll).
  - Send message handler.
- **Components**:
  - `MessageList`: Renders bubbles.
  - `MessageBubble`: Individual message style.
  - `ChatInput`: Footer input.

#### `components/lounge/` Directory

- `TravelerItem.tsx`
- `MessageBubble.tsx`
- `ChatInput.tsx`

## 4. Implementation Steps

1.  **Type & API Setup**: Define types and implement `src/api/dm.ts`.
2.  **Lounge Page (List)**: Implement `LoungePage` with `useMyDMRooms`.
    - Apply styling from `05-chat.html` (traveler-item styles).
3.  **DM Room Page (UI)**: Implement `DMRoomPage`.
    - Apply styling from `05-chat.html` (chat-container, message-other, message-mine).
4.  **Socket Integration**: Connect real-time messaging in `DMRoomPage`.
5.  **Notifications**: Add toast handling for `dm_request_notification`.

## 5. Styling Reference (from `styles.css` / `05-chat.html`)

- **Colors**:
  - Accent: Purple/Indigo (buttons, my messages).
  - Muted: Gray (other messages, timestamps).
- **Classes**:
  - `.traveler-item`: Flex layout, border-bottom.
  - `.message-mine`: `margin-left: auto`, `background: var(--accent)`.
  - `.message-other`: `background: var(--surface-light)`.
