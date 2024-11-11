<script setup lang="ts">
type Props = {
  schema: any;
  label: string;
  value: string;
  focused: boolean;
  error: boolean;
  customError?: string;
  showOptional?: boolean;
  labelFilled?: string | boolean;
};

const props = defineProps<Props>();
</script>

<template>
  <div
    class="field-label"
    :class="[
      {
        'field-label--with-icon': schema.icon && schema.icon.left,
        'field-label--active': focused,
        'field-label--dark': schema.custom?.isDark,
        'field-label--filled': labelFilled,
        'field-label--error':
          (props.value || focused) && (error || customError),
        'field-label--disabled': schema.disabled,
      },
    ]"
  >
    <span>{{ label }}</span>
  </div>
</template>

<style lang="scss">
.field-label {
  $this: &;

  position: absolute;
  top: 0;
  left: 0;
  transform: translate(16px, 12px) scale(1);
  z-index: var(--z-index-child-1);
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  transform-origin: left top;
  pointer-events: none;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: calc(100% - 24px);
  font-size: 14px;
  margin-bottom: 0;

  &--dark {
    color: var(--light);
  }

  &--dark#{$this}--active:not(.s) {
    color: var(--meteorite) !important;
  }

  &--with-icon {
    transform: translate(48px, 12px) scale(1);
  }

  @media only screen and (max-width: 767px) {
    max-width: 82%;
  }

  color: var(--gray);

  &--optional {
    font-size: 14px;
    margin-left: 4px;
  }

  &--active,
  &--filled {
    transform: translate(13px, -11px) scale(0.85);
    top: 0px;
    left: 0px;
    max-width: calc(114% - 24px);
    width: auto;

    label {
      text-overflow: initial;
    }
  }

  &--active {
    color: var(--primary);
  }

  &--active.label-holder--select {
    color: var(--placeholder);
  }

  &--error {
    color: var(--danger);
  }
}
</style>
