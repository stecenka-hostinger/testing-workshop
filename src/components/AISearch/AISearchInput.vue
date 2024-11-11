<script lang="ts" setup>
import { computed } from 'vue';

import HFormField from '@/components/HForm/HFormField.vue';
import { FieldType, type EmitValue } from '@/types';

type Emits = {
  'on-change': [value: string | EmitValue];
};

const emit = defineEmits<Emits>();

const searchSchema = computed((): any => ({
  type: FieldType.text,
  label: 'What are you looking for?',
  custom: {
    hideOptionalLabel: true,
  },
}));
</script>
<template>
  <HFormField
    is-field-focused
    :schema="searchSchema"
    name="search"
    @on-change="emit('on-change', $event.value)"
  />
</template>
