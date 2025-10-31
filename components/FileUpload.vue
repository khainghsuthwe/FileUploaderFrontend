<template>
  <v-card class="mb-8 pa-6 upload-card" outlined>
    <v-card-title class="text-h6">Upload Image</v-card-title>
    <v-card-text>
      <v-file-input
        v-model="file"
        label="Choose an image (JPEG, PNG, GIF)"
        accept="image/jpeg,image/png,image/gif"
        prepend-icon="mdi-image"
        :show-size="true"
        :disabled="uploading"
        @change="onFileSelected"
      ></v-file-input>

      <v-btn
        color="primary"
        dark
        :disabled="!file || uploading"
        :loading="uploading"
        @click="upload"
        block
        class="mt-4 white--text font-weight-bold"
      >
        {{ uploading ? 'Uploading...' : 'Upload' }}
      </v-btn>

      <v-alert
        v-if="successMessage"
        type="success"
        class="mt-4"
        dismissible
        @input="successMessage = ''"
      >
        {{ successMessage }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FileUpload',
  data() {
    return {
      file: null as File | null,
      uploading: false,
      successMessage: '' as string
    };
  },
  methods: {
    onFileSelected(file: File | null) {
      this.file = file;
      this.successMessage = '';
    },
    async upload() {
      if (!this.file) return;

      this.uploading = true;
      const formData = new FormData();
      formData.append('image', this.file as File);

      try {
        // @ts-ignore - Nuxt injects $axios
        await (this as any).$axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.successMessage = 'File uploaded successfully!';
        // show toast briefly if available
        if ((this as any).$toast && typeof (this as any).$toast.success === 'function') {
          (this as any).$toast.success('File uploaded successfully!', { duration: 3000 });
        }
        this.file = null;
        this.$emit('uploaded');
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Upload failed. Please try again.';

        if ((this as any).$toast && typeof (this as any).$toast.error === 'function') {
          (this as any).$toast.error(message, { duration: 3000 });
        } else {
          // eslint-disable-next-line no-console
          console.error(message);
        }
      } finally {
        this.uploading = false;
      }
    }
  }
});
</script>

<style scoped>
.upload-card {
  width: 100%;
  max-width: 80%;
  border-radius: 12px;
  margin:0 auto;
}
</style>