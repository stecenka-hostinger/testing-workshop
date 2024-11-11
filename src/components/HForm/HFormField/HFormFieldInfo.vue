<script setup lang="ts">
import type { FieldError } from '@/types';

type Props = {
  error?: FieldError;
  value: string;
  hint?: string;
  limit?: number;
  absolute?: boolean;
};

defineProps<Props>();
</script>

<template>
  <span
    v-if="error && error.text"
    class="field-info__error text-caption"
    :class="{ 'field-info__error--absolute': absolute }"
  >
    {{ error }}
  </span>

  <div v-else class="field-info__hint-holder">
    <span v-if="hint" class="field-info__hint text-caption">{{ hint }}</span>
    <span v-if="limit" class="field-info__limit text-caption">
      {{ value.length }} / {{ limit }}
    </span>
  </div>
</template>

<style lang="scss">
.field-info {
  &__error {
    display: block;
    text-align: left;

    font-size: 12px;
    color: var(--danger);
    padding-left: 16px;
    padding-right: 16px;
    line-height: 18px;
    margin-top: 4px;
    max-width: 100%;

    &--absolute {
      position: absolute;
    }
  }

  &__hint-holder {
    display: flex;
    align-items: top;
    justify-content: space-between;
  }

  &__hint {
    @extend .field-info__error;
    color: var(--gray);
  }

  &__limit {
    @extend .field-info__hint;
    white-space: nowrap;
  }
}
</style>
