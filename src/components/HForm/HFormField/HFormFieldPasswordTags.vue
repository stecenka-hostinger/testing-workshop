<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

type Props = {
  schema: any;
  password: string;
  confirmedPassword?: string;
  isSimple?: boolean;
};

const props = defineProps<Props>();

const minChars = computed(() => props.schema.validation?.min || 8);

const maxChars = computed(() => props.schema.validation?.max || 50);

const minAndMaxRegex = computed(
  () => new RegExp(`^(?=.{${minChars.value},${maxChars.value}}$).*`),
);

const symbolsRegex = computed(() => {
  const allowedSymbols = props.schema.validation?.allowedSymbols;
  if (allowedSymbols) {
    return new RegExp(
      `^(?=.*[${allowedSymbols}])[A-Za-z0-9${allowedSymbols}]+$`,
    );
  }

  return /[\\!"#$%&'`()*+,-.\/:;<=>?@[\]^_{|}~]/;
});

const oneSymbolTitle = computed(() => {
  if (props.schema.validation?.allowedSymbols) {
    return 'Only symbols: {symbols}';
  }

  return 'One symbol {symbols}';
});

const simplePasswordValidations = reactive<
  Record<string, { passed: boolean; title: string; regExp: RegExp }>
>({
  useMinAndMaxChars: {
    passed: false,
    title: 'Use {min}-{max} characters',
    regExp: minAndMaxRegex.value,
  },
  onlyLatin: {
    passed: false,
    title: 'Only Latin letters',
    regExp: /^((?![^\x00-\x7Fa-zA-Z]).)*$/,
  },
});

const complexPasswordValidations = reactive<
  Record<string, { passed: boolean; title: string; regExp: RegExp }>
>({
  oneNumber: {
    passed: false,
    title: 'One number',
    regExp: /\d/,
  },
  oneSymbol: {
    passed: false,
    title: oneSymbolTitle.value,
    regExp: symbolsRegex.value,
  },
  oneLowerCase: {
    passed: false,
    title: 'One lowercase letter',
    regExp: /[a-z]/,
  },
  oneUpperCase: {
    passed: false,
    title: 'One uppercase letter',
    regExp: /[A-Z]/,
  },
  ...simplePasswordValidations,
});

const validations = reactive<
  Record<string, { passed: boolean; title: string; regExp: RegExp }>
>(props.isSimple ? simplePasswordValidations : complexPasswordValidations);

const resetValidations = () => {
  Object.entries(validations).forEach(([key]) => {
    validations[key].passed = false;
  });
};

const passwordMatchValidation = reactive({
  passed: false,
  title: 'Passwords match',
});

const passwordsMatch = () => {
  if (!props.password || !props.confirmedPassword) return false;

  return props.password === props.confirmedPassword;
};

const requirementsCheck = (password?: string) => {
  if (!password) return resetValidations();

  Object.keys(validations).forEach((key) => {
    if (props.confirmedPassword) {
      return (passwordMatchValidation.passed = passwordsMatch());
    }

    (validations as any)[key].passed = new RegExp(
      (validations as any)[key].regExp,
    ).test(password);
  });
};

const requirements = computed(() => {
  if (props.confirmedPassword) {
    return [passwordMatchValidation];
  }

  return Object.values(validations);
});

watch(
  () => props.password,
  (value) => requirementsCheck(value),
  { immediate: true },
);
watch(
  () => props.confirmedPassword,
  (value) => requirementsCheck(value),
);
</script>

<template>
  <div class="password-tags">
    <div
      v-for="(requirement, index) in requirements"
      :key="`requirement-${index}`"
      class="requirement"
    >
      <div>
        <div>
          <hp-icon
            v-if="requirement.passed"
            icon="ic-check"
            success
            view-box="-8 -6 36 36"
          />
          <hp-icon
            v-else
            icon="ic-circle"
            gray-light
            view-box="-12 -12 32 36"
          />
        </div>
        <p class="requirement__title">
          {{ requirement.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.password-tags {
  margin-top: 4px;
}

.fade-slow-enter-to {
  opacity: 1;
}

.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.6s;
}
.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}

.requirement {
  display: inline-block;
  vertical-align: top;
  text-align: left;
  width: 50%;
  margin: 4px 0;
  color: var(--gray);

  &__title {
    margin: 0 0 0 8px;
    font-size: 14px;
  }

  div {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 460px) {
    width: 100%;
  }
}
</style>
