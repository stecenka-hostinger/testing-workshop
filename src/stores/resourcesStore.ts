import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IHResource } from '@/types';

export const useResourcesStore = defineStore('resourcesStore', () => {
  const resources = ref<IHResource[]>([]);

  return {
    resources,
  };
});
