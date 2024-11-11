<script lang="ts" setup>
import AISearchResult from '@/components/AISearch/AISearchResult.vue';
import type { IAISearchProcessedResult } from '@/types';

type Props = {
  results: IAISearchProcessedResult[] | null;
};

type Emits = {
  'on-focus': [index: number];
  'on-result-click': [route: IAISearchProcessedResult['route']];
};

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <AISearchResult
    v-for="(result, index) in results"
    :key="result.breadcrumbs"
    :result="result"
    :index="index"
    @on-focus="emit('on-focus', $event)"
    @on-click="emit('on-result-click', $event)"
  />
</template>
