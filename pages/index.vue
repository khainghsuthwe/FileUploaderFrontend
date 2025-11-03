<template>
  <v-container fluid class="page-container d-flex align-center justify-center">
    <div class="content-area">
      <v-progress-linear
        v-if="loadingFiles"
        color="primary"
        indeterminate
        height="4"
        class="mb-4"
      />
      <h1 class="text-h4 mb-6 text-center">Image Uploader</h1>
      <FileUpload @uploaded="loadFiles" />
      <FileList
        :files="files"
        :loading="loadingFiles"
        class="mt-6"
        @delete="handleDelete"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FileUpload from "~/components/FileUpload.vue";
import FileList from "~/components/FileList.vue";

interface FileItem {
  filename: string;
  url: string;
  displayName?: string;
}

export default Vue.extend({
  name: "IndexPage",
  components: { FileUpload, FileList },
  data() {
    return {
      files: [] as FileItem[],
      loadingFiles: false as boolean,
    };
  },
  async mounted() {
    await this.loadFiles();
  },
  methods: {
    async loadFiles() {
      this.loadingFiles = true;
      try {
        const res = await (this as any).$axios.get("/upload");
        this.files = Array.isArray(res.data.files) ? res.data.files : [];
      } catch (err: any) {
        const backendUrl =
          (this as any).$config?.API_URL ||
          process.env.API_URL ||
          "http://localhost:5001";
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          `Failed to load files. Is the backend running on ${backendUrl}?`;

        if ((this as any).$toast?.error) {
          (this as any).$toast.error(message, { duration: 5000 });
        } else {
          console.error(message);
        }

        this.files = [];
      } finally {
        this.loadingFiles = false;
      }
    },
    async handleDelete(filename: string) {
      if (!filename) return;

      const confirmDelete = confirm(
        "Are you sure you want to delete this file?"
      );
      if (!confirmDelete) return;

      try {
        const filenameParts = filename.split("/");
        const shortFilename = filenameParts[filenameParts.length - 1];

        await (this as any).$axios.delete(
          `/upload/${encodeURIComponent(filename)}`
        );

        // Remove file from list instantly
        this.files = this.files.filter((f) => f.filename !== filename);

        if ((this as any).$toast?.success) {
          (this as any).$toast.success("File deleted successfully!", {
            duration: 3000,
          });
        }
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to delete file.";

        if ((this as any).$toast?.error) {
          (this as any).$toast.error(message, { duration: 5000 });
        } else {
          console.error(message);
        }
      }
    },
  },
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 48px 16px;
}

.content-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
</style>
