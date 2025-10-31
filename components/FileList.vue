<template>
  <v-card outlined class="filelist-card">
    <v-card-title class="text-h6">
      Uploaded Images ({{ files.length }})
    </v-card-title>
    <v-divider></v-divider>

    <v-list v-if="files.length > 0">
      <v-list-item v-for="file in files" :key="file.filename">
        <v-list-item-content>
          <v-img
            :src="file.url"
            max-height="120"
            max-width="120"
            class="mb-2"
            contain
            @error="onImageError"
          ></v-img>
          <v-list-item-subtitle class="text-caption">
            {{ file.filename }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-card-text v-else class="text-center grey--text py-8">
      <v-icon large color="grey lighten-1" class="mb-2">mdi-image-off</v-icon>
      <p>No images uploaded yet.</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

interface FileItem {
  filename: string;
  url: string;
}

export default Vue.extend({
  name: 'FileList',
  props: {
    files: {
      type: Array as () => FileItem[],
      default: () => []
    }
  },
  methods: {
    onImageError(e: Event) {
      const target = e && (e.target as HTMLImageElement | null);
      if (target && typeof target.tagName === 'string' && target.tagName.toLowerCase() === 'img') {
        target.src = '/placeholder-image.png'; // optional fallback
      }
    }
  }
});
</script>

<style scoped>
.filelist-card {
  width: 100%;
  max-width: 80%;
  border-radius: 12px;
  margin:0 auto;
}
</style>