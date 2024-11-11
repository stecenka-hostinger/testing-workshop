import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHPanelControlsStore = defineStore('hpanelControlsStore', () => {
  const isAISearchOpen = ref(false);

  const toggleAISearch = () => {
    isAISearchOpen.value = !isAISearchOpen.value;
  };

  return {
    isAISearchOpen,
    toggleAISearch,
  };
});
