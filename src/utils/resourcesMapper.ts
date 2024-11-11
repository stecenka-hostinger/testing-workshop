export const mapResourcesToSubscriptions = ({
  resources,
  subscriptions,
}: {
  resources: any[];
  subscriptions: any[];
}) =>
  resources.flatMap((resource) => {
    const subscription =
      subscriptions.find(
        (subscription) => subscription.id === resource.chargebeeSubscriptionId,
      ) ?? {};

    return {
      ...resource,
      subscription,
    };
  });

export type ResourcesWithSubscriptions = ReturnType<
  typeof mapResourcesToSubscriptions
>;
export type ResourceWithSubscription = ResourcesWithSubscriptions[0];
