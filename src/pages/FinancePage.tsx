import { useMemo, useState } from "react";
import { Button, Input, Modal } from "../components/ui";
import {
  useFinanceStore,
  type FinanceTransaction,
  type TransactionInput,
  type TransactionStatus,
  type TransactionType,
} from "../store/useFinanceStore";
import { APP_TIME_ZONE, getTodayDate } from "../utils/dateUtils";

const categorySuggestions = [
  "דיור",
  "מזון",
  "תחבורה",
  "חשבונות",
  "בריאות",
  "בילוי",
  "הכנסה",
  "אחר",
];

const currencyFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 2,
});

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

function formatDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat("he-IL", {
    timeZone: APP_TIME_ZONE,
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);

  return new Intl.DateTimeFormat("he-IL", {
    timeZone: APP_TIME_ZONE,
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1, 12)));
}

type TransactionFormProps = {
  transaction?: FinanceTransaction;
  onClose: () => void;
};

function TransactionForm({ transaction, onClose }: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const [title, setTitle] = useState(transaction?.title ?? "");
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [amount, setAmount] = useState(
    transaction ? transaction.amount.toString() : "",
  );
  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "expense",
  );
  const [status, setStatus] = useState<TransactionStatus>(
    transaction?.status ?? "completed",
  );
  const [date, setDate] = useState(transaction?.date ?? getTodayDate());
  const [note, setNote] = useState(transaction?.note ?? "");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!title.trim() || !category.trim() || numericAmount <= 0) {
      setError("יש להזין תיאור, קטגוריה וסכום גדול מאפס.");
      return;
    }

    const input: TransactionInput = {
      title,
      category,
      amount: numericAmount,
      type,
      status,
      date,
      note,
    };

    if (transaction) {
      updateTransaction(transaction.id, input);
    } else {
      addTransaction(input);
    }

    onClose();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        id="finance-title"
        label="תיאור העסקה"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="לדוגמה: קניות בסופר"
        autoFocus
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="finance-category" className="text-label-lg font-medium">
            קטגוריה
          </label>
          <input
            id="finance-category"
            list="finance-categories"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-xl border border-outline-variant bg-surface px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="בחר או כתוב קטגוריה"
          />
          <datalist id="finance-categories">
            {categorySuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <Input
          id="finance-amount"
          label="סכום"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2 text-label-lg font-medium">
          סוג
          <select
            value={type}
            onChange={(event) => setType(event.target.value as TransactionType)}
            className="h-11 rounded-xl border border-outline-variant bg-surface px-4 font-normal outline-none focus:border-primary"
          >
            <option value="expense">הוצאה</option>
            <option value="income">הכנסה</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-label-lg font-medium">
          סטטוס
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TransactionStatus)
            }
            className="h-11 rounded-xl border border-outline-variant bg-surface px-4 font-normal outline-none focus:border-primary"
          >
            <option value="completed">הושלם</option>
            <option value="pending">בהמתנה</option>
          </select>
        </label>

        <Input
          id="finance-date"
          label="תאריך"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <label className="flex flex-col gap-2 text-label-lg font-medium">
        הערה
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-24 rounded-xl border border-outline-variant bg-surface px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="אמצעי תשלום או מידע נוסף"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          ביטול
        </Button>
        <Button type="submit">
          {transaction ? "שמירת שינויים" : "הוספת עסקה"}
        </Button>
      </div>
    </form>
  );
}

type BudgetFormProps = {
  initialCategory?: string;
  initialAmount?: number;
  onClose: () => void;
};

function BudgetForm({ initialCategory = "", initialAmount, onClose }: BudgetFormProps) {
  const setBudget = useFinanceStore((state) => state.setBudget);
  const [category, setCategory] = useState(initialCategory);
  const [amount, setAmount] = useState(initialAmount?.toString() ?? "");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!category.trim() || numericAmount <= 0) {
      setError("יש להזין קטגוריה וסכום תקציב גדול מאפס.");
      return;
    }

    setBudget(category, numericAmount);
    onClose();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        id="budget-category"
        label="קטגוריה"
        list="finance-categories"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        disabled={Boolean(initialCategory)}
        placeholder="לדוגמה: מזון"
      />
      <Input
        id="budget-amount"
        label="תקציב חודשי"
        type="number"
        min="0.01"
        step="0.01"
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="0.00"
      />
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button type="submit">שמירת תקציב</Button>
      </div>
    </form>
  );
}

