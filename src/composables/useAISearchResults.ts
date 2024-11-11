import { isEmpty } from 'lodash';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useResourceMapper } from '@/composables/useResourceMapper';
import { useProfileStore } from '@/stores/profileStore';
import type {
  AiSearchDynamicType,
  IAISearchProcessedResult,
  IAISearchResult,
} from '@/types';
import {
  AI_SEARCH_DYNAMIC_TYPE,
  DYNAMIC_PARAM_PREFIX,
  OPTIONAL_PARAM_SUFFIX,
  Route,
  SubscriptionStatus,
  BREADCRUMB_SEPARATOR,
} from '@/types';
import { mapKeyValue } from '@/utils';
import type { ResourceWithSubscription } from '@/utils/resourcesMapper';

export const getFirstSubscriptionItem = (subscription: any): any =>
  subscription.items?.[0];

export const getRoute = (routeName: string, params = {}) => {
  const route = {
    name: routeName,
    params,
  };

  return route;
};

export const getBreadcrumbs = (
  breadcrumbs: string,
  {
    param,
    value,
  }: {
    param: string;
    value: string;
  },
) => {
  if (!param) return breadcrumbs;

  return breadcrumbs.replace(
    `${DYNAMIC_PARAM_PREFIX}${param}`,
    highlightBreadcrumbData(value),
  );
};

export const getSubscriptionTitle = (resource: ResourceWithSubscription) => {
  const subscriptionName =
    getFirstSubscriptionItem(resource.subscription)?.name ||
    resource.metadata?.planTitle ||
    '';

  const domain = resource.title;

  return domain ? `${subscriptionName} - ${domain}` : subscriptionName;
};

export const mapHBillingResult = (
  resource: ResourceWithSubscription,
  routeName: string,
  result: IAISearchResult,
) => ({
  route: getRoute(routeName, {
    id: resource.chargebeeSubscriptionId || '',
  }),
  breadcrumbs: getBreadcrumbs(result.metadata.breadcrumbs, {
    param: 'id',
    value: resource.title || resource.metadata?.planTitle || '',
  }),
  title: getSubscriptionTitle(resource),
});

export const mapVPSResult = (
  resource: ResourceWithSubscription,
  routeName: string,
  result: IAISearchResult,
) => ({
  route: getRoute(routeName, {
    id: resource.referenceId || '',
  }),
  breadcrumbs: getBreadcrumbs(result.metadata.breadcrumbs, {
    param: 'id',
    value: resource.title || '',
  }),
  title: getSubscriptionTitle(resource),
});

export const mapDomainParamResult = (
  resource: ResourceWithSubscription,
  routeName: string,
  result: IAISearchResult,
) => {
  let breadcrumbs = result.metadata.breadcrumbs;

  if (resource.type === 'domain') {
    // remove / :?subscriptionId from breadcrumbs
    breadcrumbs = breadcrumbs
      .split(BREADCRUMB_SEPARATOR)
      .filter((breadcrumb) => !breadcrumb.includes(OPTIONAL_PARAM_SUFFIX))
      .join(BREADCRUMB_SEPARATOR);
  }

  return {
    route: getRoute(routeName, {
      domain: resource.title || '',
    }),
    breadcrumbs: getBreadcrumbs(breadcrumbs, {
      param: 'domain',
      value: resource.title || '',
    }),
    title: getSubscriptionTitle(resource),
  };
};

export const mapSubscriptionIdParamResult = (
  resource: ResourceWithSubscription,
  routeName: string,
  result: IAISearchResult,
) => ({
  route: {
    name: routeName,
    params: {
      id: resource.chargebeeSubscriptionId || '',
    },
  },
  breadcrumbs: getBreadcrumbs(result.metadata.breadcrumbs, {
    param: 'id',
    value: resource.title || '',
  }),
  title: result.metadata.subheader,
});

export const mapGenericResult = (
  routeName: string,
  result: IAISearchResult,
) => ({
  route: {
    name: routeName,
  },
  breadcrumbs: result.metadata.breadcrumbs,
  title: result.metadata.subheader,
});

export const highlightBreadcrumbData = (value: string) =>
  `<span highlighted="true">${value}</span>`;

