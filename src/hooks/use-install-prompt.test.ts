import { afterEach, describe, expect, it } from "vitest";
import { detectIOS } from "./use-install-prompt";

/** iPadOS 13+ reports the desktop Safari UA string, so a plain
 * /iPad|iPhone|iPod/ test misses every modern iPad — it is only
 * distinguishable from a real Mac by its touch points. */
function stubNavigator(userAgent: string, maxTouchPoints: number) {
  Object.defineProperty(window, "navigator", {
    value: { userAgent, maxTouchPoints },
    configurable: true,
  });
}

const realNavigator = Object.getOwnPropertyDescriptor(window, "navigator");

afterEach(() => {
  if (realNavigator) Object.defineProperty(window, "navigator", realNavigator);
});

describe("detectIOS", () => {
  it("detects iPhone", () => {
    stubNavigator("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15", 5);
    expect(detectIOS()).toBe(true);
  });

  it("detects legacy iPad", () => {
    stubNavigator("Mozilla/5.0 (iPad; CPU OS 12_0 like Mac OS X) AppleWebKit/605.1.15", 5);
    expect(detectIOS()).toBe(true);
  });

  it("detects iPadOS 13+ masquerading as Macintosh via touch points", () => {
    stubNavigator("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15", 5);
    expect(detectIOS()).toBe(true);
  });

  it("does not mistake a real Mac for iOS", () => {
    stubNavigator("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", 0);
    expect(detectIOS()).toBe(false);
  });

  it("does not match Android", () => {
    stubNavigator("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120", 5);
    expect(detectIOS()).toBe(false);
  });
});
