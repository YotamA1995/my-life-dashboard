import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SummaryCard from "../components/SummaryCard";
import ProductivityChart from "../components/ProductivityChart";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 mr-64">
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="pt-24 px-8 pb-12 max-w-[1440px] mx-auto">
          {/* Greeting */}
          <div className="mb-8">
            <h2 className="text-h1 text-primary">בוקר טוב, יותם 👋</h2>
            <p className="text-slate-500">הנה מה שקורה היום</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <SummaryCard
              title="יתרה כוללת"
              value="₪42,850"
              change="+2.4%"
              icon="account_balance_wallet"
              positive
            />

            <SummaryCard
              title="הוצאות החודש"
              value="₪8,200"
              change="-1.2%"
              icon="payments"
              positive={false}
            />

            <SummaryCard
              title="חיסכון"
              value="₪12,500"
              change="+4.1%"
              icon="savings"
              positive
            />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-gutter mt-8">
            <ProductivityChart />
          </div>
        </main>
      </div>
    </div>
  );
}