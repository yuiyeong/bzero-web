export const MOODS = [
  { emoji: "😊", value: "happy", label: "행복" },
  { emoji: "😐", value: "peaceful", label: "평온" },
  { emoji: "😢", value: "sad", label: "슬픔" },
  { emoji: "😡", value: "anxious", label: "불안" },
  { emoji: "😴", value: "tired", label: "피곤" },
] as const;

export type MoodValue = (typeof MOODS)[number]["value"];
