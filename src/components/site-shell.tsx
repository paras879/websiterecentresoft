"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps public pages with the header and footer. The admin area gets neither, so it can use the
 * whole screen. The header and footer are rendered on the server and handed in as props.
 */
export function SiteShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="app-shell">
        {header}
        <main id="main-content" className="site-main">
          {children}
        </main>
        {footer}
      </div>
    </>
  );
}
