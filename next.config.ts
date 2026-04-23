import type { NextConfig } from "next";
import { normalizeBackendApiOrigin } from "./src/lib/backend-api-url";

const backendOrigin = normalizeBackendApiOrigin(process.env.NEXT_PUBLIC_API_URL);

function backendHostnameForImages(): string | undefined {
  if (!backendOrigin) return undefined;
  try {
    const href = backendOrigin.includes("://")
      ? backendOrigin
      : `http://${backendOrigin}`;
    return new URL(href).hostname;
  } catch {
    return undefined;
  }
}

const backendImageHost = backendHostnameForImages();

const nextConfig: NextConfig = {
  // Optimize tree-shaking for large icon/UI packages so only used icons are bundled
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tabler/icons-react",
      "@mdi/react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "date-fns",
      "recharts",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.89.211.92",
        pathname: "/storage/categories/**",
      },
      ...(backendImageHost
        ? [
            {
              protocol: "http" as const,
              hostname: backendImageHost,
              pathname: "/storage/categories/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "getcover-production-s3.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  /**
   * Unhandled /api/... fall back to the real API (src/lib/backend-api-url.ts).
   * App Router handlers under src/app/api (e.g. route.ts) run first, not this pass-through.
   */
  async rewrites() {
    if (!backendOrigin) {
      return { fallback: [] };
    }
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${backendOrigin}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
