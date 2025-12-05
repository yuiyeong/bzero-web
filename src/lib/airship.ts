/**
 * 비행선 관련 타입 및 상수
 */

/** 비행선 종류 */
export type AirshipType = "standard" | "express";

/** 비행선 옵션 */
export interface AirshipOption {
  type: AirshipType;
  name: string;
  duration: string;
  price: number;
}

/** 사용 가능한 비행선 옵션 목록 */
export const AIRSHIP_OPTIONS: AirshipOption[] = [
  { type: "standard", name: "일반 비행선", duration: "5분 소요", price: 300 },
  { type: "express", name: "쾌속 비행선", duration: "즉시 도착", price: 500 },
];
