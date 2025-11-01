<template>
  <v-card outlined class="filelist-card">
    <v-card-title class="text-h6">
      Uploaded Images ({{ files.length }})
    </v-card-title>
    <v-divider></v-divider>

    <v-list v-if="files.length > 0">
      <v-list-item v-for="file in files" :key="file.filename">
        <v-list-item-avatar>
          <v-img :src="file.url" contain @error="onImageError"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-body-1">
            {{ file.filename }}
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click="openInNew(file)"
              >
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
            <span>Open</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-card-text v-else class="text-center grey--text py-8">
      <v-icon large color="grey lighten-1" class="mb-2">mdi-image-off</v-icon>
      <p>No images uploaded yet.</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

interface FileItem {
  filename: string;
  url: string;
}

export default Vue.extend({
  name: "FileList",
  props: {
    files: {
      type: Array as () => FileItem[],
      default: () => [],
    },
  },
  methods: {
    onImageError(e: Event) {
      const target = e && (e.target as HTMLImageElement | null);
      if (
        target &&
        typeof target.tagName === "string" &&
        target.tagName.toLowerCase() === "img"
      ) {
        target.src = "/placeholder-image.png";
      }
    },
    openInNew(file: FileItem) {
      window.open(file.url, "_blank", "noopener");
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

v-list-item-action .v-btn {
  margin-left: 6px;
}
.v-list-item-avatar .v-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}
/* v-list-item-avatar {
  width: 72px;
  height: 72px;
} */
.v-list-item-avatar {
  width: 72px !important;
  height: 72px !important;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 50%;
}
</style>
