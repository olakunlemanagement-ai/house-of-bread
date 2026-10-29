"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";

/**
 * Shares the page: the phone's own share sheet where there is one,
 * otherwise the link is copied and a short line says so. Needs script, so
 * it stays hidden without it (data-js-only).
 */
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState("");

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // Closing the share sheet is not a failure.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setStatus("Copy the address from your browser to share this page.");
    }
  }

  return (
    <div data-js-only className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
      <Button variant="secondary" size="sm" onClick={share}>
        Share
      </Button>
      <p role="status" className="min-h-5 text-sm text-ink-muted">
        {status}
      </p>
    </div>
  );
}
