import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { Email, type IProfileAccess } from '@/types';

export const useProfileStore = defineStore('profileStore', () => {
  const access = ref<IProfileAccess | null>(null);
  const emailProvider = ref<Email.EmailProvider | null>(null);

  const isAccessManager = computed(() => access.value?.isAccessManager);

  const isTitanEmail = computed(
    () => emailProvider.value !== Email.EmailProvider.HOSTINGER,
  );

  return {
    isAccessManager,
    isTitanEmail,
  };
});
