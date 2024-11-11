<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  schema: any;
  label: string;
  value?: string;
  focused: boolean;
  error?: boolean;
  isDark?: boolean;
  customError?: string;
  showOptional?: boolean;
  prepend?: boolean | undefined;
  prependOrAppend?: boolean;
  labelFilled?: string | boolean;
};

const props = withDefaults(defineProps<Props>(), { prepend: undefined });

const prependClass = computed(() => {
  if (props.prepend === undefined) {
    return '';
  }

  return props.prepend ? 'field-border--prepend' : 'field-border--append';
});
</script>

<template>
  <fieldset
    class="field-border"
    :class="[
      prependClass,
      {
        'field-border--focused': focused,
        'field-border--dark': schema.custom?.isDark,
        'field-border--filled': labelFilled,
        'field-border--error': error || customError,
        'field-border--with-append': schema.append && !prependOrAppend,
        'field-border--with-prepend': schema.prepend && !prependOrAppend,
      },
    ]"
  >
    <legend
      class="field-border__legend"
      :class="[
        {
          'field-border__legend--focused': schema.icon && schema.icon.left,
          'field-border__legend--active': focused,
          'field-border__legend--filled': labelFilled,
          'field-border__legend--no-width': prependOrAppend || !schema.label,
        },
      ]"
    >
      <span>{{ label }}</span>
    </legend>
  </fieldset>
</template>
