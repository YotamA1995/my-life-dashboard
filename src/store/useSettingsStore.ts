import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";
export type DashboardWidgetKey =
  | "finance"
  | "productivity"
  | "focus"
  | "activity"
  | "status";

export type DashboardWidgets = Record<DashboardWidgetKey, boolean>;

export type AppSettings = {
  theme: ThemePreference;
  dashboardWidgets: DashboardWidgets;
  savedAt?: string;
};

type SettingsStore = AppSettings & {
  saveSettings: (settings: Omit<AppSettings, "savedAt">) => void;
  setTheme: (theme: ThemePreference) => void;
  replaceSettings: (settings: unknown) => boolean;
};

export const defaultDashboardWidgets: DashboardWidgets = {
  finance: true,
  productivity: true,
  focus: true,
  activity: true,
  status: true,
};

export const defaultSettings: AppSettings = {
  theme: "system",
  dashboardWidgets: defaultDashboardWidgets,
};

function normalizeTheme(value: unknown): ThemePreference {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

function normalizeSavedAt(value: unknown) {
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) {
    return undefined;
  }

  return value;
}

export function normalizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object") {
    return defaultSettings;
  }

  const settings = value as {
    theme?: unknown;
    dashboardWidgets?: unknown;
    savedAt?: unknown;
  };
  const widgets =
    settings.dashboardWidgets &&
    typeof settings.dashboardWidgets === "object"
      ? (settings.dashboardWidgets as Partial<DashboardWidgets>)
      : {};

  return {
    theme: normalizeTheme(settings.theme),
    dashboardWidgets: {
      finance:
        typeof widgets.finance === "boolean"
          ? widgets.finance
          : defaultDashboardWidgets.finance,
      productivity:
        typeof widgets.productivity === "boolean"
          ? widgets.productivity
          : defaultDashboardWidgets.productivity,
      focus:
        typeof widgets.focus === "boolean"
          ? widgets.focus
          : defaultDashboardWidgets.focus,
      activity:
        typeof widgets.activity === "boolean"
          ? widgets.activity
          : defaultDashboardWidgets.activity,
      status:
        typeof widgets.status === "boolean"
          ? widgets.status
          : defaultDashboardWidgets.status,
    },
    savedAt: normalizeSavedAt(settings.savedAt),
  };
}

export function normalizeSettingsBackup(value: unknown): AppSettings | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const settings = value as {
    theme?: unknown;
    dashboardWidgets?: unknown;
    savedAt?: unknown;
  };

  if (
    (settings.theme !== "light" &&
      settings.theme !== "dark" &&
      settings.theme !== "system") ||
    !settings.dashboardWidgets ||
    typeof settings.dashboardWidgets !== "object"
  ) {
    return undefined;
  }

  const widgets = settings.dashboardWidgets as Record<string, unknown>;

  if (
    typeof widgets.finance !== "boolean" ||
    typeof widgets.productivity !== "boolean" ||
    typeof widgets.focus !== "boolean" ||
    typeof widgets.activity !== "boolean" ||
    typeof widgets.status !== "boolean" ||
    (settings.savedAt !== undefined &&
      (typeof settings.savedAt !== "string" ||
        Number.isNaN(new Date(settings.savedAt).getTime())))
  ) {
    return undefined;
  }

  return {
    theme: settings.theme,
    dashboardWidgets: {
      finance: widgets.finance,
      productivity: widgets.productivity,
      focus: widgets.focus,
      activity: widgets.activity,
      status: widgets.status,
    },
    savedAt: settings.savedAt as string | undefined,
  };
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      saveSettings(settings) {
        const normalizedSettings = normalizeSettings(settings);

        set({
          ...normalizedSettings,
          savedAt: new Date().toISOString(),
        });
      },

      setTheme(theme) {
        set({
          theme: normalizeTheme(theme),
          savedAt: new Date().toISOString(),
        });
      },

      replaceSettings(settings) {
        const normalizedSettings = normalizeSettingsBackup(settings);

        if (!normalizedSettings) {
          return false;
        }

        set(normalizedSettings);
        return true;
      },
    }),
    {
      name: "settings-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        dashboardWidgets: state.dashboardWidgets,
        savedAt: state.savedAt,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...normalizeSettings(persistedState),
      }),
    },
  ),
);
