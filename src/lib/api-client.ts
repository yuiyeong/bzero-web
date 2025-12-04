import axios from "axios";
import { useAuthStore } from "@/stores/auth-store.ts";
import { parseApiError } from "@/lib/api-errors.ts";

/**
 * 백엔드 API 통신을 위한 Axios 인스턴스
 *
 * 기능:
 * - 기본 URL 설정 (환경변수에서 읽어옴)
 * - 요청 시 Supabase access_token을 Authorization 헤더에 자동 첨부
 * - 응답 에러를 B0ApiError로 변환하여 일관된 에러 처리 지원
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 인증 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const session = useAuthStore.getState().session;

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// 응답 인터셉터: 에러를 B0ApiError로 변환
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    throw parseApiError(error);
  }
);

export default apiClient;
