/**
 * HeyReach API Client with Reliability Infrastructure
 *
 * Complete LinkedIn automation platform integration with 40+ endpoints
 *
 * Features:
 * - Campaign Management (get, create, pause, resume, add leads)
 * - List Management (create, get, add/delete leads, V2 endpoints)
 * - Lead Operations (details, campaign tracking)
 * - Message & Conversations (get, send, reply tracking)
 * - Sender Account Management (LinkedIn accounts, network)
 * - Statistics & Analytics (overall stats, campaign metrics)
 * - Webhook Management (create, update, delete, event handling)
 * - Circuit breaker to prevent hammering failing API
 * - Rate limiting for API quota management (300 req/min)
 * - Structured logging
 * - Automatic error handling
 *
 * Perfect for:
 * - LinkedIn outreach automation
 * - Lead generation campaigns
 * - Multi-account LinkedIn management
 * - Conversation tracking and analytics
 * - CRM integration via webhooks
 *
 * @module social/heyreach
 */

import { logger } from '@/lib/logger';
import { createCircuitBreaker } from '@/lib/resilience';
import { createRateLimiter, withRateLimit } from '@/lib/rate-limiter';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HeyReachCredentials {
  apiKey?: string;
}

// Authentication Types
export interface CheckApiKeyResponse {
  valid: boolean;
  status: string;
}

// Campaign Types
export interface Campaign {
  id: number;
  name: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  creationTime: string;
  campaignAccountIds: number[];
  sequence?: unknown[];
  senders?: unknown[];
  leadLists?: unknown[];
  statistics?: CampaignStatistics;
}

export interface CampaignStatistics {
  totalLeads: number;
  contacted: number;
  replied: number;
  connected: number;
}

export interface GetCampaignsRequest {
  offset?: number;
  limit?: number;
  apiKey?: string;
}

