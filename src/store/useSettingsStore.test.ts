import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

class MemoryStorage implements Storage {
  private items = new Map<string, string>();

  get length() {
    return this.items.size;
  }

  clear() {
    this.items.clear();
  }

  getItem(key: string) {
    return this.items.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.items.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.items.delete(key);
  }

  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}

const storage = new MemoryStorage();
let storeModule: typeof import("./useSettingsStore");

beforeAll(async () => {
  vi.stubGlobal("localStorage", storage);
  storeModule = await import("./useSettingsStore");
});

beforeEach(() => {
  storage.clear();
  storeModule.useSettingsStore.setState({
    ...storeModule.defaultSettings,
    savedAt: undefined,
  });
});

describe("useSettingsStore", () => {
  it("saves theme and dashboard widget visibility", () => {
    storeModule.useSettingsStore.getState().saveSettings({
      theme: "dark",
      dashboardWidgets: {
        finance: true,
        productivity: true,
        focus: false,
        activity: true,
        status: false,
      },
    });

    const state = storeModule.useSettingsStore.getState();

    expect(state.theme).toBe("dark");
    expect(state.dashboardWidgets.focus).toBe(false);
    expect(state.dashboardWidgets.status).toBe(false);
    expect(state.savedAt).toBeTypeOf("string");
  });

  it("updates the theme directly from the top bar", () => {
    storeModule.useSettingsStore.getState().setTheme("light");
    expect(storeModule.useSettingsStore.getState().theme).toBe("light");
  });

  it("normalizes malformed and partial persisted settings", () => {
    expect(
      storeModule.normalizeSettings({
        theme: "unknown",
        dashboardWidgets: { focus: false, activity: "yes" },
        savedAt: "invalid",
      }),
    ).toEqual({
      theme: "system",
      dashboardWidgets: {
        finance: true,
        productivity: true,
        focus: false,
        activity: true,
        status: true,
      },
      savedAt: undefined,
    });
  });

  it("replaces settings only when a complete backup is valid", () => {
    const store = storeModule.useSettingsStore.getState();
    const invalidResult = store.replaceSettings({ theme: "dark" });

    expect(invalidResult).toBe(false);
    expect(storeModule.useSettingsStore.getState().theme).toBe("system");

    const validResult = storeModule.useSettingsStore.getState().replaceSettings({
      theme: "dark",
      dashboardWidgets: {
        finance: false,
        productivity: true,
        focus: true,
        activity: false,
        status: true,
      },
    });

    expect(validResult).toBe(true);
    expect(storeModule.useSettingsStore.getState()).toMatchObject({
      theme: "dark",
      dashboardWidgets: {
        finance: false,
        productivity: true,
        focus: true,
        activity: false,
        status: true,
      },
    });
  });
});
