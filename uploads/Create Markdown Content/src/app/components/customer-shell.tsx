import { ReactNode } from "react";
import {
  Globe,
  MapPin,
  ShoppingCart,
  Mail,
  User,
  Search,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { PortalRoute, useApp } from "../lib/store";

const PRIMARY_NAV: { route: PortalRoute; label: string }[] = [
  { route: "discover", label: "APPLICATIONS" },
  { route: "discover", label: "PRODUCTS" },
  { route: "knowledge", label: "SUSTAINABILITY" },
  { route: "account", label: "SUPPORT" },
];

export function CustomerShell({ children }: { children: ReactNode }) {
  const { setPortalRoute, setExperience, openChemAssist } = useApp();
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <UtilityBar onSwitch={() => setExperience("console")} />
      <PrimaryNav onChange={setPortalRoute} onAsk={openChemAssist} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function UtilityBar({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div
      style={{
        backgroundColor: "#2c2f33",
        color: "#ffffff",
        fontSize: "0.75rem",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-8 h-9 flex items-center justify-between">
        <div className="flex items-center gap-5" style={{ opacity: 0.92 }}>
          <span className="inline-flex items-center gap-1.5">
            <Globe size={12} /> English
            <ChevronDown size={10} />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={12} /> Germany
          </span>
        </div>
        <div className="flex items-center gap-5" style={{ opacity: 0.92 }}>
          <span className="inline-flex items-center gap-1.5 relative">
            <ShoppingCart size={12} /> Cart
            <span
              className="inline-flex items-center justify-center"
              style={{
                minWidth: 16,
                height: 16,
                padding: "0 4px",
                borderRadius: 999,
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                fontSize: "0.625rem",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              2
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail size={12} /> Contact Us
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User size={12} /> My Account
            <ChevronDown size={10} />
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <button
            onClick={onSwitch}
            style={{ color: "#ffffff", opacity: 0.85 }}
          >
            Platform console →
          </button>
        </div>
      </div>
    </div>
  );
}

function PrimaryNav({
  onChange,
  onAsk,
}: {
  onChange: (r: PortalRoute) => void;
  onAsk: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-30"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-8 h-[72px] flex items-center gap-8">
        <button
          onClick={() => onChange("home")}
          className="flex items-center"
          aria-label="Dow home"
        >
          <DowDiamondLogo />
        </button>

        <nav className="flex items-center gap-1">
          {PRIMARY_NAV.map((n) => (
            <button
              key={n.label}
              onClick={() => onChange(n.route)}
              className="px-4 py-2 inline-flex items-center gap-1"
              style={{
                color: "#1a1a1a",
                fontSize: "0.8125rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.04em",
              }}
            >
              {n.label}
              <ChevronDown size={11} style={{ opacity: 0.6 }} />
            </button>
          ))}
        </nav>

        <div className="flex-1 flex items-center gap-3 max-w-[520px] ml-auto">
          <div
            className="flex-1 flex items-center gap-2 px-3 h-10"
            style={{
              border: "1px solid #d0d3d6",
              borderRadius: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <input
              placeholder="What are you looking for?"
              className="flex-1 outline-none"
              style={{
                backgroundColor: "transparent",
                fontSize: "0.875rem",
                color: "var(--foreground)",
              }}
            />
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 h-10"
            onClick={onAsk}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              fontSize: "0.75rem",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.04em",
              borderRadius: 999,
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={13} />
            Ask ChemAssist
          </button>
          <button
            className="p-2"
            style={{ color: "#1a1a1a" }}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

function DowDiamondLogo() {
  return (
    <div className="flex items-center" style={{ height: 40 }}>
      <svg width="68" height="40" viewBox="0 0 68 40" aria-hidden>
        <polygon
          points="34,2 66,20 34,38 2,20"
          fill="var(--primary)"
        />
        <text
          x="34"
          y="25"
          textAnchor="middle"
          fill="var(--primary-foreground)"
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          DOW
        </text>
      </svg>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 48 }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="max-w-[1320px] mx-auto px-8 py-10 grid gap-8" style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}>
          <div>
            <DowDiamondLogo />
            <p
              className="mt-4"
              style={{
                fontSize: "0.8125rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.6,
                maxWidth: 320,
              }}
            >
              Seek Together™. Materials science for a better tomorrow — grounded
              in evidence, surfaced where you work.
            </p>
          </div>
          {[
            { title: "RESOURCES", items: ["Contact Us", "Global Locations"] },
            { title: "EDUCATION", items: ["News", "Events"] },
            { title: "CORPORATE", items: ["About", "Careers", "Investors", "Seek Together Blog"] },
            { title: "LEGAL", items: ["Privacy Statement", "Terms of Use", "Accessibility Statement", "California Supply Chain Act"] },
          ].map((g) => (
            <div key={g.title}>
              <div
                className="mb-3"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  color: "var(--muted-foreground)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {g.title}
              </div>
              <ul className="space-y-2">
                {g.items.map((i) => (
                  <li key={i} style={{ fontSize: "0.8125rem" }}>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: "#2c2f33", color: "#ffffff" }}>
        <div
          className="max-w-[1320px] mx-auto px-8 py-4 flex items-center justify-between"
          style={{ fontSize: "0.75rem", opacity: 0.85 }}
        >
          <span>© 1995–2026, The Dow Chemical Company</span>
          <span>® ™ Trademark of Dow or an affiliated company of Dow</span>
        </div>
      </div>
    </footer>
  );
}
