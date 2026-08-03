import { describe, expect, it } from "vitest";
import { getPwaNoticeKind, isStandaloneMode } from "./pwaUtils";

describe("PWA display helpers", () => {
  it("recognizes browser and iOS standalone modes", () => {
    expect(isStandaloneMode(true, false)).toBe(true);
    expect(isStandaloneMode(false, true)).toBe(true);
    expect(isStandaloneMode(false, false)).toBe(false);
  });

  it("prioritizes an available update over other notices", () => {
    expect(
      getPwaNoticeKind({
        isOnline: false,
        hasUpdate: true,
        canInstall: true,
        isInstalled: false,
        isOfflineReady: true,
      }),
    ).toBe("update");
  });

  it("shows only relevant notices", () => {
    expect(
      getPwaNoticeKind({
        isOnline: false,
        hasUpdate: false,
        canInstall: false,
        isInstalled: false,
        isOfflineReady: false,
      }),
    ).toBe("offline");

    expect(
      getPwaNoticeKind({
        isOnline: true,
        hasUpdate: false,
        canInstall: true,
        isInstalled: true,
        isOfflineReady: false,
      }),
    ).toBeNull();
  });
});
