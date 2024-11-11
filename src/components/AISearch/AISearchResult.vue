<script lang="ts" setup>
import type { IAISearchProcessedResult } from '@/types';
import { AI_SEARCH_RESULT_ID } from '@/types';

type Props = {
  result: IAISearchProcessedResult;
  index: number;
};

type Emits = {
  'on-focus': [index: number];
  'on-click': [route: IAISearchProcessedResult['route']];
};

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <button
    :id="`${AI_SEARCH_RESULT_ID}${index}`"
    class="search-result"
    :data-qa="`${AI_SEARCH_RESULT_ID}${index}`"
    @focus="emit('on-focus', index)"
    @click="emit('on-click', result.route)"
  >
    <p
      :data-qa="`${AI_SEARCH_RESULT_ID}-title${index}`"
      class="search-result__title"
    >
      {{ result.title }}
    </p>
    <p
      :data-qa="`${AI_SEARCH_RESULT_ID}-breadcrumbs${index}`"
      class="search-result__breadcrumbs"
      v-html="result.breadcrumbs"
    />
  </button>
</template>

<style lang="scss">
.search-result {
  $this: &;

  padding: 8px 16px;
  text-align: left;
  border: none;
  background-color: transparent;
  width: 100%;
  outline: none;
  transition: background-color 0.1s ease-in-out;
  border-radius: 4px;

  &--dark {
    #{$this}:hover,
    #{$this}:focus-visible,
    #{$this}--active {
      background-color: #6d708133;
    }

    #{$this}__title {
      color: var(--light);
    }

    #{$this}__breadcrumbs {
      color: var(--light);
    }

    #{$this}__breadcrumbs [highlighted='true'] {
      color: var(--meteorite);
    }
  }

  &__title {
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    color: var(--dark);
  }

  &__breadcrumbs {
    font-size: 14px;
    line-height: 24px;
    color: var(--gray);
  }

  &__breadcrumbs [highlighted='true'] {
    color: var(--primary);
  }

  &--active,
  &:hover,
  &:focus-visible {
    background-color: var(--meteorite-gray);
  }
}
</style>
