<script setup lang="ts">
import { computed, useSlots } from 'vue';

import type { FieldOption } from '@/types';

type Props = {
  isActive?: boolean;
  isGrouped?: boolean;
  option: FieldOption;
};

interface Emits {
  (eventName: 'on-select', payload: FieldOption): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const slots = useSlots();

const iconColor = computed(() => {
  if (props.option?.icon?.color) {
    return props.option.icon.color;
  }

  if (props.isActive) {
    return 'primary';
  }

  return 'gray';
});

const iconInRow = computed(() => props.option?.icon?.color);
</script>

<template>
  <li
    :id="option.value"
    :key="option.value"
    data-qa="form-list-item"
    class="hp-list-item"
    :class="{
      'hp-list-item--active': isActive,
      'hp-list-item--disabled': option.disabled,
      'hp-list-item--grouped': isGrouped,
    }"
    @click.prevent="!option.disabled && emit('on-select', option)"
  >
    <slot v-if="slots.default" v-bind="props.option" />
    <template v-else>
      <div v-if="option.icon?.left" class="hp-list-item__icon--left" />
      <img
        v-if="option.image?.left"
        width="24"
        alt="dropdown-image-left"
        class="hp-list-item__image--left"
        :src="option.image.left"
      />
      <span
        class="hp-list-item__label"
        :class="{
          'hp-list-item__label--short': iconInRow,
        }"
      >
        {{ option.label }}

        <div v-if="option.icon?.inline" class="hp-list-item__icon--inline" />
      </span>
      <span
        v-if="option.appendText"
        class="hp-list-item__append-text text-body-2"
      >
        {{ option.appendText }}
      </span>
      <div v-if="option.icon?.right" class="hp-list-item__icon--right" />
      <img
        v-if="option.image?.right"
        width="24"
        alt="dropdown-image-right"
        class="hp-list-item__image--left"
        :src="option.image.right"
      />
    </template>
  </li>
</template>

<style lang="scss">
.hp-list-item {
  display: flex;
  cursor: pointer;
  color: var(--gray-dark);
  padding: 12px 16px;
  text-align: left;

  &__append-text {
    flex-grow: 1;
  }
  &__label {
    flex-grow: 1;
  }

  &:hover {
    background-color: var(--primary-dark-hover);

    &.hp-list-item--active {
      background-color: var(--primary-light);
    }

    &.hp-list-item--disabled {
      background-color: var(--light);
    }
  }

  &--disabled {
    cursor: not-allowed;
    color: var(--gray);
  }

  &--active {
    color: var(--primary);
    background-color: var(--primary-light);
  }
  &__label--short {
    flex-grow: unset;
  }
  &__append-text {
    display: flex;
    justify-content: flex-end;
  }

  &__icon,
  &__image {
    &--left {
      margin-right: 8px;
    }

    &--right,
    &__image {
      margin-left: 8px;
    }
  }

  &--grouped {
    padding-left: 32px !important;
  }
}
</style>
