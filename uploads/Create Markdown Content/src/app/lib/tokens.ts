export const cssVar = (name: string) => `var(--${name})`;

export const statusColor: Record<string, { bg: string; fg: string; dot: string }> = {
  allowed: { bg: "color-mix(in oklab, var(--chart-2) 18%, var(--background))", fg: "var(--foreground)", dot: "var(--chart-2)" },
  denied: { bg: "color-mix(in oklab, var(--destructive) 14%, var(--background))", fg: "var(--destructive)", dot: "var(--destructive)" },
  routed: { bg: "color-mix(in oklab, var(--chart-4) 20%, var(--background))", fg: "var(--foreground)", dot: "var(--chart-4)" },
  pending: { bg: "color-mix(in oklab, var(--chart-3) 18%, var(--background))", fg: "var(--foreground)", dot: "var(--chart-3)" },
  info: { bg: "var(--secondary)", fg: "var(--secondary-foreground)", dot: "var(--primary)" },
};
