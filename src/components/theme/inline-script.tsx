/**
 * Renders a synchronous inline `<script>` using next/script with afterInteractive strategy
 * to apply theme early and avoid flash. The script is small and fast enough to run
 * before the first meaningful paint in most cases.
 */
import Script from "next/script";

export function InlineScript({ html }: { html: string }) {
  return (
    <Script
      id="theme-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
