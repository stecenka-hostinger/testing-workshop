export interface IAISearchProcessedResult {
  route: {
    name: string;
    params?: Record<string, string>;
  };
  breadcrumbs: string;
  title: string;
}

export const AI_SEARCH_RESULT_ID = 'ai-search-result';

export const HRESOURCES_STATE = {
  ACTIVE: 'active',
  PENDING: 'pending_setup',
  UPDATING: 'updating',
  FAILED: 'failed',
  SUSPENDED: 'suspended',
  SUSPENDING: 'suspending',
  ACTIVATING: 'activating',
  COMPLETED: 'completed',
  CREATED: 'created',
  UNSUSPENDING: 'unsuspending',
  DELETED: 'deleted',
  DELETING: 'deleting',
  DESTROYED: 'destroyed',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
  LOADING: 'loading',
} as const;

export const HRESOURCES_TYPE = {
  VIRTUAL_MACHINE: 'virtual_machine',
  EMAIL: 'email',
  GOOGLE_WORKSPACE: 'google_workspace',
  TITAN_MAIL: 'titan_mail',
  DOMAIN: 'domain',
  DOMAIN_TRANSFER: 'domain_transfer',
  FREE_DOMAIN: 'free_domain',
  FREE_DOMAIN_TRANSFER: 'free_domain_transfer',
  CPANEL_RESELLER_HOSTING: 'cpanel_reseller_hosting',
  DOMAIN_PRIVACY_PROTECTION: 'domain_privacy_protection',
  HOSTING: 'hosting',
  CPANEL_HOSTING: 'cpanel_hosting',
  PRIORITY_SUPPORT: 'priority_support',
  SSL: 'ssl',
  CLOUDFLARE: 'cloudflare',
  RANKING_COACH: 'ranking_coach',
  WEBSITE_BUILDER: 'website_builder',
  DAILY_BACKUP: 'daily_backup',
  DEVELOPER_TOOLS: 'developer_tools',
} as const;

export namespace Hosting {
  export enum Plan {}
}
export const HRESOURCE_ITEM_STATE = {
  ACTIVE: 'active',
  DELETED: 'deleted',
} as const;

export const HRESOURCE_ITEM_TYPE = {
  WEBSITE: 'website',
  SUBDOMAIN: 'subdomain',
  PARKED: 'parked',
  ADDON: 'addon',
} as const;

export const HRESOURCE_ADDON_TYPE = {
  CLOUDFLARE: 'cloudflare',
  DAILY_BACKUP: 'daily_backup',
  DOMAIN_PRIVACY_PROTECTION: 'domain_privacy_protection',
  TITAN_MAIL: 'titan_mail',
  SSL_INSTALL: 'ssl_install',
  MAIL: 'mail',
  VPS_LICENSE: 'vps_license',
} as const;

export const HRESOURCE_ADDON_STATE = {
  PENDING_SETUP: 'pending_setup',
  ACTIVE: 'active',
  CANCELED: 'canceled',
  SUSPENDED: 'suspended',
} as const;

export type HResourceState =
  (typeof HRESOURCES_STATE)[keyof typeof HRESOURCES_STATE];

export type HResourceType =
  | (typeof HRESOURCES_TYPE)[keyof typeof HRESOURCES_TYPE];

export type HResourceItemState =
  (typeof HRESOURCE_ITEM_STATE)[keyof typeof HRESOURCE_ITEM_STATE];

export type HResourceItemType =
  (typeof HRESOURCE_ITEM_TYPE)[keyof typeof HRESOURCE_ITEM_TYPE];

export type HResourceAddonType =
  (typeof HRESOURCE_ADDON_TYPE)[keyof typeof HRESOURCE_ADDON_TYPE];

export type HResourceAddonState =
  (typeof HRESOURCE_ADDON_STATE)[keyof typeof HRESOURCE_ADDON_STATE];

export interface IHResourceConfig {
  plan?: Hosting.Plan;
  emailPlan?: string;
  domain?: string;
  username?: string;
  tlds?: string[];
  h5g?: boolean;
  tools?: {
    name: 'name';
    maxWebsiteQuantity: number;
  }[];
}

export interface IHResourceMetadata {
  country?: string;
  orderId?: string;
  expiresAt?: string;
  invoiceNr?: string;
  domain?: string;
  planCode?: string;
  planTitle?: string;
  planName?: string;
  isChargebee?: 1 | 0;
  currencyCode?: string;
  customerName?: string;
  billingPeriod?: string;
  customerEmail?: string;
  resourceVersion?: number;
}

