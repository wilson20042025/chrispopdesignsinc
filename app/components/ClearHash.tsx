"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClearHash() {
  const pathname = usePathname();

  useEffect(() => {
    // When the path changes or on initial mount, clear the hash if it's there
    // This prevents the :target lightbox from staying open on refresh
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [pathname]);

  return null;
}
