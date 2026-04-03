/**
 * DashtopApp — Base class for building Dashtop killer apps.
 *
 * Provides the standard layout every app gets for free:
 * - Header with icon, name, status, and pill actions (Update, Run, Stop)
 * - Scrollable content area (you fill this)
 * - Chat input at the bottom (you handle messages)
 * - Theme support
 *
 * Subclass and implement renderContent() + onChat() — that's it.
 *
 * @example
 * ```ts
 * import { DashtopApp } from '@dashtop/widget-sdk/app';
 *
 * class MyApp extends DashtopApp {
 *   name = "My App";
 *   icon = "🚀";
 *   color = "#7c3aed";
 *   placeholder = "Ask me anything...";
 *
 *   renderContent(container: HTMLElement) {
 *     container.innerHTML = '<p>Hello world</p>';
 *   }
 *
 *   async onChat(message: string): Promise<string> {
 *     return `You said: ${message}`;
 *   }
 * }
 *
 * export default new MyApp().asWidget();
 * ```
 */

import { defineWidget, type WidgetRenderFn } from "./index";

export interface AppAction {
  label: string;
  icon?: string;
  onClick: () => void;
}

export abstract class DashtopApp<TConfig = Record<string, unknown>> {
  // ── Override these ───────────────────────────

  /** App display name */
  abstract name: string;
  /** Emoji or single character icon */
  abstract icon: string;
  /** Hex color for the icon background */
  abstract color: string;
  /** Chat input placeholder text */
  placeholder = "Type a message...";

  // ── Internal state ──────────────────────────

  protected root: HTMLElement | null = null;
  protected config: TConfig = {} as TConfig;
  protected isEditing = false;
  protected status: "idle" | "running" | "stopped" = "idle";
  protected chatHistory: { role: "user" | "app"; text: string }[] = [];
  protected onConfigChange: (patch: Partial<TConfig>) => void = () => {};

  // ── Implement these ─────────────────────────

  /**
   * Render your app's main content area.
   * Called on every state change. The container is cleared before each call.
   */
  abstract renderContent(container: HTMLElement): void;

  /**
   * Handle a chat message from the user.
   * Return the app's response as a string.
   * Throw an error to show an error message.
   */
  abstract onChat(message: string): Promise<string> | string;

  /**
   * Optional: called when Run is pressed.
   */
  onRun(): void {
    this.status = "running";
  }

  /**
   * Optional: called when Stop is pressed.
   */
  onStop(): void {
    this.status = "stopped";
  }

  /**
   * Optional: called when Update is pressed.
   */
  onUpdate(): void {
    this.status = "running";
  }

  /**
   * Optional: extra actions for the pill menu.
   */
  getActions(): AppAction[] {
    return [];
  }

  // ── Rendering Engine ────────────────────────

  private render() {
    if (!this.root) return;

    const statusColor =
      this.status === "running" ? "#22c55e" :
      this.status === "stopped" ? "#f87171" : "#a1a1aa";

    this.root.innerHTML = `
      <div style="display:flex; flex-direction:column; height:100%; font-family:system-ui,-apple-system,sans-serif; background:white; color:#1a1a2e;">

        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-bottom:1px solid #eee;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:8px; background:${this.color}; display:flex; align-items:center; justify-content:center; font-size:14px;">
              ${this.icon}
            </div>
            <div>
              <div style="font-size:12px; font-weight:600;">${this.name}</div>
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="width:6px; height:6px; border-radius:50%; background:${statusColor};"></span>
                <span style="font-size:10px; color:#888; text-transform:capitalize;">${this.status}</span>
              </div>
            </div>
          </div>

          <!-- Pill -->
          <div style="display:flex; align-items:center; gap:2px; background:#f4f4f5; border-radius:20px; padding:2px;">
            <button id="da-update" title="Update" style="padding:4px; border-radius:50%; border:none; background:transparent; cursor:pointer; font-size:12px; line-height:1;">🔄</button>
            <button id="da-run" title="Run" style="padding:4px; border-radius:50%; border:none; background:transparent; cursor:pointer; font-size:12px; line-height:1; color:#16a34a;">▶</button>
            <button id="da-stop" title="Stop" style="padding:4px; border-radius:50%; border:none; background:transparent; cursor:pointer; font-size:12px; line-height:1; color:#ef4444;">⬛</button>
          </div>
        </div>

        <!-- Content -->
        <div id="da-content" style="flex:1; overflow:auto; min-height:0;"></div>

        <!-- Chat history -->
        <div id="da-chat" style="overflow:auto; max-height:120px; padding:0 12px; border-top:${this.chatHistory.length ? '1px solid #eee' : 'none'};">
          ${this.chatHistory.map(m => `
            <div style="font-size:11px; padding:3px 0; color:${m.role === 'user' ? '#1a1a2e' : '#666'}; ${m.role === 'user' ? 'font-weight:500;' : ''}">
              <span style="color:${m.role === 'user' ? this.color : '#999'};">${m.role === 'user' ? 'you' : 'ai'}:</span> ${m.text}
            </div>
          `).join("")}
        </div>

        <!-- Chat input -->
        <form id="da-form" style="display:flex; align-items:center; gap:6px; padding:8px 12px; border-top:1px solid #eee;">
          <input
            id="da-input"
            type="text"
            placeholder="${this.placeholder}"
            style="flex:1; padding:6px 10px; border:1px solid #e5e5e5; border-radius:8px; font-size:12px; outline:none; background:#fafafa;"
          />
          <button type="submit" style="padding:6px 10px; background:${this.color}; color:white; border:none; border-radius:8px; font-size:11px; cursor:pointer;">
            Send
          </button>
        </form>
      </div>
    `;

    // Render content
    const contentEl = this.root.querySelector("#da-content") as HTMLElement;
    if (contentEl) {
      this.renderContent(contentEl);
    }

    // Scroll chat to bottom
    const chatEl = this.root.querySelector("#da-chat") as HTMLElement;
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;

    // Bind actions
    this.root.querySelector("#da-update")?.addEventListener("click", () => {
      this.onUpdate();
      this.render();
    });
    this.root.querySelector("#da-run")?.addEventListener("click", () => {
      this.onRun();
      this.render();
    });
    this.root.querySelector("#da-stop")?.addEventListener("click", () => {
      this.onStop();
      this.render();
    });

    // Bind chat
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
        this.chatHistory[this.chatHistory.length - 1] = {
          role: "app",
          text: `Error: ${err instanceof Error ? err.message : "Something went wrong"}`,
        };
      }
      this.render();
    });
  }

  // ── Export as widget ────────────────────────

  /**
   * Convert this app into a Dashtop widget render function.
   * Use as: `export default new MyApp().asWidget()`
   */
  asWidget(): WidgetRenderFn<TConfig> {
    return defineWidget<TConfig>((root, { config, isEditing, onConfigChange }) => {
      this.root = root;
      this.config = config;
      this.isEditing = isEditing;
      this.onConfigChange = onConfigChange;
      this.status = "running";
      this.render();

      return () => {
        this.root = null;
      };
    });
  }
}
