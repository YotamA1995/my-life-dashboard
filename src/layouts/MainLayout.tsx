import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useSettingsStore } from "../store/useSettingsStore";

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      const resolvedTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;

      document.documentElement.dataset.theme = resolvedTheme;
      document.documentElement.style.colorScheme = resolvedTheme;
    }

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-on-surface">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      <Topbar onMenuOpen={() => setIsMobileMenuOpen(true)} />

      <div className="lg:mr-64">
        <Outlet />
      </div>
    </div>
  );
}
