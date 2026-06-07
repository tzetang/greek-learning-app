import type { Zone } from "./corpus-types";

export interface ZoneStyle {
  label: string;
  bg: string;       // Tailwind bg class
  text: string;     // Tailwind text class
  border: string;   // Tailwind border class
  dot: string;      // hex color for legend dot
}

export const ZONE_STYLES: Record<Zone, ZoneStyle> = {
  FRONT: {
    label: "Augment / Prefix",
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-400",
    dot: "#f59e0b",
  },
  STEM: {
    label: "Stem",
    bg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-400",
    dot: "#3b82f6",
  },
  MARKER: {
    label: "Tense Marker",
    bg: "bg-purple-100",
    text: "text-purple-900",
    border: "border-purple-400",
    dot: "#a855f7",
  },
  TAIL: {
    label: "Ending",
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-400",
    dot: "#10b981",
  },
};

export const ZONE_ORDER: Zone[] = ["FRONT", "STEM", "MARKER", "TAIL"];
