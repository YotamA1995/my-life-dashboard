import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import FinancePage from "./pages/FinancePage";
import SchedulePage from "./pages/SchedulePage";
import MainLayout from "./layouts/MainLayout";
import TasksPage from "./pages/TasksPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
