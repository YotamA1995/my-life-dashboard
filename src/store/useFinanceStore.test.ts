import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

class MemoryStorage implements Storage {
  private items = new Map<string, string>();

  get length() {
    return this.items.size;
  }

  clear() {
    this.items.clear();
  }

  getItem(key: string) {
    return this.items.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.items.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.items.delete(key);
  }

  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}

const storage = new MemoryStorage();
let storeModule: typeof import("./useFinanceStore");

beforeAll(async () => {
  vi.stubGlobal("localStorage", storage);
  storeModule = await import("./useFinanceStore");
});

beforeEach(() => {
  storage.clear();
  storeModule.useFinanceStore.setState({ transactions: [], budgets: [] });
});

describe("useFinanceStore", () => {
  it("adds, updates and deletes a transaction", () => {
    const id = storeModule.useFinanceStore.getState().addTransaction({
      title: "  קניות  ",
      category: "מזון",
      amount: 84.2,
      type: "expense",
      status: "completed",
      date: "2026-08-03",
      note: "כרטיס",
    });

    expect(id).toBeTypeOf("string");
    expect(storeModule.useFinanceStore.getState().transactions[0]).toMatchObject({
      title: "קניות",
      amount: 84.2,
      category: "מזון",
    });

    storeModule.useFinanceStore.getState().updateTransaction(id!, {
      title: "קניות שבועיות",
      category: "מזון",
      amount: 90,
      type: "expense",
      status: "pending",
      date: "2026-08-03",
      note: "",
    });

    expect(storeModule.useFinanceStore.getState().transactions[0]).toMatchObject({
      title: "קניות שבועיות",
      amount: 90,
      status: "pending",
    });

    const deleted = storeModule.useFinanceStore.getState().deleteTransaction(id!);
    expect(deleted?.id).toBe(id);
    expect(storeModule.useFinanceStore.getState().transactions).toHaveLength(0);
  });

  it("rejects transactions without a valid title, category or amount", () => {
    const result = storeModule.useFinanceStore.getState().addTransaction({
      title: "",
      category: "",
      amount: 0,
      type: "expense",
      status: "completed",
      date: "2026-08-03",
      note: "",
    });

    expect(result).toBeUndefined();
    expect(storeModule.useFinanceStore.getState().transactions).toHaveLength(0);
  });

  it("creates, updates and deletes category budgets", () => {
    const store = storeModule.useFinanceStore.getState();

    store.setBudget("מזון", 600);
    expect(storeModule.useFinanceStore.getState().budgets).toEqual([
      { category: "מזון", amount: 600 },
    ]);

    storeModule.useFinanceStore.getState().setBudget("מזון", 750);
    expect(storeModule.useFinanceStore.getState().budgets[0].amount).toBe(750);

    storeModule.useFinanceStore.getState().deleteBudget("מזון");
    expect(storeModule.useFinanceStore.getState().budgets).toHaveLength(0);
  });
});
