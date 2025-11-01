<template>
  <div>
    <div class="app-container">
      <nuxt />
    </div>

    <!-- global toasts (single area, bottom-right). Error toasts will get a red content class -->
    <div
      id="global-toasts"
      style="position: fixed; right: 16px; bottom: 16px; z-index: 9999"
    >
      <v-snackbar
        v-for="(t, idx) in toasts"
        :key="idx"
        v-model="t.show"
        timeout="3000"
        :content-class="t.type === 'error' ? 'error-toast' : ''"
      >
        <div :class="t.type === 'error' ? 'error-toast-content' : ''">
          {{ t.message }}
        </div>

        <template v-slot:action>
          <v-btn
            icon
            :class="t.type === 'error' ? 'error-toast-action' : ''"
            aria-label="Close"
            @click="t.show = false"
          >
            <v-icon
              :class="
                t.type === 'error'
                  ? 'toast-close-icon error-toast-action'
                  : 'toast-close-icon'
              "
              >mdi-close</v-icon
            >
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      toasts: [] as Array<{ message: string; type: string; show: boolean }>,
    };
  },
  mounted() {
    const bus: any = (this as any).$toastBus;
    if (bus && typeof bus.$on === "function") {
      bus.$on("notify", (payload: any) => {
        const t = {
          message: payload.message || String(payload),
          type: payload.type || "info",
          show: true,
        };
        this.toasts.push(t);
        // auto-remove after timeout
        setTimeout(() => {
          const i = this.toasts.indexOf(t);
          if (i !== -1) this.toasts.splice(i, 1);
        }, payload.duration || 5000);
      });
    }
  },
});
</script>

<style>
.error-toast {
  background-color: #e53935 !important; /* red */
  color: white !important;
}
.error-toast-content {
  color: white;
}
.error-toast-action {
  color: white !important;
}

/* Center the app content on large screens */
.app-container {
  width: 100%;
  max-width: 1100px; /* comfortable reading width */
  margin: 0 auto; /* center horizontally */
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

@media (min-width: 1400px) {
  .app-container {
    max-width: 1300px;
  }
}

/* Ensure Nuxt root content doesn't stretch full-width when pages use fluid containers */
.app-container > * {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: block;
}

@media (min-width: 1400px) {
  .app-container > * {
    max-width: 1300px;
  }
}
</style>
