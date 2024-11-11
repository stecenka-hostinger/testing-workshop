import type { Ref } from 'vue';
import { computed } from 'vue';

import validators from '@/utils/hFormValidation';

export default (props: any, emit: any, value: any, touched: Ref<boolean>) => {
  const fullValue = computed(
    () =>
      `${props.prependValue}${props.schema.prefix || ''}${value.value}${
        props.appendValue
      }`,
  );

  const onChange = (
    ignoreValidation?: boolean,
    forceValidate?: boolean,
    isSubmit?: boolean,
  ) =>
    emit('on-change', {
      value: value.value,
      error:
        (!ignoreValidation && touched.value) || forceValidate
          ? validate(fullValue.value)
          : null,
      isSubmit,
    });

  const onBlur = () => {
    emit('on-blur');
    onChange();
  };

  const onCopy = () => {
    emit('on-copy', value.value);
  };

  const validate = (fullValue: string) => {
    if (!props.schema.validation) return '';

    const nativeValidators = ['maxlength'];

    for (const [vName, vSettings] of Object.entries(props.schema.validation)) {
      if (nativeValidators.includes(vName)) return null;
      if (vName === 'required' && !vSettings && !value.value) return null;

      if (vName === 'required') {
        const error = validators.required(value.value);
        if (error) return error;
      }

      const error =
        vName === 'custom'
          ? props.schema.validation.custom(fullValue)
          : (validators as any)[vName](fullValue, vSettings);
      if (error) return error;
    }

    return null;
  };

  const validateFromOutside = () => onChange(false, true, true);

  const validateSilently = () => {
    const error = validate(fullValue.value);

    return !error;
  };

  return {
    props,
    emit,
    onChange,
    onBlur,
    onCopy,
    validateFromOutside,
    validateSilently,
  };
};
