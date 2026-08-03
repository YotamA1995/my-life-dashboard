type ServiceWorkerCallbacks = {
  onOfflineReady: () => void;
  onUpdateAvailable: (registration: ServiceWorkerRegistration) => void;
};

export function registerServiceWorker({
  onOfflineReady,
  onUpdateAvailable,
}: ServiceWorkerCallbacks) {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return () => undefined;
  }

  let isRefreshing = false;

  function handleControllerChange() {
    if (isRefreshing) {
      return;
    }

    isRefreshing = true;
    window.location.reload();
  }

  function startRegistration() {
    void navigator.serviceWorker.register("/sw.js").then((registration) => {
      if (registration.waiting) {
        onUpdateAvailable(registration);
      }

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state !== "installed") {
            return;
          }

          if (navigator.serviceWorker.controller) {
            onUpdateAvailable(registration);
          } else {
            onOfflineReady();
          }
        });
      });
    });
  }

  navigator.serviceWorker.addEventListener(
    "controllerchange",
    handleControllerChange,
  );

  if (document.readyState === "complete") {
    startRegistration();
  } else {
    window.addEventListener("load", startRegistration, { once: true });
  }

  return () => {
    window.removeEventListener("load", startRegistration);
    navigator.serviceWorker.removeEventListener(
      "controllerchange",
      handleControllerChange,
    );
  };
}

export function activateWaitingServiceWorker(
  registration: ServiceWorkerRegistration,
) {
  registration.waiting?.postMessage({ type: "SKIP_WAITING" });
}
