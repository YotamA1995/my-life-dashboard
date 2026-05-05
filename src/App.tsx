import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import FinancePage from "./pages/FinancePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/finance" element={<FinancePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
