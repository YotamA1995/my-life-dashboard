import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <Topbar />

      <div className="mr-64">
        <Outlet />
      </div>
    </div>
  );
}
