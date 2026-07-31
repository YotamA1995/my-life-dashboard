import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "./useTasksStore";

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
let storeModule: typeof import("./useTasksStore");

beforeAll(async () => {
  vi.stubGlobal("localStorage", storage);
  storeModule = await import("./useTasksStore");
});

beforeEach(() => {
  storage.clear();
  storeModule.useTasksStore.setState({ tasks: [] });
});

describe("useTasksStore", () => {
  it("preserves priority when completing and reopening a task", () => {
    const taskId = storeModule.useTasksStore
      .getState()
      .addTask("משימה דחופה", "todo", "2026-08-01", "high");

    expect(taskId).toBeTypeOf("string");

    storeModule.useTasksStore.getState().moveTask(taskId!, "done");
    let task = storeModule.useTasksStore
      .getState()
      .tasks.find((item) => item.id === taskId);

    expect(task?.priority).toBe("high");
    expect(task?.completedAt).toBeTypeOf("string");

    storeModule.useTasksStore.getState().moveTask(taskId!, "todo");
    task = storeModule.useTasksStore
      .getState()
      .tasks.find((item) => item.id === taskId);

    expect(task?.priority).toBe("high");
    expect(task?.completedAt).toBeUndefined();
  });

  it("returns a deleted task and can restore it", () => {
    const taskId = storeModule.useTasksStore
      .getState()
      .addTask("משימה לשחזור");
    const deletedTask = storeModule.useTasksStore
      .getState()
      .deleteTask(taskId!);

    expect(deletedTask?.title).toBe("משימה לשחזור");
    expect(storeModule.useTasksStore.getState().tasks).toHaveLength(0);

    storeModule.useTasksStore.getState().restoreTask(deletedTask!);

    expect(storeModule.useTasksStore.getState().tasks).toEqual([deletedTask]);
  });

  it("rejects invalid backup data without replacing current tasks", () => {
    storeModule.useTasksStore.getState().addTask("משימה קיימת");

    const result = storeModule.useTasksStore
      .getState()
      .replaceTasks([{ id: "missing-title" }]);

    expect(result).toBeUndefined();
    expect(storeModule.useTasksStore.getState().tasks).toHaveLength(1);
  });

  it("migrates old completed priorities and adds timestamps", () => {
    const oldTask = {
      id: "old-task",
      title: "משימה ישנה",
      description: "",
      dueDate: "2026-07-31",
      status: "done",
      priority: "completed",
      category: "project",
      completedAt: "2026-07-31T12:00:00.000Z",
    };

    const migratedTask = storeModule.normalizeTask(oldTask as unknown as Task);

    expect(migratedTask.priority).toBe("medium");
    expect(migratedTask.createdAt).toBeTypeOf("string");
    expect(migratedTask.updatedAt).toBeTypeOf("string");
    expect(migratedTask.completedAt).toBe(oldTask.completedAt);
  });
});