export const addMissingBreadcrumbs = (result: IAISearchResult) => {
  if (result.metadata.subheader) {
    return result;
  }

  const firstBreadcrumb =
    result.metadata.breadcrumbs.split(BREADCRUMB_SEPARATOR)[0] ||
    result.metadata.breadcrumbs;

  return {
    ...result,
    metadata: {
      ...result.metadata,
      subheader: firstBreadcrumb,
    },
  };
};

export const filterInvalidResults = (
  result: IAISearchResult,
  index: number,
  array: IAISearchResult[],
) => {
  const metadata = result.metadata;
  const hasSubheader = !!metadata.subheader;
  const hasBreadcrumbs = !!metadata.breadcrumbs;
  const hasPath = !!metadata.path;
  const isUniqueBreadcrumbs =
    array
      .map(({ metadata }) => metadata.breadcrumbs)
      .indexOf(metadata.breadcrumbs) === index;

  return hasSubheader && isUniqueBreadcrumbs && hasPath && hasBreadcrumbs;
};

export const translateBreadcrumbs = (result: IAISearchResult) => {
  const breadcrumbs = result.metadata.breadcrumbs
    .split(BREADCRUMB_SEPARATOR)
    .map((breadcrumb) => breadcrumb.trim())
    .join(` ${BREADCRUMB_SEPARATOR} `);

  return {
    ...result,
    metadata: {
      ...result.metadata,
      breadcrumbs,
    },
  };
};

export const removeDynamicParamsFromBreadcrumbs = (breadcrumbs: string) =>
  breadcrumbs
    .split(BREADCRUMB_SEPARATOR)
    .filter((breadcrumb) => !breadcrumb.includes(DYNAMIC_PARAM_PREFIX))
    .join(BREADCRUMB_SEPARATOR);

const getIsDynamicDomainType = (routeType: AiSearchDynamicType) =>
  (
    [
      AI_SEARCH_DYNAMIC_TYPE.HOSTING_DASHBOARD,
      AI_SEARCH_DYNAMIC_TYPE.EMAIL,
      AI_SEARCH_DYNAMIC_TYPE.TITAN_EMAIL,
      AI_SEARCH_DYNAMIC_TYPE.DOMAIN,
    ] as AiSearchDynamicType[]
  ).includes(routeType);

const ROUTE_MAPPER = {
  [AI_SEARCH_DYNAMIC_TYPE.HOSTING_V2]: mapSubscriptionIdParamResult,
  [AI_SEARCH_DYNAMIC_TYPE.HOSTING_DASHBOARD]: mapDomainParamResult,
  [AI_SEARCH_DYNAMIC_TYPE.EMAIL]: mapDomainParamResult,
  [AI_SEARCH_DYNAMIC_TYPE.HBILLING]: mapHBillingResult,
  [AI_SEARCH_DYNAMIC_TYPE.VPS]: mapVPSResult,
  [AI_SEARCH_DYNAMIC_TYPE.TITAN_EMAIL]: mapDomainParamResult,
  [AI_SEARCH_DYNAMIC_TYPE.DOMAIN]: mapDomainParamResult,
};

