import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize alert payloads (legacy + new)
 * Ensures UI always receives a complete alert object
 */
export function normalizeAlert(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    id: raw.id ?? undefined,

    // Event type (new + legacy)
    event_type:
      raw.event_type ||
      raw.behavior_type ||
      "Unknown Event",

    // Severity (default safe)
    severity:
      raw.severity || "low",

    // Confidence (normalize to 0–1)
    confidence_level:
      raw.confidence_level != null
        ? raw.confidence_level
        : raw.confidence != null
          ? Math.min(1, Math.max(0, raw.confidence / 100))
          : 0,

    // Details / description
    details:
      raw.details ||
      raw.description ||
      "No details provided",

    // Timestamp fallback
    detected_at:
      raw.detected_at ||
      raw.created_at ||
      new Date().toISOString(),
  };
}
