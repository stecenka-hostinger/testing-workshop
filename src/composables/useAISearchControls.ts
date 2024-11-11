import { onClickOutside } from '@vueuse/core';
import type { ComputedRef, Ref } from 'vue';
import { computed, ref, watch } from 'vue';

import { useHPanelControlsStore } from '@/stores/hpanelControlsStore';
import { AI_SEARCH_RESULT_ID } from '@/types';

export const useAISearchControls = ({
  resultsLength,
  hasSearched,
  hasResults,
  aiSearchRef,
  aiSearchTriggerRef,
}: {
  resultsLength: ComputedRef<number>;
  hasSearched: ComputedRef<boolean>;
  hasResults: ComputedRef<boolean>;
  aiSearchRef: Ref<HTMLElement | null>;
  aiSearchTriggerRef: Ref<HTMLElement | null>;
}) => {
  const hpanelControlsStore = useHPanelControlsStore();

  const focusedResultIndex = ref<null | number>(null);

  const canUseArrowControls = computed(
    () => hasSearched.value && hasResults.value,
  );

  const setFocusedResultIndex = (index: number | null) => {
    focusedResultIndex.value = index;
  };

  const onArrowDown = () => {
    if (
      focusedResultIndex.value === null ||
      focusedResultIndex.value === resultsLength.value - 1
    ) {
      setFocusedResultIndex(0);
    } else {
      setFocusedResultIndex(focusedResultIndex.value + 1);
    }
  };

  const onArrowUp = () => {
    if (focusedResultIndex.value === null || focusedResultIndex.value === 0) {
      setFocusedResultIndex(resultsLength.value - 1);
    } else {
      setFocusedResultIndex(focusedResultIndex.value - 1);
    }
  };

  const handleAISearchControls = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setFocusedResultIndex(null);
      hpanelControlsStore.toggleAISearch();
    }

    if (event.key === 'ArrowDown' && canUseArrowControls.value) {
      event.preventDefault();
      onArrowDown();
    }

    if (event.key === 'ArrowUp' && canUseArrowControls.value) {
      event.preventDefault();
      onArrowUp();
    }
  };

  const enableAISearchControls = () => {
    window.addEventListener('keydown', handleAISearchControls);
  };

  const disableAISearchControls = () => {
    window.removeEventListener('keydown', handleAISearchControls);
  };

  watch(
    () => hpanelControlsStore.isAISearchOpen,
    (isAISearchOpen) => {
      if (isAISearchOpen) {
        enableAISearchControls();
      } else {
        disableAISearchControls();
      }
    },
  );

  watch(
    () => focusedResultIndex.value,
    (index) => {
      if (!hasSearched) return;

      document.getElementById(`${AI_SEARCH_RESULT_ID}${index}`)?.focus();
    },
  );

  onClickOutside(
    aiSearchRef,
    () => {
      if (hpanelControlsStore.isAISearchOpen) {
        hpanelControlsStore.toggleAISearch();
      }
    },
    { ignore: [aiSearchTriggerRef] },
  );

  return {
    focusedResultIndex,
    canUseArrowControls,
    handleAISearchControls,
    onArrowDown,
    onArrowUp,
    setFocusedResultIndex,
  };
};
