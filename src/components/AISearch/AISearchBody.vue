<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';

import AISearchInfo from '@/components/AISearch/AISearchInfo.vue';
import AISearchResults from '@/components/AISearch/AISearchResults.vue';
import type { IAISearchProcessedResult } from '@/types';

type Props = {
  isLoading: boolean;
  hasSearched: boolean;
  results: IAISearchProcessedResult[] | null;
};

type Emits = {
  'on-focus': [index: number | null];
  'on-result-click': [route: IAISearchProcessedResult['route']];
};

defineProps<Props>();

const emit = defineEmits<Emits>();

const aiSearchBodyRef = ref<HTMLElement | null>(null);

onClickOutside(aiSearchBodyRef, () => {
  emit('on-focus', null);
});
</script>

<template>
  <div ref="aiSearchBodyRef">
    <div v-if="isLoading" class="loader" />
    <AISearchResults
      v-else-if="hasSearched"
      :results="results"
      @on-focus="emit('on-focus', $event)"
      @on-result-click="emit('on-result-click', $event)"
    />
    <AISearchInfo v-else />
  </div>
</template>
