<script lang="ts" setup>
import {
  useFloating,
  autoPlacement,
  shift,
  offset,
  limitShift,
  autoUpdate,
} from '@floating-ui/vue';
import { useDebounceFn } from '@vueuse/core';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import AISearchBody from '@/components/AISearch/AISearchBody.vue';
import AISearchInput from '@/components/AISearch/AISearchInput.vue';
import { useAISearchControls } from '@/composables/useAISearchControls';
import { useAISearchResults } from '@/composables/useAISearchResults';
import { useScreen } from '@/composables/useScreen';
import aiSearchRepo from '@/repositories/aiSearchRepo';
import { useHPanelControlsStore } from '@/stores/hpanelControlsStore';
import type { IAISearchProcessedResult } from '@/types';

const HOTSPOT_OFFSET_PADDING = {
  top: 32,
  left: 32,
  right: 32,
  bottom: 32,
};

const hpanelControlsStore = useHPanelControlsStore();
const aiSearchTriggerRef = ref<HTMLElement | null>(null);
const aiSearchRef = ref<HTMLElement | null>(null);
const search = ref(null);
const results = ref<IAISearchProcessedResult[] | null>(null);
const isLoading = ref(false);
const router = useRouter();
const { isSmall } = useScreen();

const { floatingStyles: aiSearchPosition } = useFloating(
  aiSearchTriggerRef,
  aiSearchRef,
  {
    middleware: [
      autoPlacement({
        padding: HOTSPOT_OFFSET_PADDING,
        alignment: 'start',
        allowedPlacements: ['bottom', 'top', 'left', 'right'],
      }),
      shift({
        limiter: limitShift(),
        padding: HOTSPOT_OFFSET_PADDING,
      }),
      offset(24),
    ],
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
  },
);

const hasSearched = computed(() => results.value !== null);
const resultsLength = computed(() => results.value?.length || 0);
const hasResults = computed(() => !!resultsLength.value);

const { mapResults } = useAISearchResults();

const handleSearch = useDebounceFn(async (value) => {
  if (!value || search.value === value) {
    return;
  }
  isLoading.value = true;

  search.value = value;
  const [{ data }, error] = await aiSearchRepo.getAISearch({
    params: { query: value, limit: 20 },
  });
  if (!error) {
    results.value = mapResults(data.documents, search.value || '');
  }

  isLoading.value = false;
}, 500);

const handleRedirect = (route: IAISearchProcessedResult['route']) => {
  hpanelControlsStore.toggleAISearch();

  router.push(route);
};

const { setFocusedResultIndex } = useAISearchControls({
  hasResults,
  hasSearched,
  resultsLength,
  aiSearchRef,
  aiSearchTriggerRef,
});
</script>

<template>
  <button
    ref="aiSearchTriggerRef"
    class="ai-search-trigger"
    @click="hpanelControlsStore.toggleAISearch"
  />

  <div
    v-if="hpanelControlsStore.isAISearchOpen && !isSmall"
    ref="aiSearchRef"
    :style="aiSearchPosition"
    class="search"
  >
    <AISearchInput class="search__header" @on-change="handleSearch" />

    <AISearchBody
      :is-loading="isLoading"
      :results="results"
      :has-searched="hasSearched"
      class="search__body"
      @on-focus="setFocusedResultIndex"
      @on-result-click="handleRedirect"
    />
  </div>
</template>
