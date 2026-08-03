import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import { getPwaNoticeKind, isStandaloneMode } from "../../pwa/pwaUtils";
import {
  activateWaitingServiceWorker,
  registerServiceWorker,
} from "../../pwa/registerServiceWorker";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

function isRunningStandalone() {
  return isStandaloneMode(
    window.matchMedia("(display-mode: standalone)").matches,
    Boolean((navigator as NavigatorWithStandalone).standalone),
  );
}

export default function PwaStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(isRunningStandalone);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const [isInstallDismissed, setIsInstallDismissed] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [updateRegistration, setUpdateRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    function handleInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setIsInstallDismissed(false);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    const unregisterListeners = registerServiceWorker({
      onOfflineReady: () => setIsOfflineReady(true),
      onUpdateAvailable: setUpdateRegistration,
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      unregisterListeners();
    };
  }, []);

  useEffect(() => {
    if (!isOfflineReady) {
      return;
    }

    const timeout = window.setTimeout(() => setIsOfflineReady(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [isOfflineReady]);

  const noticeKind = useMemo(
    () =>
      getPwaNoticeKind({
        isOnline,
        hasUpdate: Boolean(updateRegistration),
        canInstall: Boolean(installPrompt) && !isInstallDismissed,
        isInstalled,
        isOfflineReady,
      }),
    [
      installPrompt,
      isInstallDismissed,
      isInstalled,
      isOfflineReady,
      isOnline,
      updateRegistration,
    ],
  );

  async function handleInstall() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    setInstallPrompt(null);
    setIsInstallDismissed(outcome === "dismissed");
  }

  if (!noticeKind) {
    return null;
  }

  const noticeContent = {
    update: {
      icon: "system_update_alt",
      title: "גרסה חדשה זמינה",
      description: "עדכון מהיר יטען את השיפורים האחרונים.",
    },
    offline: {
      icon: "cloud_off",
      title: "אין כרגע חיבור לרשת",
      description: "אפשר להמשיך לעבוד עם המידע ששמור במכשיר.",
    },
    install: {
      icon: "install_mobile",
      title: "התקנת LifeHub במכשיר",
      description: "גישה מהירה ממסך הבית ועבודה גם ללא רשת.",
    },
    ready: {
      icon: "offline_pin",
      title: "LifeHub מוכן לעבודה ללא רשת",
      description: "האפליקציה נשמרה במכשיר וזמינה לשימוש.",
    },
  }[noticeKind];

  return (
    <aside
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/95 p-4 text-on-surface shadow-xl backdrop-blur dark:border-slate-700"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="material-symbols-outlined mt-0.5 text-primary"
        >
          {noticeContent.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{noticeContent.title}</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {noticeContent.description}
          </p>

          {noticeKind === "install" && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => void handleInstall()}>
                התקנה
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsInstallDismissed(true)}
              >
                לא עכשיו
              </Button>
            </div>
          )}

          {noticeKind === "update" && updateRegistration && (
            <Button
              className="mt-3"
              size="sm"
              onClick={() => activateWaitingServiceWorker(updateRegistration)}
            >
              עדכון עכשיו
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
