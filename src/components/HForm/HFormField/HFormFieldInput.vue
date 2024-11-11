<script setup lang="ts">
import type { VNodeRef } from 'vue';
import { computed, ref, watch, onMounted } from 'vue';

import HFormList from '@/components/HForm/HFormField/HFormList.vue';
import useFormField from '@/composables/useFormField';
import type { FieldError, FieldOption } from '@/types';
import { FieldType } from '@/types';

type Props = {
  schema: any;
  isFocused: boolean;
  error: FieldError;
  appendValue: string;
  prependValue: string;
  isAppendChanged: boolean;
};
interface Emits {
  (eventName: 'on-change', payload: { value: string; error: FieldError }): void;
  (eventName: 'on-enter-press'): void;
  (eventName: 'on-focus'): void;
  (eventName: 'on-blur'): void;
  (eventName: 'on-copy', payload: string): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const value = ref(props.schema.value || '');
const touched = ref(false);
const formFieldInputRef = ref<VNodeRef & { focus: () => {} }>();

const { onBlur, onChange, onCopy, validateFromOutside, validateSilently } =
  useFormField(props, emit, value, touched);

const resetFromOutside = () => {
  value.value = props.schema.value || '';
  onChange(true);
};

watch(
  () => props.schema.value,
  (curr, prev) => {
    const initialValueDidNotChange =
      JSON.stringify(prev) === JSON.stringify(curr);

    if (initialValueDidNotChange) return;

    // Changes input value if value changed from outside
    value.value = props.schema.value || '';
    onChange(true);
  },
);

watch(
  () => props.isAppendChanged,
  () => {
    onChange();
  },
);

const maxlength = computed(() => props.schema.validation?.maxlength);
const dateMax = computed(() => props.schema.validation?.date?.max);
const dateMin = computed(() => props.schema.validation?.date?.min);

const isPasswordType = computed(() => props.schema.type === FieldType.password);
const isPasswordHidden = ref(true);
const passwordFieldIcon = computed(() =>
  isPasswordHidden.value ? 'icon-visibility' : 'icon-visibility-off',
);

const leftIcon = computed(() => props.schema.icon?.left);

const rightIcon = computed(() => props.schema.icon?.right);

const isAutocomplete = computed(
  () =>
    props.schema.type === FieldType.text && props.schema.custom?.autocomplete,
);

const isPrefixShown = computed(
  () => props.schema.prefix && (props.isFocused || value.value),
);

const isCopyable = computed(() => props.schema.custom?.isCopyable);

const inputType = computed(() => {
  if (props.schema.type === FieldType.password) {
    return isPasswordHidden.value ? FieldType.password : FieldType.text;
  }

  return props.schema.type;
});

const placeholder = computed(() => {
  if (props.isFocused) {
    return props.schema.placeholder;
  }

  return undefined;
});

const isHpListShown = computed(() => isAutocomplete.value && props.isFocused);

const onInput = (e: any) => {
  value.value = e.target.value;
  onChange();
};

const onInputBlur = (e?: any) => {
  if (
    isAutocomplete.value &&
    Array.from<string>(e.relatedTarget?.classList ?? []).some(
      (item) => item.includes('field-select') || item.includes('field__text'),
    )
  ) {
    return;
  }
  touched.value = true;
  onBlur();
};

const onSelect = ({ value: val }: FieldOption) => {
  value.value = val;
  onBlur();
};

defineExpose({
  validateFromOutside,
  resetFromOutside,
  validateSilently,
  schema: props.schema,
});

onMounted(() => {
  if (props.isFocused) {
    formFieldInputRef.value?.focus();
  }
});
</script>

<template>
  <div class="field__container">
    <div
      class="field__input"
      :class="{
        'field__input--icon-left': leftIcon,
        'field__input--icon-right': rightIcon,
        'field__input--prefix': isPrefixShown,
      }"
    >
      <div v-if="leftIcon" class="field__icon field__icon--left" />

      <span v-if="isPrefixShown" class="field__input-prefix">
        {{ schema.prefix }}
      </span>

      <textarea
        v-if="schema.type === FieldType.textarea"
        :id="schema.id"
        ref="formFieldInputRef"
        :value="value"
        class="field__textarea"
        :maxlength="maxlength"
        :disabled="schema.disabled"
        :rows="schema.rows"
        :cols="schema.cols"
        @focus="emit('on-focus')"
        @blur="onInputBlur"
        @input="onInput"
      />

      <div v-else class="field__text" tabindex="-1">
        <input
          :id="schema.id"
          ref="formFieldInputRef"
          data-qa="h-form-field-input"
          :autocomplete="schema.aria?.autocomplete"
          :value="value"
          :type="inputType"
          :placeholder="placeholder"
          :disabled="schema.disabled"
          :maxlength="maxlength"
          :readonly="schema.isReadOnly"
          :max="dateMax"
          :min="dateMin"
          @focus="emit('on-focus')"
          @blur="onInputBlur"
          @input="onInput"
          @keypress.enter="emit('on-enter-press')"
        />
        <HFormList
          v-if="isHpListShown"
          class="field-select__options"
          :options="schema.values || []"
          :is-loading="schema.custom?.isLoading"
          :no-options="!schema.values?.length"
          @on-select="onSelect"
        />
      </div>

      <div v-if="isPasswordType || rightIcon" class="field__icons--right">
        <div
          v-if="isPasswordType"
          class="field__icon field__icon--right"
          :class="{ 'field__icon--clickable': isPasswordType }"
          @click="isPasswordHidden = !isPasswordHidden"
        />
        <div v-else-if="rightIcon" class="field__icon field__icon--right" />
      </div>

      <div v-if="isCopyable" class="field__icons--right" @click="onCopy">
        <div class="field__icon field__icon--right cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.splitter {
  background-color: var(--gray-border);
  width: 1px;
  height: 48px;
}

.field-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.field {
  &__text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__textarea {
    resize: vertical;
    border: none;
    padding: 0;
    border-radius: 4px;
    font-size: 14px;
    line-height: 22px;
    color: var(--dark);
    width: 100%;
    padding: 0;
    display: block;
    &:hover,
    &:focus {
      outline: none;
    }
  }

  &__icon {
    display: inline-block;
    vertical-align: middle;
    position: relative;

    &--left {
      margin-right: 8px;
      margin-left: 16px;
      left: 0;
    }

    &--right {
      margin-left: 8px;
      margin-right: 16px;
      right: 0px;
    }

    &--additional {
      margin: auto;
      margin-right: 16px;
      margin-left: 16px;
    }

    &--clickable {
      cursor: pointer;
    }
  }

  &__container {
    display: flex;
  }
}
</style>