export interface IHResourceItem {
  id: number;
  resourceId: number;
  type: HResourceItemType;
  state: HResourceItemState;
  domain: string;
  config: [] | null;
  createdAt: string;
  updatedAt: string;
  resource: IHResource;
}

export interface IHResourceAddon {
  id: number;
  resourceId: number;
  type: HResourceAddonType;
  config: [] | null;
  state: HResourceAddonState;
  createdAt: string;
  updatedAt: string;
}

export interface IHResource {
  id: number;
  customerCustomId: string;
  userId: number;
  referenceId: string | null;
  relatedResourceId: number | null;
  idempotencyKey: string | null;
  chargebeeSubscriptionId: string | null;
  type: HResourceType;
  state: HResourceState;
  reason: 'reason' | null;
  domain?: string;
  title: string | null;
  config?: IHResourceConfig;
  metadata?: IHResourceMetadata;
  subscription?: {};
  expiresAt: string | null;
  activatedAt: string | null;
  suspendedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: IHResourceItem[];
  addons: IHResourceAddon[];
  parent: IHResource | null;
  relatedServices: IHResource[];
  planName?: string;
}

export interface IProfileAccountManager {
  firstName: string;
  lastName: string | null;
  id: string;
  email: string;
}

export interface IProfileAccess {
  isStaff: boolean;
  isAccessManager: boolean;
  level: 'admin' | null;
  manager: IProfileAccountManager;
}
export namespace Email {
  export enum EmailProvider {
    HOSTINGER = 'hostinger',
  }
}

export const AI_SEARCH_DYNAMIC_TYPE = {
  HOSTING_V2: 'hostingV2',
  HOSTING_DASHBOARD: 'hostingDashboard',
  EMAIL: 'email',
  HBILLING: 'hbilling',
  VPS: 'vps',
  TITAN_EMAIL: 'titanEmail',
  DOMAIN: 'domain',
} as const;
export type AiSearchDynamicType =
  (typeof AI_SEARCH_DYNAMIC_TYPE)[keyof typeof AI_SEARCH_DYNAMIC_TYPE];
export interface IAISearchResult {
  score: number;
  pageContent: string;
  metadata: {
    breadcrumbs: string;
    subheader: string;
    path: string;
  };
}

export const BREADCRUMB_SEPARATOR = '/' as const;
export const DYNAMIC_PARAM_PREFIX = ':' as const;
export const OPTIONAL_PARAM_SUFFIX = '?' as const;

export namespace Route {
  export enum Playground {}
  export enum Profile {}
  export enum HostingerPro {}
  export enum Base {
    NOT_FOUND = 'not_found',
  }

  export enum Domain {
    DOMAIN_CHECKER = 'domain-checker',
    TRANSFER_DOMAIN = 'transfer-domain',
    REGISTER_DOMAIN_RESOURCE = 'register-domain-resource',
    MY_DOMAINS = 'my-domains',
  }

  export enum HostingWebsite {
    ERROR_PAGES_EDIT = 'website_error_pages_edit',
  }

  export enum HostingWordpress {
    MANAGE_STAGING_DASHBOARD = 'manage_wp_staging_dashboard',
    MANAGE_STAGING_SECURITY = 'manage_wp_staging_security',
  }

  export enum Billing {
    DISABLE_AUTO_RENEWAL = 'billing-disable-auto-renewal',
  }

  export enum HBilling {
    PAYMENT_HISTORY_DETAILS = 'billing-payment-history-details-cb',
    REFUND_HISTORY_DETAILS = 'billing-payment-history-refund-details-cb',
  }
}

export enum SubscriptionStatus {
  CANCELLED = 'cancelled',
}

export namespace RoutePath {}

export const FieldType = {
  text: 'text',
  textarea: 'textarea',
  password: 'password',
  number: 'number',
  date: 'date',
  select: 'select',
} as const;

export interface FieldError {
  text: string;
  params?: string[];
}

export interface FieldOption<M extends object = {}> {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  icon?: any;
  image?: {
    left?: string;
    right?: string;
  };
  appendText?: string;
  /**
   * Arbitrary data that can be attached to an option.
   * It can be used for custom rendering of a select field option.
   */
  metadata?: M;
}

export interface EmitValue {
  prepend: string;
  prefix: string;
  value: string;
  append: string;
}

export interface IFieldOnChangeEvent {
  value: string | EmitValue;
  error: FieldError;
}

export interface GroupedFieldOption {
  name: string;
  values: FieldOption[];
}
