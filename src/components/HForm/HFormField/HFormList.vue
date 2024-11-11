<script setup lang="ts">
import { useSlots } from 'vue';

import HFormListItem from '@/components/HForm/HFormField/HFormListItem.vue';
import type { FieldOption, GroupedFieldOption } from '@/types';

type Props = {
  options: FieldOption[];
  groupedOptions?: GroupedFieldOption[];
  noOptions?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  itemsPerList?: number;
  isWrappedText?: boolean;
};

interface Emits {
  (eventName: 'on-select', payload: FieldOption): void;
}

withDefaults(defineProps<Props>(), { itemsPerList: 7 });

const emit = defineEmits<Emits>();

const slots = useSlots();
</script>

<template>
  <div v-if="isLoading" class="list-loader">
    <div class="list-loader__item" />
  </div>
  <ul v-else class="hp-list text-body-2">
    <HFormListItem
      v-if="noOptions"
      class="hp-list__item--no-match"
      :class="{ 'hp-list__item--wrap': isWrappedText }"
      :option="{ label: 'No matching options', value: 'no-option' }"
    />
    <template v-else>
      <div v-if="groupedOptions?.length" class="hp-list__groups">
        <div v-for="group in groupedOptions" :key="group.name">
          <span class="hp-list__groups--name">
            {{ group.name }}
          </span>

          <HFormListItem
            v-for="option in group.values"
            :key="option.value"
            :class="{ 'hp-list__item--wrap': isWrappedText }"
            :option="option"
            :is-active="option.selected"
            :is-grouped="true"
            @on-select="emit('on-select', option)"
          />
        </div>
      </div>
      <div v-else>
        <HFormListItem
          v-for="option in options"
          :key="option.value"
          :class="{ 'hp-list__item--wrap': isWrappedText }"
          :option="option"
          :is-active="option.selected"
          @on-select="emit('on-select', option)"
        >
          <template v-if="slots.default" #default="optionData">
            <slot v-bind="optionData" />
          </template>
        </HFormListItem>
      </div>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
div.list-loader {
  div.list-loader__item {
    margin: -8px 0;
  }
}

.list-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.list-loader,
.hp-list {
  border-radius: 8px;
  z-index: var(--z-index-2);
  background-color: var(--light);
  min-width: calc(100% + 2px);
  filter: drop-shadow(0px 0px 12px rgba(29, 30, 32, 0.16));
}

.hp-list {
  list-style: none;
  padding: 8px 0;
  margin: 0;
  max-height: calc(48px * v-bind(itemsPerList) + 16px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 4px;
    margin: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-border);
    border-radius: 4px;
    border: 4px solid rgba(0, 0, 0, 0);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray-border);
  }

  &__item {
    &--no-match {
      &:hover {
        cursor: default;
        color: var(--gray-dark);
        background-color: var(--light);
      }
    }

    &--wrap {
      overflow-wrap: anywhere;
    }
  }

  &__groups {
    &--name {
      display: block;
      padding: 8px 16px;
      color: var(--gray-dark);
      font-weight: 600;
      pointer-events: none !important;
    }
  }
}
</style>
