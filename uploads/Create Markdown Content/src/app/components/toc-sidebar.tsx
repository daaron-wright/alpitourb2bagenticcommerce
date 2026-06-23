import { useEffect, useState } from "react";
import { slugify } from "./markdown-content";

export type TocItem = {
  level: number;
  text: string;
  id: string;
};

export function extractToc(md: string): TocItem[] {
  const lines = md.split("\n");
  const items: TocItem[] = [];
  let inCode = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = /^(#{1,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/`/g, "");
    items.push({ level, text, id: slugify(text) });
  }
  return items;
}

export function TocSidebar({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4"
      aria-label="Table of contents"
    >
      <div
        className="uppercase tracking-wider mb-3"
        style={{
          fontSize: "0.75rem",
          color: "var(--muted-foreground)",
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        On this page
      </div>
      <ul className="space-y-1">
        {items.map((it, idx) => {
          const active = activeId === it.id;
          return (
            <li
              key={`${it.id}-${idx}`}
              style={{ paddingLeft: `${(it.level - 1) * 12}px` }}
            >
              <a
                href={`#${it.id}`}
                className="block py-1 transition-colors leading-snug"
                style={{
                  color: active
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                  borderLeft: `2px solid ${
                    active ? "var(--primary)" : "transparent"
                  }`,
                  paddingLeft: "10px",
                  fontSize: it.level === 1 ? "0.875rem" : "0.8125rem",
                  fontWeight: active
                    ? "var(--font-weight-medium)"
                    : "var(--font-weight-normal)",
                }}
              >
                {it.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
