<template>
  <v-container fluid class="fill-height d-flex align-center justify-center page-container mx-auto">
    <v-row class="fill-height d-flex align-center justify-center">
      <v-col cols="12" md="10" lg="10" xl="8" class="d-flex flex-column align-center">
        <div class="content-wrapper">
          <h1 class="text-h4 mb-6 text-center">Image Upload</h1>
          <FileUpload @uploaded="loadFiles" />
          <FileList :files="files" class="mt-6" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import FileUpload from '~/components/FileUpload.vue';
import FileList from '~/components/FileList.vue';

interface FileItem {
  filename: string;
  url: string;
}

export default Vue.extend({
  name: 'IndexPage',
  components: { FileUpload, FileList },
  data() {
    return {
      files: [] as FileItem[]
    };
  },
  async mounted() {
    await this.loadFiles();
  },
  methods: {
    async loadFiles() {
      try {
        // @ts-ignore - Nuxt injects $axios
        const res = await (this as any).$axios.get('/upload');
        this.files = Array.isArray(res.data.files) ? res.data.files : [];
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Failed to load files. Is the backend running on http://localhost:5000?';

        if ((this as any).$toast && typeof (this as any).$toast.error === 'function') {
          // show toast for 3 seconds
          (this as any).$toast.error(message, { duration: 3000 });
        } else {
          console.error(message);
        }
        this.files = [];
      }
    }
  }
});
</script>

<style scoped>
.page-container {
  padding-top: 48px;
  padding-bottom: 48px;
}

.content-wrapper {
  width: 100%;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>