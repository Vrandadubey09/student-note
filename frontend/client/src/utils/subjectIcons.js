import {
  BookOpen,
  FlaskConical,
  Calculator,
  Globe,
  Music,
  Palette,
  Dumbbell,
  Landmark,
} from "lucide-react";

export const ICON_MAP = {
  book: BookOpen,
  flask: FlaskConical,
  calculator: Calculator,
  globe: Globe,
  music: Music,
  paintbrush: Palette,
  dumbbell: Dumbbell,
  landmark: Landmark,
};

export const ICON_KEYS = Object.keys(ICON_MAP);

export const SUBJECT_COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#3b82f6", // blue
  "#84cc16", // lime
];

export function getSubjectIcon(key) {
  return ICON_MAP[key] || BookOpen;
}
