import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSubscriptionsStore = defineStore('subscriptionsStore', () => {
  const subscriptions = ref<any[]>([]);
  const isSubscriptionsLoading = ref(false);
  const isLoaded = ref(false);

  return {
    subscriptions,
    isSubscriptionsLoading,
    isLoaded,
  };
});
