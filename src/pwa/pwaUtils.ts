export type PwaNoticeKind = "update" | "offline" | "install" | "ready" | null;

type PwaNoticeState = {
  isOnline: boolean;
  hasUpdate: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  isOfflineReady: boolean;
};

export function isStandaloneMode(
  displayModeMatches: boolean,
  navigatorStandalone = false,
) {
  return displayModeMatches || navigatorStandalone;
}

export function getPwaNoticeKind({
  isOnline,
  hasUpdate,
  canInstall,
  isInstalled,
  isOfflineReady,
}: PwaNoticeState): PwaNoticeKind {
  if (hasUpdate) {
    return "update";
  }

  if (!isOnline) {
    return "offline";
  }

  if (canInstall && !isInstalled) {
    return "install";
  }

  if (isOfflineReady) {
    return "ready";
  }

  return null;
}
