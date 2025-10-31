import Vue from 'vue';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

declare module 'vue/types/vue' {
    interface Vue {
        $axios: NuxtAxiosInstance;
        $toast: any; // or import a proper type if using a known toast library
    }
}

declare module '@nuxt/types' {
    interface Context {
        $axios: NuxtAxiosInstance;
        $toast: any;
    }
    interface NuxtAppOptions {
        $axios: NuxtAxiosInstance;
        $toast: any;
    }
}
