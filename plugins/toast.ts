import Vue from "vue";

// simple event bus for toasts
const toastBus = new Vue();

// basic de-duplication state to avoid double-toasts
let _lastToast: { message: string; type: string; ts: number } | null = null;
const DEDUPE_WINDOW_MS = 2000; // ignore duplicate messages within 2s

// attach to Vue prototype so components can call this.$toast
(Vue as any).prototype.$toastBus = toastBus;
(Vue as any).prototype.$toast = {
  success(message: string, opts: any = {}) {
    const now = Date.now();
    const type = "success";
    if (
      !opts.force &&
      _lastToast &&
      _lastToast.message === message &&
      _lastToast.type === type &&
      now - _lastToast.ts < DEDUPE_WINDOW_MS
    ) {
      return; // drop duplicate
    }
    _lastToast = { message, type, ts: now };
    toastBus.$emit("notify", { type, message, ...opts });
  },
  error(message: string, opts: any = {}) {
    const now = Date.now();
    const type = "error";
    if (
      !opts.force &&
      _lastToast &&
      _lastToast.message === message &&
      _lastToast.type === type &&
      now - _lastToast.ts < DEDUPE_WINDOW_MS
    ) {
      return; // drop duplicate
    }
    _lastToast = { message, type, ts: now };
    toastBus.$emit("notify", { type, message, ...opts });
  },
};

export default (ctx: any, inject: any) => {
  // also inject for composition or context access
  inject("toast", (msg: string, opts: any = {}) =>
    toastBus.$emit("notify", { type: "info", message: msg, ...opts })
  );
};