export default function FinancePage() {
  const { transactions, budgets, deleteTransaction, deleteBudget } =
    useFinanceStore();
  const [selectedMonth, setSelectedMonth] = useState(
    getTodayDate().slice(0, 7),
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<FinanceTransaction | null>(null);
  const [budgetEditor, setBudgetEditor] = useState<{
    category?: string;
    amount?: number;
  } | null>(null);

  const monthTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.date.startsWith(selectedMonth)),
    [selectedMonth, transactions],
  );

  const completedTransactions = monthTransactions.filter(
    (transaction) => transaction.status === "completed",
  );
  const income = completedTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = completedTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const pending = monthTransactions
    .filter((transaction) => transaction.status === "pending")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const visibleTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("he-IL");

    return monthTransactions
      .filter((transaction) =>
        typeFilter === "all" ? true : transaction.type === typeFilter,
      )
      .filter((transaction) => {
        if (!normalizedSearch) {
          return true;
        }

        return [transaction.title, transaction.category, transaction.note].some(
          (value) => value.toLocaleLowerCase("he-IL").includes(normalizedSearch),
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [monthTransactions, search, typeFilter]);

  function closeTransactionModal() {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  }

  function handleDeleteTransaction(transaction: FinanceTransaction) {
    if (window.confirm(`למחוק את העסקה „${transaction.title}”?`)) {
      deleteTransaction(transaction.id);
    }
  }

  function handleDeleteBudget(category: string) {
    if (window.confirm(`למחוק את התקציב של „${category}”?`)) {
      deleteBudget(category);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-surface px-4 pb-8 pt-20 text-on-surface sm:px-6 sm:pb-10 lg:px-8 lg:pb-12 lg:pt-24">
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">תמונת מצב חודשית</p>
          <h2 className="mt-1 text-2xl font-semibold text-primary sm:text-h1">
            {getMonthLabel(selectedMonth)}
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            aria-label="בחירת חודש"
            className="h-11 rounded-xl border border-outline-variant bg-white px-4 outline-none focus:border-primary"
          />
          <Button onClick={() => setIsTransactionModalOpen(true)}>
            <span className="material-symbols-outlined text-lg">add</span>
            עסקה חדשה
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "הכנסות", value: income, icon: "trending_up", tone: "text-on-tertiary-container" },
          { label: "הוצאות", value: expenses, icon: "trending_down", tone: "text-error" },
          { label: "מאזן חודשי", value: income - expenses, icon: "account_balance_wallet", tone: income - expenses >= 0 ? "text-on-tertiary-container" : "text-error" },
          { label: "בהמתנה", value: pending, icon: "schedule", tone: "text-secondary" },
        ].map((item) => (
          <article key={item.label} className="rounded-xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-on-surface-variant">{item.label}</p>
                <p className={`mt-2 text-2xl font-bold ${item.tone}`}>{formatCurrency(item.value)}</p>
              </div>
              <span className={`material-symbols-outlined ${item.tone}`}>{item.icon}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-h3 text-primary">תקציב לפי קטגוריה</h3>
            <p className="text-sm text-on-surface-variant">מול הוצאות שהושלמו בחודש הנבחר</p>
          </div>
          <Button variant="outline" onClick={() => setBudgetEditor({})}>
            הגדרת תקציב
          </Button>
        </div>

        {budgets.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low p-6 text-center text-sm text-on-surface-variant">
            עדיין לא הוגדרו תקציבים. הוסף קטגוריה כדי להתחיל לעקוב.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {budgets.map((budget) => {
              const spent = completedTransactions
                .filter((transaction) => transaction.type === "expense" && transaction.category === budget.category)
                .reduce((sum, transaction) => sum + transaction.amount, 0);
              const percentage = Math.min(100, (spent / budget.amount) * 100);
              const exceeded = spent > budget.amount;

              return (
                <article key={budget.category} className="rounded-xl border border-outline-variant/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-primary">{budget.category}</p>
                      <p className={`mt-1 text-sm ${exceeded ? "text-error" : "text-on-surface-variant"}`}>
                        {formatCurrency(spent)} מתוך {formatCurrency(budget.amount)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" aria-label={`עריכת תקציב ${budget.category}`} onClick={() => setBudgetEditor(budget)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button type="button" aria-label={`מחיקת תקציב ${budget.category}`} onClick={() => handleDeleteBudget(budget.category)} className="rounded-lg p-2 text-slate-500 hover:bg-error-container hover:text-error">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-surface-container-low">
                    <div className={`h-full rounded-full ${exceeded ? "bg-error" : "bg-on-tertiary-container"}`} style={{ width: `${percentage}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-h3 text-primary">עסקאות</h3>
            <p className="text-sm text-on-surface-variant">{visibleTransactions.length} תוצאות בחודש הנבחר</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-lg text-outline">search</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="חיפוש בעסקאות" className="h-11 w-full rounded-xl border border-outline-variant bg-surface pr-10 pl-4 outline-none focus:border-primary sm:w-64" />
            </div>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "all" | TransactionType)} aria-label="סינון לפי סוג עסקה" className="h-11 rounded-xl border border-outline-variant bg-surface px-4 outline-none focus:border-primary">
              <option value="all">כל הסוגים</option>
              <option value="expense">הוצאות</option>
              <option value="income">הכנסות</option>
            </select>
          </div>
        </div>

        {visibleTransactions.length === 0 ? (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-outline">receipt_long</span>
            <p className="mt-3 font-semibold text-primary">אין עסקאות להצגה</p>
            <p className="mt-1 text-sm text-on-surface-variant">אפשר להוסיף עסקה חדשה או לשנות את הסינון.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 md:hidden">
              {visibleTransactions.map((transaction) => (
                <article key={transaction.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-primary">{transaction.title}</p>
                      <p className="mt-1 text-xs text-on-surface-variant">{transaction.category} · {formatDate(transaction.date)}</p>
                      {transaction.note ? <p className="mt-2 text-sm text-on-surface-variant">{transaction.note}</p> : null}
                    </div>
                    <p className={`flex-shrink-0 font-bold ${transaction.type === "income" ? "text-on-tertiary-container" : "text-primary"}`}>
                      {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${transaction.status === "pending" ? "bg-error-container text-on-error-container" : "bg-on-tertiary-container/10 text-on-tertiary-container"}`}>
                      {transaction.status === "pending" ? "בהמתנה" : "הושלם"}
                    </span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setEditingTransaction(transaction)} aria-label="עריכת עסקה" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><span className="material-symbols-outlined text-lg">edit</span></button>
                      <button type="button" onClick={() => handleDeleteTransaction(transaction)} aria-label="מחיקת עסקה" className="rounded-lg p-2 text-slate-500 hover:bg-error-container hover:text-error"><span className="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-right">
                <thead className="bg-surface-container-low text-xs text-on-surface-variant">
                  <tr><th className="px-6 py-4">עסקה</th><th className="px-6 py-4">קטגוריה</th><th className="px-6 py-4">תאריך</th><th className="px-6 py-4">סכום</th><th className="px-6 py-4">סטטוס</th><th className="px-6 py-4"><span className="sr-only">פעולות</span></th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50/60">
                      <td className="px-6 py-4"><p className="font-semibold text-primary">{transaction.title}</p>{transaction.note ? <p className="max-w-xs truncate text-xs text-on-surface-variant">{transaction.note}</p> : null}</td>
                      <td className="px-6 py-4 text-sm">{transaction.category}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(transaction.date)}</td>
                      <td className={`px-6 py-4 font-bold ${transaction.type === "income" ? "text-on-tertiary-container" : "text-primary"}`}>{transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${transaction.status === "pending" ? "bg-error-container text-on-error-container" : "bg-on-tertiary-container/10 text-on-tertiary-container"}`}>{transaction.status === "pending" ? "בהמתנה" : "הושלם"}</span></td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => setEditingTransaction(transaction)} aria-label="עריכת עסקה" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><span className="material-symbols-outlined text-lg">edit</span></button><button type="button" onClick={() => handleDeleteTransaction(transaction)} aria-label="מחיקת עסקה" className="rounded-lg p-2 text-slate-500 hover:bg-error-container hover:text-error"><span className="material-symbols-outlined text-lg">delete</span></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <Modal open={isTransactionModalOpen || Boolean(editingTransaction)} title={editingTransaction ? "עריכת עסקה" : "עסקה חדשה"} description="הנתונים נשמרים מקומית בדפדפן שלך." onClose={closeTransactionModal}>
        <TransactionForm key={editingTransaction?.id ?? "new-transaction"} transaction={editingTransaction ?? undefined} onClose={closeTransactionModal} />
      </Modal>

      <Modal open={Boolean(budgetEditor)} title={budgetEditor?.category ? "עריכת תקציב" : "תקציב חדש"} description="התקציב משמש להשוואה מול הוצאות שהושלמו בכל חודש." onClose={() => setBudgetEditor(null)}>
        {budgetEditor ? <BudgetForm key={budgetEditor.category ?? "new-budget"} initialCategory={budgetEditor.category} initialAmount={budgetEditor.amount} onClose={() => setBudgetEditor(null)} /> : null}
      </Modal>
    </main>
  );
}
