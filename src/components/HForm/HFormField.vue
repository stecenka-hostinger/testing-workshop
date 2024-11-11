<script setup lang="ts" generic="M extends object = {}">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import HFormFieldBorder from '@/components/HForm/HFormField/HFormFieldBorder.vue';
import HFormFieldInfo from '@/components/HForm/HFormField/HFormFieldInfo.vue';
import HFormFieldInput from '@/components/HForm/HFormField/HFormFieldInput.vue';
import HFormFieldLabel from '@/components/HForm/HFormField/HFormFieldLabel.vue';
import HFormFieldPasswordTags from '@/components/HForm/HFormField/HFormFieldPasswordTags.vue';
import type {
  FieldError,
  FieldOption,
  EmitValue,
  IFieldOnChangeEvent,
} from '@/types';
import { FieldType } from '@/types';

type Props = {
  schema: any;
  customError?: FieldError | null;
  isFieldFocused?: boolean;
  isDropdownOpened?: boolean;
  isLoading?: boolean;
  isFullWidth?: boolean;
};

type Emits = {
  (eventName: 'on-load', payload: Element | undefined): void;
  (eventName: 'on-change', payload: IFieldOnChangeEvent): void;
  (eventName: 'on-enter-press'): void;
  (eventName: 'on-blur'): void;
  (eventName: 'on-focus'): void;
  (eventName: 'on-copy', payload: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const fieldRef = ref<Element>();
const fieldInputRef = ref<Element>();

const selectValues = (values?: string | FieldOption[]) => {
  if (!values) return '';
  if (typeof values === 'string') return values;

  return values.find(({ selected }: FieldOption) => selected)?.value;
};

const value = ref(props.schema.value || '');
const prependValue = ref(selectValues(props.schema.prepend) || '');
const appendValue = ref(selectValues(props.schema.append) || '');

const error = reactive<FieldError>({ text: '', params: [] });
const isError = computed(() => !!error.text || !!props.customError?.text);
const isFocused = ref(props.isFieldFocused);
const isAppendChanged = ref(false);
const maxlength = computed(() => props.schema.validation?.maxlength);

const hasPasswordTags = computed(
  () => props.schema.password?.tags || props.schema.password?.confirmedPassword,
);
const showPasswordTags = computed(
  () =>
    props.schema.type === FieldType.password &&
    ((hasPasswordTags.value && value.value) ||
      props.schema.password?.tagsAlwaysVisible),
);

const showOptional = computed(() => {
  if (props.schema.custom?.hideOptionalLabel) return false;

  const validation = props.schema.validation;
  const noRequiredValidation =
    !validation || (validation && validation?.required === false);

  return noRequiredValidation && !props.schema.disabled;
});

const labelFilled = computed(() => {
  const hasSelectedValues =
    props.schema.values?.find(({ selected }: FieldOption) => selected)?.value &&
    props.schema.values?.length > 1;
  const isSingleValueSelected =
    props.schema.type === FieldType.select && props.schema.values?.length === 1;

  return (
    value.value ||
    hasSelectedValues ||
    props.schema.disabled ||
    props.schema.type === FieldType.date ||
    props.schema.custom?.staticLabel ||
    isSingleValueSelected
  );
});

const label = computed(() => {
  if (!props.schema.label) {
    return '';
  }

  if (!showOptional.value) {
    return props.schema.label;
  }

  return `${props.schema.label} '(optional)'`;
});

watch(
  () => props.schema.validation,
  (curr, prev) => {
    const validationDidNotChange =
      JSON.stringify(prev) === JSON.stringify(curr);
    if (validationDidNotChange) return;

    // Resets validation error if validation changed from outside
    error.text = '';
  },
);

const emitChange = (e: { value: string; error: FieldError }) => {
  if (!fieldRef.value) {
    return;
  }

  let emitValue: string | EmitValue;

  if (props.schema.getSplitValue) {
    emitValue = {
      prepend: prependValue.value,
      prefix: props.schema.prefix || '',
      value: value.value,
      append: appendValue.value,
    };
  } else {
    emitValue = `${prependValue.value}${props.schema.prefix || ''}${
      value.value
    }${appendValue.value}`;
  }

  const eventData = {
    ...e,
    value: emitValue,
  };

  const fieldName = fieldRef.value.getAttribute('name') as string;

  fieldRef.value.dispatchEvent(
    new CustomEvent('on-change', {
      detail: [eventData, fieldName],
    }),
  );

  emit('on-change', eventData);
};

const onChange = (e: { value: string; error: FieldError }) => {
  error.text = e.error?.text || '';
  error.params = e.error?.params || [];
  value.value = e.value;
  emitChange(e);
};

const onEnterPress = () => {
  if (!fieldRef.value) return;

  fieldRef.value.dispatchEvent(new CustomEvent('on-enter-press'));

  emit('on-enter-press');
};

const onBlur = () => {
  isFocused.value = false;
  emit('on-blur');
};

const onFocus = () => {
  isFocused.value = true;
  emit('on-focus');
};

const onCopy = () => {
  isFocused.value = true;
  emit('on-copy', value.value);
};

const onHFormLoad = () => {
  if (!fieldRef.value) return;

  const fieldName = fieldRef.value.getAttribute('name');

  fieldRef.value.dispatchEvent(
    new CustomEvent('on-load', {
      detail: {
        fieldName,
        inputRef: fieldInputRef.value,
      },
    }),
  );
};

onMounted(() => {
  if (!fieldRef.value) return;

  fieldRef.value.addEventListener('on-h-form-load', onHFormLoad);
});

onUnmounted(() => {
  if (!fieldRef.value) return;

  fieldRef.value.removeEventListener('on-h-form-load', onHFormLoad);
});
</script>

<template>
  <div ref="fieldRef" class="field-container">
    <div class="field-holder">
      <div
        class="field"
        :class="[
          { 'field--focused': isFocused },
          { 'field--dark': schema.custom?.isDark },
          { 'field--error': error.text || customError },
          { 'field--disabled': schema.disabled },
          { 'field--textarea': schema.type === FieldType.textarea },
          { 'field--with-append': schema.append },
          { 'field--with-prepend': schema.prepend },
        ]"
      >
        <HFormFieldBorder
          :schema="schema"
          :focused="isFocused"
          :show-optional="showOptional"
          :label-filled="labelFilled"
          :label="label"
          :value="value"
          :error="isError"
        />
        <HFormFieldLabel
          v-if="label"
          :schema="schema"
          :focused="isFocused"
          :show-optional="showOptional"
          :label-filled="labelFilled"
          :label="label"
          :value="value"
          :error="isError"
        />
        <HFormFieldInput
          v-if="props.schema.type !== FieldType.select"
          ref="fieldInputRef"
          :schema="schema"
          :error="error"
          :is-focused="isFocused"
          :prepend-value="prependValue"
          :append-value="appendValue"
          :is-append-changed="isAppendChanged"
          @on-focus="onFocus"
          @on-blur="onBlur"
          @on-change="onChange"
          @on-enter-press="onEnterPress"
          @on-copy="onCopy"
        />
      </div>

      <HFormFieldInfo
        v-if="!showPasswordTags"
        class="field__info--desktop"
        :value="value"
        :error="customError || error"
        :limit="maxlength"
        :hint="schema.hint"
        :absolute="schema.custom?.isErrorLabelAbsolute"
      />

      <Transition name="fade-slow">
        <HFormFieldPasswordTags
          v-if="showPasswordTags"
          :schema="schema"
          :is-simple="schema.validation?.simplePassword"
          :password="value"
          :confirmed-password="schema.password?.confirmedPassword"
        />
      </Transition>
    </div>

    <HFormFieldInfo
      v-if="!showPasswordTags || !value"
      class="field__info--mobile"
      :value="value"
      :error="customError || error"
      :limit="maxlength"
      :hint="schema.hint"
    />
  </div>
</template>

<style lang="scss">
$input-height: 48px;
// This is needed to make <fieldset> work
$input-inset-height: 10px;

.field-border {
  $this: &;

  position: absolute;
  border: hidden;
  pointer-events: none;
  min-width: 0%;
  inset: calc($input-inset-height * -1) 0 0;
  padding: 0;
  border: 1px solid var(--gray-border);
  z-index: var(--z-index-child-1);
  padding: 0 8px;
  border-radius: 8px;
  margin: 0;
  text-align: left;
  transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &__legend {
    float: unset;
    width: auto;
    overflow: hidden;
    display: block;
    padding: 0;
    font-size: 0.85em;
    height: 21px;
    visibility: hidden;
    max-width: 0.01px;
    transition: max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms;
    white-space: nowrap;

    & > span {
      padding-left: 5px;
      padding-right: 5px;
      display: inline-block;
      opacity: 0;
      visibility: visible;
    }

    &--no-width:not(.s) {
      max-width: 0;
    }

    &--active,
    &--filled {
      max-width: 100%;
    }
  }

  &--dark#{$this}--focused:not(.s) {
    border: 2px solid var(--meteorite);
  }

  &--focused:not(.s) {
    border: 2px solid var(--primary);
  }

  &--error:not(.s) {
    border: 2px solid var(--danger);
  }

  &--textarea {
    height: auto;

    .field-label {
      top: 24px;
    }
  }

  &--disabled,
  &[disabled] {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }

  &--append {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &--prepend {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &--with-prepend {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;
  }

  &--with-append {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }

  &--with-append.field-border--append {
    border-right: unset;
  }

  &--prefix {
    input {
      padding: 12px 16px 12px 0;
    }
  }

  @media (max-width: 576px) {
    &--prepend {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: 4px;
      border-bottom: 0;
    }

    &--append {
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 4px;
      border-top: 0;
    }

    &--append.field-border--focused {
      border-top: 2px solid var(--primary);
    }

    &--prepend.field-border--focused {
      border-bottom: 2px solid var(--primary);
    }

    &--with-prepend {
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 4px;
      border-left: 1px solid var(--gray-border);
    }

    &--with-append {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-right: 1px solid var(--gray-border);
    }

    &--with-append.field-border--with-prepend {
      border-radius: 0;
    }
  }
}

.field-container {
  width: 100%;
  display: flex;
  font-size: 14px;
  margin-bottom: 24px;
  width: 100%;

  @media (max-width: 576px) {
    flex-direction: column;

    .field {
      &__info {
        &--mobile {
          display: block;
        }

        &--desktop {
          display: none;
        }
      }
    }
  }
}

.field-holder {
  display: inline-block;
  flex: 1;
  width: 100%;
}

.field {
  $this: &;

  position: relative;
  border-radius: 8px;
  background-color: var(--light);
  transition: 150ms;

  &--dark {
    .icon-gray:not(.icon-disabled) {
      fill: var(--meteorite) !important;
    }

    #{$this}__input {
      background-color: #2c2b35;
    }

    #{$this}__input input {
      color: var(--light);
      background-color: #2c2b35;
    }
  }

  &--append,
  &--prepend {
    align-self: flex-start;

    @media (max-width: 576px) {
      width: 100%;
    }
  }

  &--append {
    max-width: 50%;
    @media (max-width: 576px) {
      max-width: 100%;
    }
    @media (max-width: 340px) {
      max-width: 280px;
    }
    .field__input {
      overflow: auto;
      @media (min-width: 575px) {
        white-space: nowrap;
      }
    }
  }

  &__info {
    &--mobile {
      display: none;
    }
  }

  &__input-prefix {
    line-height: 24px;
    padding: 12px 0 12px 16px;
  }

  &__input {
    border-radius: 8px;
    display: flex;
    align-items: center;
    border: none;
    line-height: 24px;
    width: 100%;
    color: var(--gray-dark);

    textarea {
      border: none;
      width: 100%;
      padding: 12px 16px;
      color: var(--gray-dark);
      border-radius: 4px;

      &:focus,
      &:active,
      &:hover,
      &:visited {
        outline: none;
      }

      &::placeholder {
        box-sizing: border-box;
        color: var(--gray);
        line-height: 24px;
      }
    }

    input {
      border: none;
      width: 100%;
      padding: 12px 16px;
      line-height: 24px;
      color: var(--gray-dark);
      border-radius: 4px;

      &:focus,
      &:active,
      &:hover,
      &:visited {
        outline: none;
      }

      &[type='date'] {
        line-height: 22px;

        &::-webkit-calendar-picker-indicator {
          background: transparent;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;

          &:focus,
          &:hover {
            outline: none;
          }
        }

        &::after {
          content: '';
          position: absolute;
          top: 12px;
          right: 16px;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23727586" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
          width: 22px;
          height: 22px;
          background-size: contain;
          pointer-events: none;
        }
      }

      &::placeholder {
        box-sizing: border-box;
        color: var(--gray);
        line-height: 24px;
      }
    }

    &:focus,
    &:active,
    &:hover,
    &:visited {
      outline: none;
    }

    &[disabled] {
      background-color: var(--gray-light);
      cursor: not-allowed;
    }

    &--textarea {
      height: auto;

      .field-label {
        top: 24px;
      }
    }

    &--disabled,
    &[disabled] {
      background-color: var(--gray-light);
      cursor: not-allowed;
    }

    &--prefix {
      input {
        padding: 12px 16px 12px 0;
      }
    }

    &--icon-left input {
      padding-left: 0px;
    }

    &--icon-right input {
      padding-right: 0px;
    }

    &--dropdown {
      padding: 12px 48px 12px 16px;
    }

    &--dropdown-disabled {
      padding: 12px 16px 12px 16px;
      background-color: var(--gray-light);
      cursor: not-allowed !important;
    }
  }
}
</style>
