<template>
  <v-card outlined class="filelist-card">
    <v-card-title class="text-h6">Upload Image</v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <!-- File Input -->
      <v-file-input
        v-model="file"
        label="Choose an image (JPEG, PNG, GIF)"
        accept="image/jpeg,image/png,image/gif"
        prepend-icon="mdi-image"
        :show-size="true"
        :disabled="uploading"
        @change="onFileSelected"
      ></v-file-input>

      <!-- Preview + File Info -->
      <div class="d-flex align-center upload-actions mt-3">
        <div v-if="previewUrl" class="file-preview">
          <v-img :src="previewUrl" contain width="120" height="120"></v-img>
        </div>

        <div class="flex-grow-1">
          <div v-if="file" class="text-body-2 mb-2">{{ file.name }}</div>
          <div class="text-caption grey--text">
            Supported: JPG, PNG, GIF · Max: 10MB
          </div>
        </div>
      </div>

      <!-- Upload Button -->
      <v-btn
        color="primary"
        dark
        :disabled="uploadDisabled"
        aria-label="Upload file"
        :aria-busy="uploading ? 'true' : 'false'"
        @click="upload"
        block
        class="mt-4 white--text font-weight-bold"
      >
        <v-icon left small v-if="!uploading">mdi-cloud-upload</v-icon>
        <v-progress-circular
          v-if="uploading"
          indeterminate
          size="18"
          width="2"
          color="white"
          class="mr-2"
        ></v-progress-circular>
        {{ uploading ? "Uploading..." : "Upload" }}
      </v-btn>

      <!-- Progress Indicators -->
      <div class="mt-4">
        <!-- Indeterminate progress for unknown length uploads -->
        <v-progress-linear
          v-if="uploading && uploadProgress === null"
          indeterminate
          color="primary"
        ></v-progress-linear>

        <!-- Progress bar with calculated value -->
        <v-progress-linear
          v-else-if="uploading && uploadProgress !== null"
          :value="uploadProgress"
          color="primary"
        ></v-progress-linear>

        <!-- Percentage text feedback while uploading -->
        <div
          v-if="uploading && uploadProgress !== null"
          class="text-caption mt-2"
        >
          Uploading... {{ uploadProgress }}%
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FileUpload",
  data() {
    return {
      file: null as File | null,
      uploading: false,
      uploadProgress: null as number | null,
      previewUrl: null as string | null,
    };
  },
  computed: {
    uploadDisabled(): boolean {
      // Button is disabled if no file is selected OR if an upload is already in progress
      return !(this as any).file || (this as any).uploading;
    },
  },
  methods: {
    /**
     * Handles file selection, creating a local URL for the preview image.
     * @param file The selected File object.
     */
    onFileSelected(file: File | null) {
      this.file = file;

      // Revoke previous URL if one exists
      if (this.previewUrl) {
        try {
          URL.revokeObjectURL(this.previewUrl);
        } catch (e) {
          /* ignore */
        }
        this.previewUrl = null;
      }

      // Create new URL for preview
      if (file) {
        try {
          this.previewUrl = URL.createObjectURL(file as File);
        } catch (e) {
          this.previewUrl = null;
        }
      }
    },

    /**
     * Initiates the file upload process and uses the global $toast service for feedback.
     */
    async upload() {
      if (!this.file) return;

      this.uploading = true;
      this.uploadProgress = null;

      const formData = new FormData();
      formData.append("image", this.file as File);

      try {
        await (this as any).$axios.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent && progressEvent.lengthComputable) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              this.uploadProgress = percent;
            } else {
              this.uploadProgress = null;
            }
          },
        });

        (this as any).$toast.success("Image uploaded successfully!");

        this.$emit("uploaded");
        this.clearSelection();
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Upload failed. Please try again.";

        (this as any).$toast.error(`Upload error: ${message}`);

        console.error(message);
      } finally {
        this.uploading = false;
        this.uploadProgress = null;
      }
    },

    /**
     * Clears the file input selection and the preview URL.
     */
    clearSelection() {
      this.file = null;
      if (this.previewUrl) {
        try {
          URL.revokeObjectURL(this.previewUrl);
        } catch (e: any) {
          (this as any).$toast.error(`Upload error: ${e.message}`);

          console.log("Error revoking object URL:", e);
        }
        this.previewUrl = null;
      }
    },
  },
});
</script>

<style scoped>
.filelist-card {
  width: 100%;
  border-radius: 12px;
  margin: 0 auto;
}

.upload-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-preview {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  display: inline-block;
  margin-right: 12px;
  position: relative;
}

.preview-clear {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.55) !important;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}
</style>
