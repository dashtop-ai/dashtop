/**
 * DashtopApp — Base class for building killer apps.
 *
 * Every app gets for free:
 * - Header with icon, name, status, pill actions
 * - Tab bar for switching modes
 * - Quick action chips
 * - Loading/error states
 * - Scrollable content area
 * - Chat input with history
 * - Local state persistence
 * - Re-render helpers
 *
 * Implement: renderContent() + onChat(). That's it.
 * Optional: tabs, quickActions, onRun, onStop, onUpdate, onTabChange
 *
 * @example
 * ```ts
 * class MyApp extends DashtopApp {
 *   name = "My App";
 *   icon = "🚀";
 *   color = "#7c3aed";
 *   tabs = ["Main", "History"];
 *   quickActions = [
 *     { label: "Action 1", onClick: () => this.doThing() },
 *   ];
 *
 *   renderContent(container) { ... }
 *   async onChat(message) { return "response"; }
 * }
 * export default new MyApp().asWidget();
 * ```
 */

import { defineWidget, type WidgetRenderFn } from "./index";

// ── Types ─────────────────────────────────────

export interface QuickAction {
  label: string;
  icon?: string;
  active?: boolean;
  onClick: () => void;
}

export interface ListItem {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: string;
  icon?: string;
  checked?: boolean;
  onClick?: () => void;
  onCheck?: (checked: boolean) => void;
}

// ── Base Class ────────────────────────────────

export abstract class DashtopApp<TConfig = Record<string, unknown>> {
  // ── REQUIRED: Override these ─────────────────

  abstract name: string;
  abstract icon: string;
  abstract color: string;

  // ── OPTIONAL: Override these ─────────────────

  /** Chat placeholder text */
  placeholder = "Type a message...";
  /** Tab names — set to enable tab bar */
  tabs: string[] = [];
  /** Quick action chips shown below tabs */
  quickActions: QuickAction[] = [];
  /** Show chat input (default true) */
  showChat = true;

  // ── State (accessible in subclass) ──────────

  protected root: HTMLElement | null = null;
  protected config: TConfig = {} as TConfig;
  protected isEditing = false;
  protected onConfigChange: (patch: Partial<TConfig>) => void = () => {};

  /** Current status */
  status: "idle" | "running" | "stopped" = "idle";
  /** Current active tab (0-indexed) */
  activeTab = 0;
  /** Chat history */
  chatHistory: { role: "user" | "app"; text: string }[] = [];
  /** Loading flag — shows spinner overlay */
  loading = false;
  /** Error message — shows error banner */
  error: string | null = null;

  // Local state store (persists across renders)
  private _store: Record<string, unknown> = {};

  // ── REQUIRED: Implement these ───────────────

  abstract renderContent(container: HTMLElement): void;
  abstract onChat(message: string): Promise<string> | string;

  // ── OPTIONAL: Override these ─────────────────

  onRun(): void { this.status = "running"; }
  onStop(): void { this.status = "stopped"; }
  onUpdate(): void { this.status = "running"; }
  onTabChange(_index: number): void {}

  // ── Helpers for subclasses ──────────────────

  /** Store a value in local state (survives re-renders) */
  setState(key: string, value: unknown): void {
    this._store[key] = value;
  }

  /** Get a value from local state */
  getState<T = unknown>(key: string, fallback?: T): T {
    return (this._store[key] as T) ?? (fallback as T);
  }

  /** Set loading state and re-render */
  setLoading(loading: boolean): void {
    this.loading = loading;
    this.refresh();
  }

  /** Set error state and re-render */
  setError(error: string | null): void {
    this.error = error;
    this.refresh();
  }