export const useAISearchResults = () => {
  const router = useRouter();
  const { getResourcesByTypesAndStates, resourcesWithSubscriptions } =
    useResourceMapper();
  const profileStore = useProfileStore();

  const billingResources = computed(() =>
    resourcesWithSubscriptions.value.flatMap((resource) => {
      if (!resource.chargebeeSubscriptionId) return [];

      if (
        resource.state === 'deleted' ||
        resource.state === 'deleting' ||
        resource.subscription.status === SubscriptionStatus.CANCELLED
      ) {
        return [];
      }

      return resource;
    }),
  );

  const hostingResources = computed(() =>
    getResourcesByTypesAndStates({
      types: ['hosting'],
      states: ['active'],
    }),
  );
  const emailResources = computed(() =>
    getResourcesByTypesAndStates({ types: ['email'], states: ['active'] }),
  );

  const titanEmailResources = computed(() =>
    getResourcesByTypesAndStates({
      types: ['titan_mail'],
      states: ['active'],
    }),
  );

  const vpsResources = computed(() =>
    getResourcesByTypesAndStates({
      types: ['virtual_machine'],
      states: ['active'],
    }),
  );

  const domainResources = computed(() =>
    getResourcesByTypesAndStates({
      types: ['domain'],
      states: ['active'],
    }),
  );

  const filteredRouteNames = computed(() => {
    const filterRouteNames: string[] = [
      Route.Billing.DISABLE_AUTO_RENEWAL,
      // TODO - Route.HBilling.PAYMENT_HISTORY_DETAILS (need to fetch data from invoices)
      Route.HBilling.PAYMENT_HISTORY_DETAILS,
      // TODO - Route.HBilling.REFUND_HISTORY_DETAILS (need to fetch data from invoices)
      Route.HBilling.REFUND_HISTORY_DETAILS,
      Route.Base.NOT_FOUND,
      // Requires dynamic
      Route.HostingWebsite.ERROR_PAGES_EDIT,
      // TODO - add dynamic values of directory and domainToManage
      Route.HostingWordpress.MANAGE_STAGING_DASHBOARD,
      Route.HostingWordpress.MANAGE_STAGING_SECURITY,
      ...Object.values(Route.Playground),
      ...Object.values(Route.HostingerPro),
    ];

    if (profileStore.isAccessManager) {
      return filterRouteNames.concat(...Object.values(Route.Profile));
    }

    return filterRouteNames;
  });

  const sortBySearchValue = (
    a: IAISearchProcessedResult,
    b: IAISearchProcessedResult,
    searchValue: string,
  ) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    const aIndex = a.title.toLowerCase().indexOf(searchValueLower);
    const bIndex = b.title.toLowerCase().indexOf(searchValueLower);

    return bIndex - aIndex;
  };

  const getResourceByRouteType = (
    routeType: string,
  ): ResourceWithSubscription[] => {
    const ROUTE_RESOURCE_MAP = {
      [AI_SEARCH_DYNAMIC_TYPE.HOSTING_V2]: hostingResources.value,
      [AI_SEARCH_DYNAMIC_TYPE.HOSTING_DASHBOARD]: hostingResources.value,
      [AI_SEARCH_DYNAMIC_TYPE.EMAIL]: emailResources.value,
      [AI_SEARCH_DYNAMIC_TYPE.HBILLING]: billingResources.value,
      [AI_SEARCH_DYNAMIC_TYPE.VPS]: vpsResources.value,
      [AI_SEARCH_DYNAMIC_TYPE.TITAN_EMAIL]: titanEmailResources.value,
      [AI_SEARCH_DYNAMIC_TYPE.DOMAIN]: domainResources.value,
      default: [],
    };

    return mapKeyValue(ROUTE_RESOURCE_MAP, routeType);
  };

  const mapResults = (results: IAISearchResult[], searchValue: string) => {
    const filteredResults = results
      .map(addMissingBreadcrumbs)
      .filter(filterInvalidResults)
      .map(translateBreadcrumbs);

    const mappedResults: IAISearchProcessedResult[] = [];

    filteredResults.forEach((result) => {
      const resolvedRoute = router.resolve({ path: result.metadata.path });
      const routeName = resolvedRoute.name as string;

      if (filteredRouteNames.value.includes(routeName)) return;

      const isStaticRoute = isEmpty(resolvedRoute.params);

      if (isStaticRoute) {
        if (!profileStore.isTitanEmail) {
          return;
        }

        mappedResults.push(mapGenericResult(routeName, result));

        return;
      }

      const routeType = 'domain';

      if (!routeType) return;

      if (!ROUTE_MAPPER[routeType]) return;

      const resources = getResourceByRouteType(routeType);
      resources.forEach((resource) => {
        if (getIsDynamicDomainType(routeType) && !resource.title) {
          return;
        }

        mappedResults.push(
          ROUTE_MAPPER[routeType](resource, routeName, result),
        );
      });
    });

    return mappedResults
      .map((result) => ({
        ...result,
        breadcrumbs: removeDynamicParamsFromBreadcrumbs(result.breadcrumbs),
      }))
      .sort((a, b) => sortBySearchValue(a, b, searchValue));
  };

  return {
    filteredRouteNames,
    mapResults,
  };
};
