import { computed } from 'vue';

import { useResourcesStore } from '@/stores/resourcesStore';
import { useSubscriptionsStore } from '@/stores/subscriptionsStore';
import type { HResourceState, HResourceType } from '@/types';
import { mapResourcesToSubscriptions } from '@/utils/resourcesMapper';

export const useResourceMapper = () => {
  const subscriptionStore = useSubscriptionsStore();
  const resourcesStore = useResourcesStore();

  const resourcesWithSubscriptions = computed(() =>
    mapResourcesToSubscriptions({
      resources: resourcesStore.resources,
      subscriptions: subscriptionStore.subscriptions,
    }),
  );

  const getResourcesByTypesAndStates = ({
    types,
    states,
  }: {
    types?: HResourceType[];
    states?: HResourceState[];
  }) =>
    resourcesWithSubscriptions.value.filter((resource) => {
      const hasType = types ? types.includes(resource.type) : true;
      const hasState = states ? states.includes(resource.state) : true;

      return hasType && hasState;
    });

  return {
    resourcesWithSubscriptions,
    getResourcesByTypesAndStates,
  };
};
