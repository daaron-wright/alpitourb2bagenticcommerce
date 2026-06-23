import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ source }: { source: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => {
            const id = slugify(toText(children));
            return (
              <h1
                id={id}
                {...props}
                className="scroll-mt-24 border-b pb-4 mb-6"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const id = slugify(toText(children));
            return (
              <h2
                id={id}
                {...props}
                className="scroll-mt-24 mt-12 mb-4 pt-4 border-t"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const id = slugify(toText(children));
            return (
              <h3
                id={id}
                {...props}
                className="scroll-mt-24 mt-8 mb-3"
                style={{ color: "var(--foreground)" }}
              >
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => (
            <h4
              {...props}
              className="mt-6 mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p
              {...props}
              className="my-4 leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {children}
            </p>
          ),
          a: ({ children, ...props }) => (
            <a
              {...props}
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: "var(--primary)" }}
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children, ...props }) => (
            <ul {...props} className="my-4 ml-6 list-disc space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="my-4 ml-6 list-decimal space-y-1">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li
              {...props}
              className="leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {children}
            </li>
          ),
          strong: ({ children, ...props }) => (
            <strong
              {...props}
              style={{
                color: "var(--foreground)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              {children}
            </strong>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="my-4 pl-4 border-l-4 italic"
              style={{
                borderColor: "var(--primary)",
                color: "var(--muted-foreground)",
                backgroundColor: "var(--muted)",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
              }}
            >
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr
              className="my-10"
              style={{
                border: "none",
                borderTop: "1px solid var(--border)",
              }}
            />
          ),
          table: ({ children, ...props }) => (
            <div
              className="my-6 overflow-x-auto border"
              style={{
                borderColor: "var(--border)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--card)",
              }}
            >
              <table {...props} className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead
              {...props}
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-foreground)",
              }}
            >
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              {...props}
              className="text-left px-4 py-3 border-b"
              style={{
                borderColor: "var(--border)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              {...props}
              className="px-4 py-3 align-top border-b"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {children}
            </td>
          ),
          tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
          code: ({ className, children, ...props }: any) => {
            const inline = !className;
            if (inline) {
              return (
                <code
                  {...props}
                  className="px-1.5 py-0.5"
                  style={{
                    backgroundColor: "var(--muted)",
                    color: "var(--foreground)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  }}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                {...props}
                className={className}
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                }}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => {
            const child: any = (children as any)?.props;
            const lang = child?.className?.replace("language-", "") ?? "";
            return (
              <div
                className="my-6 overflow-hidden border"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--muted)",
                }}
              >
                {lang && (
                  <div
                    className="px-4 py-2 border-b uppercase tracking-wide"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--accent)",
                      color: "var(--muted-foreground)",
                      fontSize: "0.75rem",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    {lang}
                  </div>
                )}
                <pre
                  {...props}
                  className="overflow-x-auto p-4 leading-relaxed"
                  style={{
                    color: "var(--foreground)",
                    fontSize: "0.875rem",
                  }}
                >
                  {children}
                </pre>
              </div>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

function toText(node: any): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (node?.props?.children) return toText(node.props.children);
  return "";
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export { slugify };
