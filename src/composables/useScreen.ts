import { useBreakpoints, useWindowSize } from '@vueuse/core';
import { ref, watch } from 'vue';

export const useScreen = () => {
  const { isSmallerOrEqual } = useBreakpoints({
    small: 576,
    medium: 768,
    large: 992,
    xlarge: 1200,
    xxlarge: 1400,
  });
  const { width } = useWindowSize();
  const isSmall = ref(isSmallerOrEqual('small'));
  const isMedium = ref(isSmallerOrEqual('medium'));
  const isLarge = ref(isSmallerOrEqual('large'));
  const isXLarge = ref(isSmallerOrEqual('xlarge'));
  const isXXLarge = ref(isSmallerOrEqual('xxlarge'));

  watch(width, () => {
    isSmall.value = isSmallerOrEqual('small');
    isMedium.value = isSmallerOrEqual('medium');
    isLarge.value = isSmallerOrEqual('large');
    isXLarge.value = isSmallerOrEqual('xlarge');
    isXXLarge.value = isSmallerOrEqual('xxlarge');
  });

  return {
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    isXXLarge,
  };
};