export interface GetCampaignsResponse {
  campaigns: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface GetCampaignByIdRequest {
  campaignId: number;
  apiKey?: string;
}

export interface GetActiveCampaignsResponse {
  campaigns: Array<{
    id: number;
    name: string;
    status: string;
    sendersCount: number;
    leadsCount: number;
  }>;
}

export interface CampaignActionRequest {
  campaignId: number;
  apiKey?: string;
}

export interface CampaignActionResponse {
  success: boolean;
  campaignId: number;
  status: string;
}

// Lead Types
export interface Lead {
  firstName?: string;
  lastName?: string;
  location?: string;
  summary?: string;
  companyName?: string;
  position?: string;
  about?: string;
  emailAddress?: string;
  profileUrl?: string;
  linkedinUrl?: string;
  email?: string;
  company?: string;
  customUserFields?: Array<{
    name: string;
    value: string;
  }>;
  customFields?: Array<{
    name: string;
    value: string;
  }>;
}

export interface AddLeadToCampaignRequest {
  campaignId: number;
  leads: Lead[];
  linkedinAccountId?: number;
  apiKey?: string;
}

export interface AddLeadToCampaignResponse {
  success: boolean;
  leadsAdded: number;
  campaignId: number;
}

export interface GetLeadsForCampaignRequest {
  campaignId: number;
  page?: number;
  limit?: number;
  apiKey?: string;
}

export interface GetLeadsForCampaignResponse {
  leads: Array<{
    id: string;
    firstName?: string;
    lastName?: string;
    linkedinUrl?: string;
    status?: string;
    currentStep?: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface StopLeadInCampaignRequest {
  campaignId: number;
  leadId: string;
  apiKey?: string;
}

export interface GetLeadDetailsRequest {
  linkedinUrl: string;
  apiKey?: string;
}

export interface GetLeadDetailsResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  linkedinUrl?: string;
  email?: string;
  company?: string;
  position?: string;
  location?: string;
  summary?: string;
  campaigns?: number[];
  tags?: string[];
  customFields?: Record<string, string>;
}

// List Types
export interface GetListsRequest {
  offset?: number;
  limit?: number;
  apiKey?: string;
}

export interface ListInfo {
  id: number;
  name: string;
  type: 'LEAD' | 'COMPANY';
  count: number;
  createdAt: string;
  campaigns?: number[];
}

export interface GetListsResponse {
  lists: ListInfo[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface GetListByIdRequest {
  listId: number;
  apiKey?: string;
}

export interface CreateEmptyListRequest {
  name: string;
  type?: 'LEAD' | 'COMPANY' | 0 | 1; // API expects 0 (USER_LIST/LEAD) or 1 (COMPANY_LIST)
  apiKey?: string;
}

export interface CreateEmptyListResponse {
  success: boolean;
  listId: number;
  name: string;
  type: string;
  id?: number; // API returns 'id' instead of 'listId'
  listType?: string; // API returns 'listType'
  count?: number;
  creationTime?: string;
}

export interface AddLeadsToListRequest {
  listId: number;
  leads: Lead[];
  apiKey?: string;
}

export interface AddLeadsToListResponse {
  success: boolean;
  leadsAdded: number;
}

export interface AddLeadsToListV2Response {
  success: boolean;
  statistics: {
    added: number;
    updated: number;
    failed: number;
  };
  details: Array<{
    profileUrl: string;
    status: 'added' | 'updated' | 'failed';
  }>;
}

export interface GetLeadsFromListRequest {
  listId: number;
  offset?: number;
  limit?: number;
  apiKey?: string;
}

export interface GetLeadsFromListResponse {
  leads: Lead[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface DeleteLeadFromListRequest {
  listId: number;
  leadId: string;
  apiKey?: string;
}

export interface GetCompaniesFromListRequest {
  listId: number;
  offset?: number;
  limit?: number;
  apiKey?: string;
}

export interface GetListsForLeadRequest {
  leadId: string;
  apiKey?: string;
}

// Message & Conversation Types
export interface GetConversationsRequest {
  offset?: number;
  limit?: number;
  filters?: {
    senderId?: number;
    campaignId?: number;
    hasReplies?: boolean;
  };
  apiKey?: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messageCount: number;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface GetConversationRequest {
  conversationId: string;
  apiKey?: string;
}

export interface Message {
  id: string;
  sender: 'you' | 'lead';
  text: string;
  timestamp: string;
}

export interface GetConversationResponse {
  id: string;
  leadId: string;
  messages: Message[];
}

export interface SendMessageRequest {
  leadId: string;
  message: string;
  templateId?: string;
  apiKey?: string;
}

// Sender Account Types
export interface GetAllSenderAccountsRequest {
  offset?: number;
  keyword?: string;
  limit?: number;
  apiKey?: string;
}

export interface SenderAccount {
  id: number;
  name: string;
  profileUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  dailyLimit: number;
  weeklyLimit: number;
  currentUsage: {
    daily: number;
    weekly: number;
  };
}

export interface GetAllSenderAccountsResponse {
  accounts: SenderAccount[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface GetSenderByIdRequest {
  senderId: number;
  apiKey?: string;
}

export interface GetMyNetworkForSenderRequest {
  senderId: number;
  offset?: number;
  limit?: number;
  apiKey?: string;
}

export interface NetworkConnection {
  name: string;
  profileUrl: string;
  position?: string;
  company?: string;
  connectedDate: string;
}

export interface GetMyNetworkForSenderResponse {
  connections: NetworkConnection[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

// Statistics Types
export interface GetOverallStatsRequest {
  accountIds?: number[];
  campaignIds?: number[];
  startDate: string;
  endDate: string;
  apiKey?: string;
}

export interface OverallStats {
  connectionRequestsSent: number;
  connectionRequestsAccepted: number;
  acceptanceRate: number;
  messagesSent: number;
  messagesReplied: number;
  replyRate: number;
  inmailsSent: number;
  inmailsReplied: number;
  inmailReplyRate: number;
  profilesViewed: number;
  postsLiked: number;
}

export interface DayStats {
  date: string;
  connectionRequestsSent: number;
  connectionRequestsAccepted: number;
  messagesSent: number;
  messagesReplied: number;
}

export interface CampaignStats {
  campaignId: number;
  campaignName: string;
  stats: {
    connectionRequestsSent: number;
    acceptanceRate: number;
  };
}

export interface GetOverallStatsResponse {
  overallStats: OverallStats;
  byDayStats: DayStats[];
  byCampaign: CampaignStats[];
}

// Webhook Types
export interface CreateWebhookRequest {
  name: string;
  url: string;
  eventType: WebhookEventType;
  campaignIds?: number[];
  active?: boolean;
  apiKey?: string;
}

export type WebhookEventType =
  | 'CAMPAIGN_COMPLETED'
  | 'CONNECTION_REQUEST_SENT'
  | 'CONNECTION_REQUEST_ACCEPTED'
  | 'MESSAGE_SENT'
  | 'MESSAGE_REPLY_RECEIVED'
  | 'INMAIL_SENT'
  | 'INMAIL_REPLY_RECEIVED'
  | 'FOLLOW_SENT'
  | 'LIKED_POST'
  | 'VIEWED_PROFILE'
  | 'LEAD_TAG_UPDATED';

export interface CreateWebhookResponse {
  success: boolean;
  webhookId: string;
  name: string;
  url: string;
}

export interface GetWebhookByIdRequest {
  webhookId: string;
  apiKey?: string;
}

export interface UpdateWebhookRequest {
  webhookId: string;
  active?: boolean;
  apiKey?: string;
}

export interface DeleteWebhookRequest {
  webhookId: string;
  apiKey?: string;
}

// ============================================================================
// CREDENTIAL DETECTION
// ============================================================================

const hasCredentials = process.env.HEYREACH_API_KEY !== undefined;

if (!hasCredentials) {
  logger.warn('⚠️  HeyReach API credentials not set. Features will not work.');
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BASE_URL = 'https://api.heyreach.io/api/public';

// ============================================================================
// RATE LIMITER CONFIGURATION
// ============================================================================

const rateLimiter = createRateLimiter({
  maxConcurrent: 10, // Max parallel requests
  minTime: 200, // Min 200ms between requests = 300/min
  reservoir: 300, // Initial token count (300 req/min limit)
  reservoirRefreshAmount: 300, // Tokens added per interval
  reservoirRefreshInterval: 60000, // Refresh every minute
  id: 'heyreach',
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Make authenticated request to HeyReach API
 */
async function makeRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    apiKey?: string;
  } = {}
): Promise<T> {
  const apiKey = options.apiKey || process.env.HEYREACH_API_KEY;

  if (!apiKey) {
    throw new Error('HeyReach API key not provided. Set HEYREACH_API_KEY or pass apiKey parameter.');
  }

  const url = `${BASE_URL}${endpoint}`;
  const method = options.method || (options.body ? 'POST' : 'GET');

  logger.info({ endpoint, method }, 'Making HeyReach API request');

  const response = await fetch(url, {
    method,
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ endpoint, status: response.status, error: errorText }, 'HeyReach API error');
    throw new Error(`HeyReach API error (${response.status}): ${errorText}`);
  }

  const result = (await response.json()) as T;
  logger.info({ endpoint }, 'HeyReach API request successful');
  return result;
}

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * Check API Key validity (internal)
 */
async function checkApiKeyInternal(options: HeyReachCredentials = {}): Promise<CheckApiKeyResponse> {
  logger.info({}, 'Checking HeyReach API key validity');

  try {
    const apiKey = options.apiKey || process.env.HEYREACH_API_KEY;
    if (!apiKey) {
      throw new Error('HeyReach API key not provided');
    }

    const response = await fetch(`${BASE_URL}/auth/CheckApiKey`, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // HeyReach API returns 200 with empty body if valid
    if (response.ok) {
      logger.info({ valid: true }, 'API key check completed');
      return { valid: true, status: 'API key is valid' };
    } else {
      logger.info({ valid: false }, 'API key check failed');
      return { valid: false, status: `API key is invalid (${response.status})` };
    }
  } catch (error) {
    logger.error({ error }, 'API key check failed');
    throw new Error(`API key check failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const checkApiKeyWithBreaker = createCircuitBreaker(checkApiKeyInternal, {
  timeout: 10000,
  name: 'heyreach.checkApiKey',
});

/**
 * Verify that your HeyReach API key is valid and working
 *
 * @param options - Optional API credentials
 * @returns API key validation status
 *
 * @example
 * const status = await checkApiKey({ apiKey: 'your_key' });
 * console.log(status.valid); // true
 */
export const checkApiKey = withRateLimit(
  (options: HeyReachCredentials = {}) => checkApiKeyWithBreaker.fire(options),
  rateLimiter
);

// ============================================================================
// CAMPAIGN ENDPOINTS
// ============================================================================

/**
 * Get all campaigns with pagination (internal)
 */
async function getCampaignsInternal(options: GetCampaignsRequest = {}): Promise<GetCampaignsResponse> {
  logger.info({ offset: options.offset, limit: options.limit }, 'Fetching campaigns');

  try {
    const result = await makeRequest<GetCampaignsResponse>('/campaign/GetCampaigns', {
      body: {
        offset: options.offset || 0,
        limit: options.limit || 50,
      },
      apiKey: options.apiKey,
    });

    logger.info({ count: result.campaigns.length, total: result.pagination.total }, 'Campaigns fetched');
    return result;
  } catch (error) {
    logger.error({ error }, 'Get campaigns failed');
    throw new Error(`Get campaigns failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getCampaignsWithBreaker = createCircuitBreaker(getCampaignsInternal, {
  timeout: 15000,
  name: 'heyreach.getCampaigns',
});

/**
 * Retrieve all campaigns with pagination
 *
 * @param options - Pagination options (offset, limit) and optional API key
 * @returns List of campaigns with pagination info
 *
 * @example
 * const campaigns = await getCampaigns({ offset: 0, limit: 50 });
 * console.log(campaigns.campaigns.length);
 */
export const getCampaigns = withRateLimit(
  (options: GetCampaignsRequest = {}) => getCampaignsWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get campaign by ID (internal)
 */
async function getCampaignByIdInternal(options: GetCampaignByIdRequest): Promise<Campaign> {
  logger.info({ campaignId: options.campaignId }, 'Fetching campaign details');

  try {
    const result = await makeRequest<Campaign>('/campaign/GetCampaignById', {
      body: { campaignId: options.campaignId },
      apiKey: options.apiKey,
    });

    logger.info({ campaignId: result.id, name: result.name }, 'Campaign details fetched');
    return result;
  } catch (error) {
    logger.error({ error, campaignId: options.campaignId }, 'Get campaign by ID failed');
    throw new Error(`Get campaign by ID failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getCampaignByIdWithBreaker = createCircuitBreaker(getCampaignByIdInternal, {
  timeout: 15000,
  name: 'heyreach.getCampaignById',
});

/**
 * Get detailed information about a specific campaign
 *
 * @param options - Campaign ID and optional API key
 * @returns Campaign details including statistics, senders, and lead lists
 *
 * @example
 * const campaign = await getCampaignById({ campaignId: 90486 });
 * console.log(campaign.name, campaign.status);
 */
export const getCampaignById = withRateLimit(
  (options: GetCampaignByIdRequest) => getCampaignByIdWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get active campaigns (internal)
 */
async function getActiveCampaignsInternal(options: HeyReachCredentials = {}): Promise<GetActiveCampaignsResponse> {
  logger.info({}, 'Fetching active campaigns');

  try {
    const result = await makeRequest<GetActiveCampaignsResponse>('/campaign/GetActiveCampaigns', {
      apiKey: options.apiKey,
    });

    logger.info({ count: result.campaigns.length }, 'Active campaigns fetched');
    return result;
  } catch (error) {
    logger.error({ error }, 'Get active campaigns failed');
    throw new Error(`Get active campaigns failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getActiveCampaignsWithBreaker = createCircuitBreaker(getActiveCampaignsInternal, {
  timeout: 15000,
  name: 'heyreach.getActiveCampaigns',
});

/**
 * Find campaigns ready for adding leads (ACTIVE status with LinkedIn senders)
 *
 * @param options - Optional API credentials
 * @returns List of active campaigns
 *
 * @example
 * const activeCampaigns = await getActiveCampaigns();
 * console.log(activeCampaigns.campaigns);
 */
export const getActiveCampaigns = withRateLimit(
  (options: HeyReachCredentials = {}) => getActiveCampaignsWithBreaker.fire(options),
  rateLimiter
);

/**
 * Resume campaign (internal)
 */
async function resumeCampaignInternal(options: CampaignActionRequest): Promise<CampaignActionResponse> {
  logger.info({ campaignId: options.campaignId }, 'Resuming campaign');

  try {
    const result = await makeRequest<CampaignActionResponse>('/campaign/ResumeCampaign', {
      body: { campaignId: options.campaignId },
      apiKey: options.apiKey,
    });

    logger.info({ campaignId: result.campaignId, status: result.status }, 'Campaign resumed');
    return result;
  } catch (error) {
    logger.error({ error, campaignId: options.campaignId }, 'Resume campaign failed');
    throw new Error(`Resume campaign failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const resumeCampaignWithBreaker = createCircuitBreaker(resumeCampaignInternal, {
  timeout: 15000,
  name: 'heyreach.resumeCampaign',
});

/**
 * Resume a paused campaign
 *
 * @param options - Campaign ID and optional API key
 * @returns Campaign status update
 *
 * @example
 * const result = await resumeCampaign({ campaignId: 90486 });
 * console.log(result.status); // "ACTIVE"
 */
export const resumeCampaign = withRateLimit(
  (options: CampaignActionRequest) => resumeCampaignWithBreaker.fire(options),
  rateLimiter
);

/**
 * Pause campaign (internal)
 */
async function pauseCampaignInternal(options: CampaignActionRequest): Promise<CampaignActionResponse> {
  logger.info({ campaignId: options.campaignId }, 'Pausing campaign');

  try {
    const result = await makeRequest<CampaignActionResponse>('/campaign/PauseCampaign', {
      body: { campaignId: options.campaignId },
      apiKey: options.apiKey,
    });

    logger.info({ campaignId: result.campaignId, status: result.status }, 'Campaign paused');
    return result;
  } catch (error) {
    logger.error({ error, campaignId: options.campaignId }, 'Pause campaign failed');
    throw new Error(`Pause campaign failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const pauseCampaignWithBreaker = createCircuitBreaker(pauseCampaignInternal, {
  timeout: 15000,
  name: 'heyreach.pauseCampaign',
});

/**
 * Pause an active campaign
 *
 * @param options - Campaign ID and optional API key
 * @returns Campaign status update
 *
 * @example
 * const result = await pauseCampaign({ campaignId: 90486 });
 * console.log(result.status); // "PAUSED"
 */
export const pauseCampaign = withRateLimit(
  (options: CampaignActionRequest) => pauseCampaignWithBreaker.fire(options),
  rateLimiter
);

/**
 * Add lead to campaign (internal)
 */
async function addLeadToCampaignInternal(options: AddLeadToCampaignRequest): Promise<AddLeadToCampaignResponse> {
  logger.info({ campaignId: options.campaignId, leadCount: options.leads.length }, 'Adding leads to campaign');

  try {
    const result = await makeRequest<AddLeadToCampaignResponse>('/campaign/AddLeadToCampaign', {
      body: {
        campaignId: options.campaignId,
        leads: options.leads,
        linkedinAccountId: options.linkedinAccountId,
      },
      apiKey: options.apiKey,
    });

    logger.info({ leadsAdded: result.leadsAdded, campaignId: result.campaignId }, 'Leads added to campaign');
    return result;
  } catch (error) {
    logger.error({ error, campaignId: options.campaignId }, 'Add lead to campaign failed');
    throw new Error(`Add lead to campaign failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const addLeadToCampaignWithBreaker = createCircuitBreaker(addLeadToCampaignInternal, {
  timeout: 30000,
  name: 'heyreach.addLeadToCampaign',
});

/**
 * Add leads to an existing ACTIVE campaign (max 100 leads per request)
 *
 * Note: Can only add leads to ACTIVE campaigns, not DRAFT
 *
 * @param options - Campaign ID, leads array, optional sender account ID and API key
 * @returns Number of leads added
 *
 * @example
 * const result = await addLeadToCampaign({
 *   campaignId: 90486,
 *   leads: [{
 *     firstName: "John",
 *     lastName: "Doe",
 *     linkedinUrl: "https://www.linkedin.com/in/john-doe",
 *     customFields: [{ name: "pain_point", value: "lead generation" }]
 *   }]
 * });
 */
export const addLeadToCampaign = withRateLimit(
  (options: AddLeadToCampaignRequest) => addLeadToCampaignWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get leads for campaign (internal)
 */
async function getLeadsForCampaignInternal(options: GetLeadsForCampaignRequest): Promise<GetLeadsForCampaignResponse> {
  logger.info({ campaignId: options.campaignId, page: options.page, limit: options.limit }, 'Fetching campaign leads');

  try {
    const result = await makeRequest<GetLeadsForCampaignResponse>('/campaign/GetLeadsForCampaign', {
      body: {
        campaignId: options.campaignId,
        page: options.page || 1,
        limit: options.limit || 50,
      },
      apiKey: options.apiKey,
    });

    logger.info({ leadCount: result.leads.length, total: result.pagination.total }, 'Campaign leads fetched');
    return result;
  } catch (error) {
    logger.error({ error, campaignId: options.campaignId }, 'Get leads for campaign failed');
    throw new Error(`Get leads for campaign failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getLeadsForCampaignWithBreaker = createCircuitBreaker(getLeadsForCampaignInternal, {
  timeout: 15000,
  name: 'heyreach.getLeadsForCampaign',
});

/**
 * Retrieve leads from a campaign with pagination
 *
 * @param options - Campaign ID, page, limit, and optional API key
 * @returns List of leads in the campaign
 *
 * @example
 * const leads = await getLeadsForCampaign({ campaignId: 90486, page: 1, limit: 50 });
 * console.log(leads.leads.length);
 */
export const getLeadsForCampaign = withRateLimit(
  (options: GetLeadsForCampaignRequest) => getLeadsForCampaignWithBreaker.fire(options),
  rateLimiter
);

/**
 * Stop lead in campaign (internal)
 */
async function stopLeadInCampaignInternal(options: StopLeadInCampaignRequest): Promise<{ success: boolean }> {
  logger.info({ campaignId: options.campaignId, leadId: options.leadId }, 'Stopping lead in campaign');

  try {
    const result = await makeRequest<{ success: boolean }>('/campaign/StopLeadInCampaign', {
      body: {
        campaignId: options.campaignId,
        leadId: options.leadId,
      },
      apiKey: options.apiKey,
    });

    logger.info({ success: result.success }, 'Lead stopped in campaign');
    return result;
  } catch (error) {
    logger.error({ error, campaignId: options.campaignId, leadId: options.leadId }, 'Stop lead in campaign failed');
    throw new Error(`Stop lead in campaign failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const stopLeadInCampaignWithBreaker = createCircuitBreaker(stopLeadInCampaignInternal, {
  timeout: 15000,
  name: 'heyreach.stopLeadInCampaign',
});

/**
 * Remove/stop a lead from a campaign
 *
 * @param options - Campaign ID, lead ID, and optional API key
 * @returns Success status
 *
 * @example
 * const result = await stopLeadInCampaign({ campaignId: 90486, leadId: "lead_123" });
 */
export const stopLeadInCampaign = withRateLimit(
  (options: StopLeadInCampaignRequest) => stopLeadInCampaignWithBreaker.fire(options),
  rateLimiter
);

// ============================================================================
// LIST ENDPOINTS
// ============================================================================

/**
 * Get all lists (internal)
 */
async function getListsInternal(options: GetListsRequest = {}): Promise<GetListsResponse> {
  logger.info({ offset: options.offset, limit: options.limit }, 'Fetching lists');

  try {
    const result = await makeRequest<GetListsResponse>('/list/GetLists', {
      body: {
        offset: options.offset || 0,
        limit: options.limit || 50,
      },
      apiKey: options.apiKey,
    });

    logger.info({ count: result.lists.length, total: result.pagination.total }, 'Lists fetched');
    return result;
  } catch (error) {
    logger.error({ error }, 'Get lists failed');
    throw new Error(`Get lists failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getListsWithBreaker = createCircuitBreaker(getListsInternal, {
  timeout: 15000,
  name: 'heyreach.getLists',
});

/**
 * Retrieve all lead and company lists
 *
 * @param options - Pagination options and optional API key
 * @returns List of lists with pagination info
 *
 * @example
 * const lists = await getLists({ offset: 0, limit: 50 });
 * console.log(lists.lists);
 */
export const getLists = withRateLimit(
  (options: GetListsRequest = {}) => getListsWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get list by ID (internal)
 */
async function getListByIdInternal(options: GetListByIdRequest): Promise<ListInfo> {
  logger.info({ listId: options.listId }, 'Fetching list details');

  try {
    const result = await makeRequest<ListInfo>('/list/GetListById', {
      body: { listId: options.listId },
      apiKey: options.apiKey,
    });

    logger.info({ listId: result.id, name: result.name }, 'List details fetched');
    return result;
  } catch (error) {
    logger.error({ error, listId: options.listId }, 'Get list by ID failed');
    throw new Error(`Get list by ID failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getListByIdWithBreaker = createCircuitBreaker(getListByIdInternal, {
  timeout: 15000,
  name: 'heyreach.getListById',
});

/**
 * Get specific list details
 *
 * @param options - List ID and optional API key
 * @returns List details including count and campaigns
 *
 * @example
 * const list = await getListById({ listId: 12345 });
 * console.log(list.name, list.count);
 */
export const getListById = withRateLimit(
  (options: GetListByIdRequest) => getListByIdWithBreaker.fire(options),
  rateLimiter
);

/**
 * Create empty list (internal)
 */
async function createEmptyListInternal(options: CreateEmptyListRequest): Promise<CreateEmptyListResponse> {
  logger.info({ name: options.name, type: options.type }, 'Creating empty list');

  try {
    // Convert string types to API integers
    let typeValue: number | undefined;
    if (options.type === 'LEAD' || options.type === 0) {
      typeValue = 0; // USER_LIST
    } else if (options.type === 'COMPANY' || options.type === 1) {
      typeValue = 1; // COMPANY_LIST
    }
    // If type is undefined, don't send it (API defaults to USER_LIST)

    const body: { name: string; type?: number } = {
      name: options.name,
    };

    if (typeValue !== undefined) {
      body.type = typeValue;
    }

    interface RawCreateEmptyListResponse {
      id: number;
      name: string;
      listType?: string;
      count?: number;
      creationTime?: string;
    }

    const rawResult = await makeRequest<RawCreateEmptyListResponse>('/list/CreateEmptyList', {
      body,
      apiKey: options.apiKey,
    });

    // API returns { id, name, listType, ... } but we normalize to our interface
    const result: CreateEmptyListResponse = {
      success: true,
      listId: rawResult.id,
      name: rawResult.name,
      type: rawResult.listType || '',
      id: rawResult.id,
      listType: rawResult.listType,
      count: rawResult.count,
      creationTime: rawResult.creationTime,
    };

    logger.info({ listId: result.listId, name: result.name }, 'Empty list created');
    return result;
  } catch (error) {
    logger.error({ error, name: options.name }, 'Create empty list failed');
    throw new Error(`Create empty list failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const createEmptyListWithBreaker = createCircuitBreaker(createEmptyListInternal, {
  timeout: 15000,
  name: 'heyreach.createEmptyList',
});

/**
 * Create a new lead or company list
 *
 * @param options - List name, type (LEAD or COMPANY), and optional API key
 * @returns Created list info with ID
 *
 * @example
 * const list = await createEmptyList({ name: "Q1 Prospects", type: "LEAD" });
 * console.log(list.listId);
 */
export const createEmptyList = withRateLimit(
  (options: CreateEmptyListRequest) => createEmptyListWithBreaker.fire(options),
  rateLimiter
);

/**
 * Add leads to list (internal)
 */
async function addLeadsToListInternal(options: AddLeadsToListRequest): Promise<AddLeadsToListResponse> {
  logger.info({ listId: options.listId, leadCount: options.leads.length }, 'Adding leads to list');

  try {
    const result = await makeRequest<AddLeadsToListResponse>('/list/AddLeadsToList', {
      body: {
        listId: options.listId,
        leads: options.leads,
      },
      apiKey: options.apiKey,
    });

    logger.info({ leadsAdded: result.leadsAdded }, 'Leads added to list');
    return result;
  } catch (error) {
    logger.error({ error, listId: options.listId }, 'Add leads to list failed');
    throw new Error(`Add leads to list failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const addLeadsToListWithBreaker = createCircuitBreaker(addLeadsToListInternal, {
  timeout: 30000,
  name: 'heyreach.addLeadsToList',
});

/**
 * Add up to 100 leads to a list
 *
 * @param options - List ID, leads array, and optional API key
 * @returns Number of leads added
 *
 * @example
 * const result = await addLeadsToList({
 *   listId: 12345,
 *   leads: [{ firstName: "Jane", lastName: "Smith", linkedinUrl: "..." }]
 * });
 */
export const addLeadsToList = withRateLimit(
  (options: AddLeadsToListRequest) => addLeadsToListWithBreaker.fire(options),
  rateLimiter
);

/**
 * Add leads to list V2 (internal)
 */
async function addLeadsToListV2Internal(options: AddLeadsToListRequest): Promise<AddLeadsToListV2Response> {
  logger.info({ listId: options.listId, leadCount: options.leads.length }, 'Adding leads to list (V2)');

  try {
    const result = await makeRequest<AddLeadsToListV2Response>('/list/AddLeadsToListV2', {
      body: {
        listId: options.listId,
        leads: options.leads,
      },
      apiKey: options.apiKey,
    });

    logger.info(
      { added: result.statistics.added, updated: result.statistics.updated, failed: result.statistics.failed },
      'Leads added to list (V2)'
    );
    return result;
  } catch (error) {
    logger.error({ error, listId: options.listId }, 'Add leads to list V2 failed');
    throw new Error(`Add leads to list V2 failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const addLeadsToListV2WithBreaker = createCircuitBreaker(addLeadsToListV2Internal, {
  timeout: 30000,
  name: 'heyreach.addLeadsToListV2',
});

/**
 * Add leads with detailed statistics on success/failure (enhanced version)
 *
 * @param options - List ID, leads array, and optional API key
 * @returns Detailed statistics (added, updated, failed counts)
 *
 * @example
 * const result = await addLeadsToListV2({
 *   listId: 12345,
 *   leads: [{ firstName: "John", lastName: "Doe", profileUrl: "..." }]
 * });
 * console.log(result.statistics); // { added: 1, updated: 0, failed: 0 }
 */
export const addLeadsToListV2 = withRateLimit(
  (options: AddLeadsToListRequest) => addLeadsToListV2WithBreaker.fire(options),
  rateLimiter
);

/**
 * Get leads from list (internal)
 */
async function getLeadsFromListInternal(options: GetLeadsFromListRequest): Promise<GetLeadsFromListResponse> {
  logger.info({ listId: options.listId, offset: options.offset, limit: options.limit }, 'Fetching leads from list');

  try {
    const result = await makeRequest<GetLeadsFromListResponse>('/list/GetLeadsFromList', {
      body: {
        listId: options.listId,
        offset: options.offset || 0,
        limit: options.limit || 50,
      },
      apiKey: options.apiKey,
    });

    logger.info({ leadCount: result.leads.length, total: result.pagination.total }, 'Leads from list fetched');
    return result;
  } catch (error) {
    logger.error({ error, listId: options.listId }, 'Get leads from list failed');
    throw new Error(`Get leads from list failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getLeadsFromListWithBreaker = createCircuitBreaker(getLeadsFromListInternal, {
  timeout: 15000,
  name: 'heyreach.getLeadsFromList',
});

/**
 * Get paginated leads from a specific list
 *
 * @param options - List ID, pagination options, and optional API key
 * @returns List of leads with pagination
 *
 * @example
 * const leads = await getLeadsFromList({ listId: 12345, offset: 0, limit: 50 });
 */
export const getLeadsFromList = withRateLimit(
  (options: GetLeadsFromListRequest) => getLeadsFromListWithBreaker.fire(options),
  rateLimiter
);

/**
 * Delete lead from list (internal)
 */
async function deleteLeadFromListInternal(options: DeleteLeadFromListRequest): Promise<{ success: boolean }> {
  logger.info({ listId: options.listId, leadId: options.leadId }, 'Deleting lead from list');

  try {
    const result = await makeRequest<{ success: boolean }>('/list/DeleteLeadFromList', {
      body: {
        listId: options.listId,
        leadId: options.leadId,
      },
      apiKey: options.apiKey,
    });

    logger.info({ success: result.success }, 'Lead deleted from list');
    return result;
  } catch (error) {
    logger.error({ error, listId: options.listId, leadId: options.leadId }, 'Delete lead from list failed');
    throw new Error(`Delete lead from list failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const deleteLeadFromListWithBreaker = createCircuitBreaker(deleteLeadFromListInternal, {
  timeout: 15000,
  name: 'heyreach.deleteLeadFromList',
});

/**
 * Remove a lead from a list
 *
 * @param options - List ID, lead ID, and optional API key
 * @returns Success status
 *
 * @example
 * await deleteLeadFromList({ listId: 12345, leadId: "lead_123" });
 */
export const deleteLeadFromList = withRateLimit(
  (options: DeleteLeadFromListRequest) => deleteLeadFromListWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get companies from list (internal)
 */
async function getCompaniesFromListInternal(options: GetCompaniesFromListRequest): Promise<unknown> {
  logger.info({ listId: options.listId, offset: options.offset, limit: options.limit }, 'Fetching companies from list');

  try {
    const result = await makeRequest<unknown>('/list/GetCompaniesFromList', {
      body: {
        listId: options.listId,
        offset: options.offset || 0,
        limit: options.limit || 50,
      },
      apiKey: options.apiKey,
    });

    logger.info({}, 'Companies from list fetched');
    return result;
  } catch (error) {
    logger.error({ error, listId: options.listId }, 'Get companies from list failed');
    throw new Error(`Get companies from list failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getCompaniesFromListWithBreaker = createCircuitBreaker(getCompaniesFromListInternal, {
  timeout: 15000,
  name: 'heyreach.getCompaniesFromList',
});

/**
 * Get companies from a company list
 *
 * @param options - List ID, pagination options, and optional API key
 * @returns List of companies
 *
 * @example
 * const companies = await getCompaniesFromList({ listId: 12346, offset: 0, limit: 50 });
 */
export const getCompaniesFromList = withRateLimit(
  (options: GetCompaniesFromListRequest) => getCompaniesFromListWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get lists for lead (internal)
 */
async function getListsForLeadInternal(options: GetListsForLeadRequest): Promise<unknown> {
  logger.info({ leadId: options.leadId }, 'Fetching lists for lead');

  try {
    const result = await makeRequest<unknown>('/list/GetListsForLead', {
      body: { leadId: options.leadId },
      apiKey: options.apiKey,
    });

    logger.info({}, 'Lists for lead fetched');
    return result;
  } catch (error) {
    logger.error({ error, leadId: options.leadId }, 'Get lists for lead failed');
    throw new Error(`Get lists for lead failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getListsForLeadWithBreaker = createCircuitBreaker(getListsForLeadInternal, {
  timeout: 15000,
  name: 'heyreach.getListsForLead',
});

/**
 * Get all lists containing a specific lead
 *
 * @param options - Lead ID and optional API key
 * @returns Lists containing this lead
 *
 * @example
 * const lists = await getListsForLead({ leadId: "lead_123" });
 */
export const getListsForLead = withRateLimit(
  (options: GetListsForLeadRequest) => getListsForLeadWithBreaker.fire(options),
  rateLimiter
);

// ============================================================================
// LEAD ENDPOINTS
// ============================================================================

/**
 * Get lead details (internal)
 */
async function getLeadDetailsInternal(options: GetLeadDetailsRequest): Promise<GetLeadDetailsResponse> {
  logger.info({ linkedinUrl: options.linkedinUrl }, 'Fetching lead details');

  try {
    const result = await makeRequest<GetLeadDetailsResponse>('/lead/GetLeadDetails', {
      body: { linkedinUrl: options.linkedinUrl },
      apiKey: options.apiKey,
    });

    logger.info({ leadId: result.id }, 'Lead details fetched');
    return result;
  } catch (error) {
    logger.error({ error, linkedinUrl: options.linkedinUrl }, 'Get lead details failed');
    throw new Error(`Get lead details failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getLeadDetailsWithBreaker = createCircuitBreaker(getLeadDetailsInternal, {
  timeout: 15000,
  name: 'heyreach.getLeadDetails',
});

/**
 * Get detailed lead profile information
 *
 * @param options - LinkedIn URL and optional API key
 * @returns Lead profile with campaigns, tags, and custom fields
 *
 * @example
 * const lead = await getLeadDetails({ linkedinUrl: "https://www.linkedin.com/in/john-doe" });
 * console.log(lead.email, lead.company);
 */
export const getLeadDetails = withRateLimit(
  (options: GetLeadDetailsRequest) => getLeadDetailsWithBreaker.fire(options),
  rateLimiter
);

// ============================================================================
// MESSAGE & CONVERSATION ENDPOINTS
// ============================================================================

/**
 * Get conversations (internal)
 */
async function getConversationsInternal(options: GetConversationsRequest = {}): Promise<GetConversationsResponse> {
  logger.info({ offset: options.offset, limit: options.limit }, 'Fetching conversations');

  try {
    const result = await makeRequest<GetConversationsResponse>('/message/GetConversations', {
      body: {
        offset: options.offset || 0,
        limit: options.limit || 50,
        filters: options.filters || {},
      },
      apiKey: options.apiKey,
    });

    logger.info({ count: result.conversations.length, total: result.pagination.total }, 'Conversations fetched');
    return result;
  } catch (error) {
    logger.error({ error }, 'Get conversations failed');
    throw new Error(`Get conversations failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getConversationsWithBreaker = createCircuitBreaker(getConversationsInternal, {
  timeout: 15000,
  name: 'heyreach.getConversations',
});

/**
 * Retrieve LinkedIn conversations with advanced filtering
 *
 * @param options - Pagination, filters (senderId, campaignId, hasReplies), and optional API key
 * @returns List of conversations
 *
 * @example
 * const conversations = await getConversations({
 *   filters: { campaignId: 90486, hasReplies: true },
 *   limit: 50
 * });
 */
export const getConversations = withRateLimit(
  (options: GetConversationsRequest = {}) => getConversationsWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get conversation (internal)
 */
async function getConversationInternal(options: GetConversationRequest): Promise<GetConversationResponse> {
  logger.info({ conversationId: options.conversationId }, 'Fetching conversation');

  try {
    const result = await makeRequest<GetConversationResponse>('/message/GetConversation', {
      body: { conversationId: options.conversationId },
      apiKey: options.apiKey,
    });

    logger.info({ messageCount: result.messages.length }, 'Conversation fetched');
    return result;
  } catch (error) {
    logger.error({ error, conversationId: options.conversationId }, 'Get conversation failed');
    throw new Error(`Get conversation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getConversationWithBreaker = createCircuitBreaker(getConversationInternal, {
  timeout: 15000,
  name: 'heyreach.getConversation',
});

/**
 * Get a specific conversation with all messages
 *
 * @param options - Conversation ID and optional API key
 * @returns Full conversation with all messages
 *
 * @example
 * const conversation = await getConversation({ conversationId: "conv_456" });
 * console.log(conversation.messages);
 */
export const getConversation = withRateLimit(
  (options: GetConversationRequest) => getConversationWithBreaker.fire(options),
  rateLimiter
);

/**
 * Send message (internal)
 */
async function sendMessageInternal(options: SendMessageRequest): Promise<{ success: boolean }> {
  logger.info({ leadId: options.leadId }, 'Sending message');

  try {
    const result = await makeRequest<{ success: boolean }>('/message/SendMessage', {
      body: {
        leadId: options.leadId,
        message: options.message,
        templateId: options.templateId,
      },
      apiKey: options.apiKey,
    });

    logger.info({ success: result.success }, 'Message sent');
    return result;
  } catch (error) {
    logger.error({ error, leadId: options.leadId }, 'Send message failed');
    throw new Error(`Send message failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const sendMessageWithBreaker = createCircuitBreaker(sendMessageInternal, {
  timeout: 15000,
  name: 'heyreach.sendMessage',
});

/**
 * Send a direct message to a lead
 *
 * @param options - Lead ID, message text, optional template ID, and API key
 * @returns Success status
 *
 * @example
 * await sendMessage({
 *   leadId: "lead_123",
 *   message: "Hi John, following up on our conversation..."
 * });
 */
export const sendMessage = withRateLimit(
  (options: SendMessageRequest) => sendMessageWithBreaker.fire(options),
  rateLimiter
);

// ============================================================================
// SENDER ACCOUNT ENDPOINTS
// ============================================================================

/**
 * Get all sender accounts (internal)
 */
async function getAllSenderAccountsInternal(
  options: GetAllSenderAccountsRequest = {}
): Promise<GetAllSenderAccountsResponse> {
  logger.info({ offset: options.offset, keyword: options.keyword, limit: options.limit }, 'Fetching sender accounts');

  try {
    const rawResult = await makeRequest<{ totalCount: number; items: SenderAccount[] }>('/li_account/GetAll', {
      body: {
        offset: options.offset || 0,
        keyword: options.keyword || '',
        limit: options.limit || 10,
      },
      apiKey: options.apiKey,
    });

    // Transform the response to match our interface
    const result: GetAllSenderAccountsResponse = {
      accounts: rawResult.items || [],
      pagination: {
        offset: options.offset || 0,
        limit: options.limit || 10,
        total: rawResult.totalCount || 0,
      },
    };

    logger.info({ count: result.accounts.length, total: result.pagination.total }, 'Sender accounts fetched');
    return result;
  } catch (error) {
    logger.error({ error }, 'Get all sender accounts failed');
    throw new Error(`Get all sender accounts failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getAllSenderAccountsWithBreaker = createCircuitBreaker(getAllSenderAccountsInternal, {
  timeout: 15000,
  name: 'heyreach.getAllSenderAccounts',
});

/**
 * Get all LinkedIn sender accounts
 *
 * @param options - Pagination, keyword search, and optional API key
 * @returns List of sender accounts with usage stats
 *
 * @example
 * const accounts = await getAllSenderAccounts({ keyword: "john", limit: 10 });
 */
export const getAllSenderAccounts = withRateLimit(
  (options: GetAllSenderAccountsRequest = {}) => getAllSenderAccountsWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get sender by ID (internal)
 */
async function getSenderByIdInternal(options: GetSenderByIdRequest): Promise<SenderAccount> {
  logger.info({ senderId: options.senderId }, 'Fetching sender account');

  try {
    const result = await makeRequest<SenderAccount>('/li_account/GetSenderById', {
      body: { senderId: options.senderId },
      apiKey: options.apiKey,
    });

    logger.info({ senderId: result.id, name: result.name }, 'Sender account fetched');
    return result;
  } catch (error) {
    logger.error({ error, senderId: options.senderId }, 'Get sender by ID failed');
    throw new Error(`Get sender by ID failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getSenderByIdWithBreaker = createCircuitBreaker(getSenderByIdInternal, {
  timeout: 15000,
  name: 'heyreach.getSenderById',
});

/**
 * Get specific sender account details
 *
 * @param options - Sender ID and optional API key
 * @returns Sender account details
 *
 * @example
 * const sender = await getSenderById({ senderId: 123 });
 */
export const getSenderById = withRateLimit(
  (options: GetSenderByIdRequest) => getSenderByIdWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get my network for sender (internal)
 */
async function getMyNetworkForSenderInternal(
  options: GetMyNetworkForSenderRequest
): Promise<GetMyNetworkForSenderResponse> {
  logger.info({ senderId: options.senderId, offset: options.offset, limit: options.limit }, 'Fetching sender network');

  try {
    const result = await makeRequest<GetMyNetworkForSenderResponse>('/li_account/GetMyNetworkForSender', {
      body: {
        senderId: options.senderId,
        offset: options.offset || 0,
        limit: options.limit || 50,
      },
      apiKey: options.apiKey,
    });

    logger.info({ connectionCount: result.connections.length, total: result.pagination.total }, 'Sender network fetched');
    return result;
  } catch (error) {
    logger.error({ error, senderId: options.senderId }, 'Get my network for sender failed');
    throw new Error(`Get my network for sender failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getMyNetworkForSenderWithBreaker = createCircuitBreaker(getMyNetworkForSenderInternal, {
  timeout: 15000,
  name: 'heyreach.getMyNetworkForSender',
});

/**
 * Get network profiles/connections for a LinkedIn account
 *
 * @param options - Sender ID, pagination options, and optional API key
 * @returns List of connections
 *
 * @example
 * const network = await getMyNetworkForSender({ senderId: 123, offset: 0, limit: 50 });
 */
export const getMyNetworkForSender = withRateLimit(
  (options: GetMyNetworkForSenderRequest) => getMyNetworkForSenderWithBreaker.fire(options),
  rateLimiter
);

// ============================================================================
// STATISTICS & ANALYTICS ENDPOINTS
// ============================================================================

/**
 * Get overall stats (internal)
 */
async function getOverallStatsInternal(options: GetOverallStatsRequest): Promise<GetOverallStatsResponse> {
  logger.info(
    { accountIds: options.accountIds, campaignIds: options.campaignIds, startDate: options.startDate },
    'Fetching overall stats'
  );

  try {
    const result = await makeRequest<GetOverallStatsResponse>('/stats/GetOverallStats', {
      body: {
        accountIds: options.accountIds || [],
        campaignIds: options.campaignIds || [],
        startDate: options.startDate,
        endDate: options.endDate,
      },
      apiKey: options.apiKey,
    });

    logger.info({ acceptanceRate: result.overallStats.acceptanceRate, replyRate: result.overallStats.replyRate }, 'Overall stats fetched');
    return result;
  } catch (error) {
    logger.error({ error }, 'Get overall stats failed');
    throw new Error(`Get overall stats failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getOverallStatsWithBreaker = createCircuitBreaker(getOverallStatsInternal, {
  timeout: 15000,
  name: 'heyreach.getOverallStats',
});

/**
 * Get comprehensive analytics and statistics
 *
 * @param options - Account IDs, campaign IDs, date range, and optional API key
 * @returns Overall stats, daily breakdown, and campaign-specific metrics
 *
 * @example
 * const stats = await getOverallStats({
 *   campaignIds: [90486],
 *   startDate: "2025-01-01T00:00:00Z",
 *   endDate: "2025-01-31T23:59:59Z"
 * });
 * console.log(stats.overallStats.acceptanceRate, stats.overallStats.replyRate);
 */
export const getOverallStats = withRateLimit(
  (options: GetOverallStatsRequest) => getOverallStatsWithBreaker.fire(options),
  rateLimiter
);

// ============================================================================
// WEBHOOK ENDPOINTS
// ============================================================================

/**
 * Create webhook (internal)
 */
async function createWebhookInternal(options: CreateWebhookRequest): Promise<CreateWebhookResponse> {
  logger.info({ name: options.name, eventType: options.eventType, url: options.url }, 'Creating webhook');

  try {
    const result = await makeRequest<CreateWebhookResponse>('/webhook/Create', {
      body: {
        name: options.name,
        url: options.url,
        eventType: options.eventType,
        campaignIds: options.campaignIds,
        active: options.active !== undefined ? options.active : true,
      },
      apiKey: options.apiKey,
    });

    logger.info({ webhookId: result.webhookId, name: result.name }, 'Webhook created');
    return result;
  } catch (error) {
    logger.error({ error, name: options.name }, 'Create webhook failed');
    throw new Error(`Create webhook failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const createWebhookWithBreaker = createCircuitBreaker(createWebhookInternal, {
  timeout: 15000,
  name: 'heyreach.createWebhook',
});

/**
 * Set up event-based callbacks
 *
 * @param options - Webhook name, URL, event type, campaign IDs, and optional API key
 * @returns Created webhook info
 *
 * @example
 * const webhook = await createWebhook({
 *   name: "Lead Reply Webhook",
 *   url: "https://your-server.com/webhooks/heyreach",
 *   eventType: "MESSAGE_REPLY_RECEIVED",
 *   campaignIds: [90486]
 * });
 */
export const createWebhook = withRateLimit(
  (options: CreateWebhookRequest) => createWebhookWithBreaker.fire(options),
  rateLimiter
);

/**
 * Get webhook by ID (internal)
 */
async function getWebhookByIdInternal(options: GetWebhookByIdRequest): Promise<unknown> {
  logger.info({ webhookId: options.webhookId }, 'Fetching webhook');

  try {
    const result = await makeRequest<unknown>('/webhook/GetById', {
      body: { webhookId: options.webhookId },
      apiKey: options.apiKey,
    });

    logger.info({}, 'Webhook fetched');
    return result;
  } catch (error) {
    logger.error({ error, webhookId: options.webhookId }, 'Get webhook by ID failed');
    throw new Error(`Get webhook by ID failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const getWebhookByIdWithBreaker = createCircuitBreaker(getWebhookByIdInternal, {
  timeout: 15000,
  name: 'heyreach.getWebhookById',
});

/**
 * Get webhook details by ID
 *
 * @param options - Webhook ID and optional API key
 * @returns Webhook details
 *
 * @example
 * const webhook = await getWebhookById({ webhookId: "webhook_789" });
 */
export const getWebhookById = withRateLimit(
  (options: GetWebhookByIdRequest) => getWebhookByIdWithBreaker.fire(options),
  rateLimiter
);

/**
 * Update webhook (internal)
 */
async function updateWebhookInternal(options: UpdateWebhookRequest): Promise<{ success: boolean }> {
  logger.info({ webhookId: options.webhookId, active: options.active }, 'Updating webhook');

  try {
    const result = await makeRequest<{ success: boolean }>('/webhook/Update', {
      body: {
        webhookId: options.webhookId,
        active: options.active,
      },
      apiKey: options.apiKey,
    });

    logger.info({ success: result.success }, 'Webhook updated');
    return result;
  } catch (error) {
    logger.error({ error, webhookId: options.webhookId }, 'Update webhook failed');
    throw new Error(`Update webhook failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const updateWebhookWithBreaker = createCircuitBreaker(updateWebhookInternal, {
  timeout: 15000,
  name: 'heyreach.updateWebhook',
});

/**
 * Update webhook settings (enable/disable)
 *
 * @param options - Webhook ID, active status, and optional API key
 * @returns Success status
 *
 * @example
 * await updateWebhook({ webhookId: "webhook_789", active: false });
 */
export const updateWebhook = withRateLimit(
  (options: UpdateWebhookRequest) => updateWebhookWithBreaker.fire(options),
  rateLimiter
);

/**
 * Delete webhook (internal)
 */
async function deleteWebhookInternal(options: DeleteWebhookRequest): Promise<{ success: boolean }> {
  logger.info({ webhookId: options.webhookId }, 'Deleting webhook');

  try {
    const result = await makeRequest<{ success: boolean }>('/webhook/Delete', {
      body: { webhookId: options.webhookId },
      apiKey: options.apiKey,
    });

    logger.info({ success: result.success }, 'Webhook deleted');
    return result;
  } catch (error) {
    logger.error({ error, webhookId: options.webhookId }, 'Delete webhook failed');
    throw new Error(`Delete webhook failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const deleteWebhookWithBreaker = createCircuitBreaker(deleteWebhookInternal, {
  timeout: 15000,
  name: 'heyreach.deleteWebhook',
});

/**
 * Delete a webhook
 *
 * @param options - Webhook ID and optional API key
 * @returns Success status
 *
 * @example
 * await deleteWebhook({ webhookId: "webhook_789" });
 */
export const deleteWebhook = withRateLimit(
  (options: DeleteWebhookRequest) => deleteWebhookWithBreaker.fire(options),
  rateLimiter
);