  /** Re-render just the content area (fast) */
  refresh(): void {
    if (!this.root) return;
    const content = this.root.querySelector("#da-content") as HTMLElement;
    if (content) {
      if (this.loading) {
        content.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;gap:8px;color:#999;">
          <span style="animation:spin 1s linear infinite;display:inline-block;">⏳</span>
          <span style="font-size:13px;">Working...</span>
        </div>`;
        return;
      }
      if (this.error) {
        content.innerHTML = `<div style="padding:12px;margin:12px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:12px;">
          ⚠️ ${this.error}
        </div>`;
        return;
      }
      this.renderContent(content);
    }
  }

  /** Render a list of items — common pattern */
  renderList(container: HTMLElement, items: ListItem[]): void {
    if (items.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:24px;color:#999;font-size:13px;">No items</div>`;
      return;
    }
    container.innerHTML = items.map(item => `
      <div data-id="${item.id}" style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid #f4f4f5;cursor:${item.onClick || item.onCheck ? 'pointer' : 'default'};">
        ${item.onCheck !== undefined ? `<input type="checkbox" data-check="${item.id}" ${item.checked ? 'checked' : ''} style="accent-color:${this.color};" />` : ''}
        ${item.icon ? `<span style="font-size:14px;">${item.icon}</span>` : ''}
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:500;${item.checked ? 'text-decoration:line-through;color:#999;' : ''}">${item.label}</div>
          ${item.sublabel ? `<div style="font-size:10px;color:#888;">${item.sublabel}</div>` : ''}
        </div>
        ${item.badge ? `<span style="font-size:10px;padding:1px 6px;border-radius:8px;background:${item.badgeColor || '#f0f0f0'};color:${item.badgeColor ? 'white' : '#666'};">${item.badge}</span>` : ''}
      </div>
    `).join("");

    // Bind click handlers
    items.forEach(item => {
      const el = container.querySelector(`[data-id="${item.id}"]`) as HTMLElement;
      if (item.onClick) el?.addEventListener("click", item.onClick);
      const checkbox = container.querySelector(`[data-check="${item.id}"]`) as HTMLInputElement;
      if (item.onCheck && checkbox) {
        checkbox.addEventListener("change", () => item.onCheck!(checkbox.checked));
      }
    });
  }

  // ── Rendering Engine ────────────────────────

  private render(): void {
    if (!this.root) return;

    const sc = this.status === "running" ? "#22c55e" : this.status === "stopped" ? "#f87171" : "#a1a1aa";
    const hasTabs = this.tabs.length > 0;
    const hasQuick = this.quickActions.length > 0;

    this.root.innerHTML = `
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      <div style="display:flex;flex-direction:column;height:100%;font-family:system-ui,-apple-system,sans-serif;background:white;color:#1a1a2e;">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #eee;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:28px;height:28px;border-radius:8px;background:${this.color};display:flex;align-items:center;justify-content:center;font-size:14px;">${this.icon}</div>
            <div>
              <div style="font-size:12px;font-weight:600;">${this.name}</div>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="width:6px;height:6px;border-radius:50%;background:${sc};"></span>
                <span style="font-size:10px;color:#888;text-transform:capitalize;">${this.status}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:2px;background:#f4f4f5;border-radius:20px;padding:2px;">
            <button id="da-update" title="Update" style="padding:4px;border-radius:50%;border:none;background:transparent;cursor:pointer;font-size:12px;line-height:1;">🔄</button>
            <button id="da-run" title="Run" style="padding:4px;border-radius:50%;border:none;background:transparent;cursor:pointer;font-size:12px;line-height:1;color:#16a34a;">▶</button>
            <button id="da-stop" title="Stop" style="padding:4px;border-radius:50%;border:none;background:transparent;cursor:pointer;font-size:12px;line-height:1;color:#ef4444;">⬛</button>
          </div>
        </div>

        ${hasTabs ? `
        <!-- Tabs -->
        <div style="display:flex;border-bottom:1px solid #eee;padding:0 12px;">
          ${this.tabs.map((tab, i) => `
            <button class="da-tab" data-tab="${i}" style="padding:6px 12px;font-size:11px;border:none;background:transparent;cursor:pointer;border-bottom:2px solid ${i === this.activeTab ? this.color : 'transparent'};color:${i === this.activeTab ? this.color : '#888'};font-weight:${i === this.activeTab ? '600' : '400'};">${tab}</button>
          `).join("")}
        </div>` : ''}

        ${hasQuick ? `
        <!-- Quick actions -->
        <div style="display:flex;gap:4px;padding:8px 12px;overflow-x:auto;flex-wrap:wrap;">
          ${this.quickActions.map((a, i) => `
            <button class="da-quick" data-qi="${i}" style="padding:3px 8px;font-size:11px;border:1px solid ${a.active ? this.color : '#ddd'};border-radius:12px;background:${a.active ? this.color : 'white'};color:${a.active ? 'white' : '#666'};cursor:pointer;white-space:nowrap;">${a.icon ? a.icon + ' ' : ''}${a.label}</button>
          `).join("")}
        </div>` : ''}

        <!-- Content -->
        <div id="da-content" style="flex:1;overflow:auto;min-height:0;"></div>

        ${this.chatHistory.length > 0 ? `
        <!-- Chat history -->
        <div id="da-chat" style="overflow:auto;max-height:100px;padding:4px 12px;border-top:1px solid #eee;">
          ${this.chatHistory.map(m => `
            <div style="font-size:11px;padding:2px 0;color:${m.role === 'user' ? '#1a1a2e' : '#666'};${m.role === 'user' ? 'font-weight:500;' : ''}">
              <span style="color:${m.role === 'user' ? this.color : '#999'};">${m.role === 'user' ? 'you' : 'ai'}:</span> ${m.text}
            </div>
          `).join("")}
        </div>` : ''}

        ${this.showChat ? `
        <!-- Chat input -->
        <form id="da-form" style="display:flex;align-items:center;gap:6px;padding:8px 12px;border-top:1px solid #eee;">
          <input id="da-input" type="text" placeholder="${this.placeholder}" style="flex:1;padding:6px 10px;border:1px solid #e5e5e5;border-radius:8px;font-size:12px;outline:none;background:#fafafa;" />
          <button type="submit" style="padding:6px 10px;background:${this.color};color:white;border:none;border-radius:8px;font-size:11px;cursor:pointer;">Send</button>
        </form>` : ''}
      </div>
    `;

    // Render content
    const contentEl = this.root.querySelector("#da-content") as HTMLElement;
    if (contentEl) {
      if (this.loading) {
        contentEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;gap:8px;color:#999;"><span style="animation:spin 1s linear infinite;display:inline-block;">⏳</span><span style="font-size:13px;">Working...</span></div>`;
      } else if (this.error) {
        contentEl.innerHTML = `<div style="padding:12px;margin:12px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:12px;">⚠️ ${this.error}</div>`;
      } else {
        this.renderContent(contentEl);
      }
    }

    // Scroll chat
    const chatEl = this.root.querySelector("#da-chat") as HTMLElement;
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;

    // Bind pill
    this.root.querySelector("#da-update")?.addEventListener("click", () => { this.onUpdate(); this.render(); });
    this.root.querySelector("#da-run")?.addEventListener("click", () => { this.onRun(); this.render(); });
    this.root.querySelector("#da-stop")?.addEventListener("click", () => { this.onStop(); this.render(); });

    // Bind tabs
    this.root.querySelectorAll(".da-tab").forEach(el => {
      el.addEventListener("click", () => {
        this.activeTab = parseInt((el as HTMLElement).dataset.tab || "0");
        this.onTabChange(this.activeTab);
        this.render();
      });
    });

    // Bind quick actions
    this.root.querySelectorAll(".da-quick").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt((el as HTMLElement).dataset.qi || "0");
        this.quickActions[idx]?.onClick();
      });
    });

    // Bind chat
    if (this.showChat) {
      const form = this.root.querySelector("#da-form") as HTMLFormElement;
      const input = this.root.querySelector("#da-input") as HTMLInputElement;
      form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msg = input?.value?.trim();
        if (!msg) return;
        input.value = "";
        this.chatHistory.push({ role: "user", text: msg });
        this.chatHistory.push({ role: "app", text: "..." });
        this.render();
        try {
          const response = await this.onChat(msg);
          this.chatHistory[this.chatHistory.length - 1] = { role: "app", text: response };
        } catch (err) {
          this.chatHistory[this.chatHistory.length - 1] = { role: "app", text: `Error: ${err instanceof Error ? err.message : "Something went wrong"}` };
        }
        this.render();
      });
    }
  }

  // ── Export ──────────────────────────────────

  asWidget(): WidgetRenderFn<TConfig> {
    return defineWidget<TConfig>((root, { config, isEditing, onConfigChange }) => {
      this.root = root;
      this.config = config;
      this.isEditing = isEditing;
      this.onConfigChange = onConfigChange;
      this.status = "running";
      this.render();
      return () => { this.root = null; };
    });
  }
}
