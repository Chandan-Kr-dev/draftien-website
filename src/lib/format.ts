const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatCurrencyINR(value: number): string {
  return inrFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return "-";
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return dateFormatter.format(parsed);
}

export function formatDurationHours(hours: number | null | undefined): string {
  if (!hours || hours <= 0) {
    return "Self paced";
  }

  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`;
  }

  if (hours === 1) {
    return "1 hour";
  }

  return `${hours} hours`;
}

export function slugToTitle(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
