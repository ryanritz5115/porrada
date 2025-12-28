"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PosthogAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || window.posthog) return;

    // Wait for page to be fully loaded and idle
    const loadPostHog = () => {
      import("posthog-js").then(({ default: posthog }) => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
          capture_pageviews: false,
          capture_pageleave: true,
          autocapture: false, // Disable autocapture to reduce bundle
          session_recording: {
            maskAllInputs: false,
            maskTextSelector: null,
          },
          loaded: (ph) => {
            window.posthog = ph;
            ph.capture("$pageview");
          },
        });
      });
    };

    // More aggressive delay
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadPostHog, { timeout: 2000 });
      } else {
        loadPostHog();
      }
    }, 2000); // Wait 2 full seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.posthog) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}
