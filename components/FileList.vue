<template>
  <v-card outlined class="filelist-card elevation-2">
    <v-card-title class="text-h6 d-flex align-center justify-space-between">
      <span> Uploaded Images ({{ files.length }}) </span>
    </v-card-title>
    <v-divider />

    <!-- Loading State -->
    <v-card-text v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="40" />
      <p class="mt-3 mb-0 grey--text">Loading images...</p>
    </v-card-text>

    <!-- Empty State -->
    <v-card-text
      v-else-if="files.length === 0"
      class="text-center grey--text py-10"
    >
      <v-icon large color="grey lighten-1" class="mb-3">mdi-image-off</v-icon>
      <p class="mb-0">No images uploaded yet.</p>
    </v-card-text>

    <!-- File List -->
    <v-list v-else class="py-2">
      <v-list-item
        v-for="file in files"
        :key="file.filename"
        class="file-item"
        two-line
      >
        <!-- Clickable image -->
        <v-list-item-avatar class="file-avatar" @click="openInNew(file)">
          <v-img
            :src="file.url"
            contain
            class="rounded-image clickable"
            @error="onImageError"
          />
        </v-list-item-avatar>

        <!-- Clickable filename -->
        <v-list-item-content @click="openInNew(file)" class="clickable">
          <v-list-item-title
            class="text-body-1 font-weight-medium text-truncate"
          >
            {{ file.displayName || file.filename }}
          </v-list-item-title>
        </v-list-item-content>

        <!-- Delete button -->
        <v-list-item-action>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="error"
                v-bind="attrs"
                v-on="on"
                @click.stop="$emit('delete', file.filename)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import type { FileItem } from "~/types/FileItem";

export default Vue.extend({
  name: "FileList",
  props: {
    files: {
      type: Array as () => FileItem[],
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onImageError(e: Event) {
      const target = e && (e.target as HTMLImageElement | null);
      if (target && target.tagName.toLowerCase() === "img") {
        target.src = "/placeholder-image.png";
      }
    },
    openInNew(file: FileItem) {
      if (file?.url) {
        window.open(file.url, "_blank", "noopener");
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
  background-color: #fafafa;
}

.file-item {
  transition: background-color 0.2s, transform 0.15s;
  border-radius: 10px;
}

.file-item:hover {
  background-color: #f5f5f5;
}

.file-avatar {
  width: 96px !important;
  height: 96px !important;
  margin: 8px 16px 8px 8px;
  border-radius: 12px;
  overflow: hidden;
}

.rounded-image {
  border-radius: 12px;
  object-fit: cover;
}

.clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}

.clickable:hover {
  opacity: 0.85;
}

.text-truncate {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-list-item-action .v-btn {
  margin-left: 8px;
}
</style>
