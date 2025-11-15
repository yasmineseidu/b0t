/**
 * Instantly.ai API Client with Reliability Infrastructure
 *
 * Instantly.ai is a cold email outreach platform for B2B sales and marketing.
 * This module provides campaign management, lead management, email management (Unibox), and analytics.
 *
 * Features:
 * - Circuit breaker to prevent hammering failing API
 * - Rate limiting for API quota management
 * - Structured logging
 * - Automatic error handling
 *
 * Supported Operations:
 * - Campaigns: Create, list, get, update, delete, activate, pause, search by contact (8 endpoints)
 * - Leads: Add, get, update, delete, list, merge, update interest status, remove from subsequence (8 endpoints)
 * - Emails (Unibox): Reply, forward, list, get, update, delete, get unread count, mark thread as read (8 endpoints)
 *
 * API Documentation: https://developer.instantly.ai/
 *
 * @module communication/instantly
 */

import { logger } from '@/lib/logger';
import { createCircuitBreaker } from '@/lib/resilience';
import { createRateLimiter, withRateLimit } from '@/lib/rate-limiter';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface InstantlyCredentials {
  apiKey: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CreateCampaignOptions {
  apiKey: string;
  name: string;
  from_email?: string;
  schedule?: {
    days?: string[];
    start_hour?: number;
    end_hour?: number;
    timezone?: string;
  };
  [key: string]: unknown;
}

export interface ListCampaignsOptions {
  apiKey: string;
  limit?: number;
  offset?: number;
}

export interface GetCampaignOptions {
  apiKey: string;
  campaignId: string;
}

export interface UpdateCampaignOptions {
  apiKey: string;
  campaignId: string;
  name?: string;
  [key: string]: unknown;
}

export interface DeleteCampaignOptions {
  apiKey: string;
  campaignId: string;
}

export interface CampaignActionOptions {
  apiKey: string;
  campaignId: string;
}

export interface SearchCampaignByContactOptions {
  apiKey: string;
  email: string;
}

// Lead Types
export interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  [key: string]: unknown;
}

export interface AddLeadOptions {
  apiKey: string;
  campaignId: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  [key: string]: unknown;
}

export interface GetLeadOptions {
  apiKey: string;
  leadId: string; // UUID of the lead
}

export interface UpdateLeadOptions {
  apiKey: string;
  leadId: string; // UUID of the lead
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  [key: string]: unknown;
}

export interface DeleteLeadOptions {
  apiKey: string;
  leadId: string; // UUID of the lead
}

export interface ListLeadsOptions {
  apiKey: string;
  campaignId?: string; // Optional: filter by campaign
  limit?: number;
  skip?: number; // offset parameter
}

export interface MergeLeadsOptions {
  apiKey: string;
  leadId: string; // Source lead ID to merge from
  destinationLeadId: string; // Destination lead ID to merge into
}

export interface UpdateLeadInterestStatusOptions {
  apiKey: string;
  leadId: string;
  status: 'interested' | 'not_interested' | 'maybe';
}

export interface RemoveLeadFromSubsequenceOptions {
  apiKey: string;
  leadId: string;
  campaignId: string;
}

// Email Types (Unibox)
export interface Email {
  id: string;
  thread_id?: string;
  message_id?: string;
  from_address_email?: string;
  to_address_email_list?: string;
  subject: string;
  body: {
    html?: string;
    text?: string;
  };
  is_unread: number; // 0 = read, 1 = unread
  is_focused?: number; // 0 = not focused, 1 = focused
  timestamp_created?: string;
  timestamp_email?: string;
  eaccount?: string;
  campaign_id?: string;
  lead?: string;
  [key: string]: unknown;
}

export interface ReplyEmailOptions {
  apiKey: string;
  emailId: string;
  eaccount: string; // Email account to send from (e.g., 'yasmineseidu@gmail.com')
  subject: string; // Email subject line
  body: {
    html?: string; // HTML body content
    text?: string; // Plain text body content
  };
}

export interface ForwardEmailOptions {
  apiKey: string;
  emailId: string;
  eaccount: string; // Email account to send from (e.g., 'yasmineseidu@gmail.com')
  to_address_email_list: string[]; // List of recipient email addresses
  subject: string; // Email subject line
  body: {
    html?: string; // HTML body content
    text?: string; // Plain text body content
  };
  message?: string;
}

export interface ListEmailsOptions {
  apiKey: string;
  limit?: number;
  offset?: number;
  is_read?: boolean;
}

export interface GetEmailOptions {
  apiKey: string;
  emailId: string;
}

export interface UpdateEmailOptions {
  apiKey: string;
  emailId: string;
  is_unread?: number; // 0 = read, 1 = unread
  is_focused?: number; // 0 = not focused, 1 = focused
  [key: string]: unknown;
}

export interface DeleteEmailOptions {
  apiKey: string;
  emailId: string;
}

export interface GetUnreadCountOptions {
  apiKey: string;
}

export interface MarkThreadAsReadOptions {
  apiKey: string;
  threadId: string;
}

// Response Types
export interface InstantlyResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ============================================================================
// CREDENTIAL DETECTION
// ============================================================================

const hasCredentials = process.env.INSTANTLY_API_KEY !== undefined;

if (!hasCredentials) {
  logger.warn('⚠️  Instantly.ai API credentials not set. Features will not work.');
}

// ============================================================================
// CONSTANTS
// ============================================================================

const INSTANTLY_API_BASE = 'https://api.instantly.ai/api/v2';

// ============================================================================
// RATE LIMITER CONFIGURATION
// ============================================================================

const rateLimiter = createRateLimiter({
  maxConcurrent: 5,                // Max parallel requests
  minTime: 200,                    // Min 200ms between requests
  reservoir: 100,                  // Initial token count
  reservoirRefreshAmount: 100,     // Tokens added per interval
  reservoirRefreshInterval: 60000, // Refresh every minute
  id: 'instantly',
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Make authenticated request to Instantly.ai API
 */
async function instantlyRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  apiKey: string,
  body?: Record<string, unknown>
): Promise<InstantlyResponse<T>> {
  const url = `${INSTANTLY_API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  // Send body for POST and PATCH (DELETE should not have a body or Content-Type)
  if (method === 'POST' || method === 'PATCH') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body || {});
  }

  logger.info({ method, endpoint }, 'Making Instantly.ai API request');

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    logger.error(
      { status: response.status, error: errorText, endpoint },
      'Instantly.ai API request failed'
    );
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  logger.info({ endpoint }, 'Instantly.ai API request successful');

  return data as InstantlyResponse<T>;
}

// ============================================================================
// CAMPAIGN FUNCTIONS (INTERNAL)
// ============================================================================

/**
 * Internal implementation of createCampaign
 */
async function createCampaignInternal(
  options: CreateCampaignOptions
): Promise<InstantlyResponse<Campaign>> {
  const { apiKey, ...campaignData } = options;

  logger.info({ name: campaignData.name }, 'Creating Instantly.ai campaign');

  const response = await instantlyRequest<Campaign>(
    '/campaigns',
    'POST',
    apiKey,
    campaignData
  );

  logger.info({ campaignId: response.data?.id }, 'Campaign created');
  return response;
}

/**
 * Internal implementation of listCampaigns
 */
async function listCampaignsInternal(
  options: ListCampaignsOptions
): Promise<InstantlyResponse<Campaign[]>> {
  const { apiKey, limit, offset } = options;

  logger.info({ limit, offset }, 'Listing Instantly.ai campaigns');

  let endpoint = '/campaigns';
  const params = [];
  if (limit) params.push(`limit=${limit}`);
  if (offset) params.push(`offset=${offset}`);
  if (params.length > 0) endpoint += `?${params.join('&')}`;

  const response = await instantlyRequest<Campaign[]>(endpoint, 'GET', apiKey);

  logger.info(
    { count: Array.isArray(response.data) ? response.data.length : 0 },
    'Campaigns listed'
  );
  return response;
}

/**
 * Internal implementation of getCampaign
 */
async function getCampaignInternal(
  options: GetCampaignOptions
): Promise<InstantlyResponse<Campaign>> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Getting Instantly.ai campaign');

  const response = await instantlyRequest<Campaign>(
    `/campaigns/${campaignId}`,
    'GET',
    apiKey
  );

  logger.info({ campaignId }, 'Campaign retrieved');
  return response;
}

/**
 * Internal implementation of updateCampaign
 */
async function updateCampaignInternal(
  options: UpdateCampaignOptions
): Promise<InstantlyResponse<Campaign>> {
  const { apiKey, campaignId, ...updateData } = options;

  logger.info({ campaignId }, 'Updating Instantly.ai campaign');

  const response = await instantlyRequest<Campaign>(
    `/campaigns/${campaignId}`,
    'PATCH',
    apiKey,
    updateData
  );

  logger.info({ campaignId }, 'Campaign updated');
  return response;
}

/**
 * Internal implementation of deleteCampaign
 */
async function deleteCampaignInternal(
  options: DeleteCampaignOptions
): Promise<InstantlyResponse> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Deleting Instantly.ai campaign');

  const response = await instantlyRequest(
    `/campaigns/${campaignId}`,
    'DELETE',
    apiKey
  );

  logger.info({ campaignId }, 'Campaign deleted');
  return response;
}

/**
 * Internal implementation of activateCampaign
 */
async function activateCampaignInternal(
  options: CampaignActionOptions
): Promise<InstantlyResponse<Campaign>> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Activating Instantly.ai campaign');

  const response = await instantlyRequest<Campaign>(
    `/campaigns/${campaignId}/activate`,
    'POST',
    apiKey
  );

  logger.info({ campaignId }, 'Campaign activated');
  return response;
}

/**
 * Internal implementation of pauseCampaign
 */
async function pauseCampaignInternal(
  options: CampaignActionOptions
): Promise<InstantlyResponse<Campaign>> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Pausing Instantly.ai campaign');

  const response = await instantlyRequest<Campaign>(
    `/campaigns/${campaignId}/pause`,
    'POST',
    apiKey
  );

  logger.info({ campaignId }, 'Campaign paused');
  return response;
}

/**
 * Internal implementation of searchCampaignByContact
 */
async function searchCampaignByContactInternal(
  options: SearchCampaignByContactOptions
): Promise<InstantlyResponse<Campaign[]>> {
  const { apiKey, email } = options;

  logger.info({ email }, 'Searching campaigns by contact');

  const response = await instantlyRequest<Campaign[]>(
    `/campaigns/search-by-contact?email=${encodeURIComponent(email)}`,
    'GET',
    apiKey
  );

  logger.info({ email }, 'Campaign search completed');
  return response;
}

// ============================================================================
// LEAD FUNCTIONS (INTERNAL)
// ============================================================================

/**
 * Internal implementation of addLead
 */
async function addLeadInternal(
  options: AddLeadOptions
): Promise<InstantlyResponse<Lead>> {
  const { apiKey, campaignId, ...leadData } = options;

  logger.info({ campaignId, email: leadData.email }, 'Adding lead to campaign');

  // Add campaign_id to the lead data
  const requestData = {
    ...leadData,
    campaign_id: campaignId,
  };

  const response = await instantlyRequest<Lead>(
    `/leads`,
    'POST',
    apiKey,
    requestData
  );

  logger.info({ campaignId, email: leadData.email }, 'Lead added');
  return response;
}

/**
 * Internal implementation of deleteLead
 */
async function deleteLeadInternal(
  options: DeleteLeadOptions
): Promise<InstantlyResponse> {
  const { apiKey, leadId } = options;

  logger.info({ leadId }, 'Deleting lead');

  const response = await instantlyRequest(
    `/leads/${leadId}`,
    'DELETE',
    apiKey
  );

  logger.info({ leadId }, 'Lead deleted');
  return response;
}

/**
 * Internal implementation of getLead
 */
async function getLeadInternal(
  options: GetLeadOptions
): Promise<InstantlyResponse<Lead>> {
  const { apiKey, leadId } = options;

  logger.info({ leadId }, 'Getting lead details');

  const response = await instantlyRequest<Lead>(
    `/leads/${leadId}`,
    'GET',
    apiKey
  );

  logger.info({ leadId }, 'Lead retrieved');
  return response;
}

/**
 * Internal implementation of updateLead
 */
async function updateLeadInternal(
  options: UpdateLeadOptions
): Promise<InstantlyResponse<Lead>> {
  const { apiKey, leadId, ...updateData } = options;

  logger.info({ leadId }, 'Updating lead');

  const response = await instantlyRequest<Lead>(
    `/leads/${leadId}`,
    'PATCH',
    apiKey,
    updateData
  );

  logger.info({ leadId }, 'Lead updated');
  return response;
}

/**
 * Internal implementation of listLeads
 */
async function listLeadsInternal(
  options: ListLeadsOptions
): Promise<InstantlyResponse<Lead[]>> {
  const { apiKey, campaignId, limit, skip } = options;

  logger.info({ campaignId, limit, skip }, 'Listing leads');

  // Instantly.ai uses POST /api/v2/leads/list with body
  const body: Record<string, unknown> = {};
  if (campaignId) body.campaign_id = campaignId;
  if (limit) body.limit = limit;
  if (skip) body.skip = skip;

  const response = await instantlyRequest<Lead[]>(
    `/leads/list`,
    'POST',
    apiKey,
    body
  );

  logger.info(
    { count: Array.isArray(response.data) ? response.data.length : 0 },
    'Leads listed'
  );
  return response;
}

/**
 * Internal implementation of mergeLeads
 */
async function mergeLeadsInternal(
  options: MergeLeadsOptions
): Promise<InstantlyResponse> {
  const { apiKey, leadId, destinationLeadId } = options;

  logger.info({ leadId, destinationLeadId }, 'Merging leads');

  const response = await instantlyRequest(
    `/leads/merge`,
    'POST',
    apiKey,
    {
      lead_id: leadId,
      destination_lead_id: destinationLeadId,
    }
  );

  logger.info({ leadId, destinationLeadId }, 'Leads merged');
  return response;
}

/**
 * Internal implementation of updateLeadInterestStatus
 */
async function updateLeadInterestStatusInternal(
  options: UpdateLeadInterestStatusOptions
): Promise<InstantlyResponse> {
  const { apiKey, leadId, status } = options;

  logger.info({ leadId, status }, 'Updating lead interest status');

  const response = await instantlyRequest(
    `/leads/update-interest-status`,
    'POST',
    apiKey,
    {
      lead_id: leadId,
      status,
    }
  );

  logger.info({ leadId, status }, 'Lead interest status updated');
  return response;
}

/**
 * Internal implementation of removeLeadFromSubsequence
 */
async function removeLeadFromSubsequenceInternal(
  options: RemoveLeadFromSubsequenceOptions
): Promise<InstantlyResponse> {
  const { apiKey, leadId, campaignId } = options;

  logger.info({ leadId, campaignId }, 'Removing lead from subsequence');

  const response = await instantlyRequest(
    `/leads/subsequence/remove`,
    'POST',
    apiKey,
    {
      id: leadId,
      campaign_id: campaignId,
    }
  );

  logger.info({ leadId, campaignId }, 'Lead removed from subsequence');
  return response;
}

// ============================================================================
// EMAIL FUNCTIONS (INTERNAL)
// ============================================================================

/**
 * Internal implementation of replyEmail
 */
async function replyEmailInternal(
  options: ReplyEmailOptions
): Promise<InstantlyResponse<Email>> {
  const { apiKey, emailId, eaccount, subject, body } = options;

  logger.info({ emailId, eaccount }, 'Sending email reply');

  const requestBody: Record<string, unknown> = {
    reply_to_uuid: emailId,
    eaccount,
    subject,
    body,
  };

  const response = await instantlyRequest<Email>(
    `/emails/reply`,
    'POST',
    apiKey,
    requestBody
  );

  logger.info({ emailId }, 'Email reply sent');
  return response;
}

/**
 * Internal implementation of forwardEmail
 */
async function forwardEmailInternal(
  options: ForwardEmailOptions
): Promise<InstantlyResponse<Email>> {
  const { apiKey, emailId, eaccount, to_address_email_list, subject, body, message } = options;

  logger.info({ emailId, eaccount, to: to_address_email_list }, 'Forwarding email');

  const requestBody: Record<string, unknown> = {
    reply_to_uuid: emailId,
    eaccount,
    to_address_email_list,
    subject,
    body,
  };

  if (message) {
    requestBody.message = message;
  }

  const response = await instantlyRequest<Email>(
    `/emails/forward`,
    'POST',
    apiKey,
    requestBody
  );

  logger.info({ emailId }, 'Email forwarded');
  return response;
}

/**
 * Internal implementation of listEmails
 */
async function listEmailsInternal(
  options: ListEmailsOptions
): Promise<{ items: Email[]; next_starting_after?: string }> {
  const { apiKey, limit, offset, is_read } = options;

  logger.info({ limit, offset, is_read }, 'Listing emails');

  // Build endpoint with query parameters
  let endpoint = '/emails';
  const params = [];
  if (limit !== undefined) params.push(`limit=${limit}`);
  if (offset !== undefined) params.push(`starting_after=${offset}`);
  // is_unread expects boolean: true for unread, false for read
  if (is_read !== undefined) params.push(`is_unread=${!is_read}`);
  if (params.length > 0) endpoint += `?${params.join('&')}`;

  // This endpoint returns {items: [...], next_starting_after: "..."} directly
  const url = `${INSTANTLY_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'List emails failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as { items: Email[]; next_starting_after?: string };
  logger.info({ count: data.items?.length || 0 }, 'Emails listed');
  return data;
}

/**
 * Internal implementation of getEmail
 */
async function getEmailInternal(
  options: GetEmailOptions
): Promise<Email> {
  const { apiKey, emailId } = options;

  logger.info({ emailId }, 'Getting email details');

  // This endpoint returns the email directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/emails/${emailId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Get email failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const email = await response.json() as Email;
  logger.info({ emailId }, 'Email retrieved');
  return email;
}

/**
 * Internal implementation of updateEmail
 */
async function updateEmailInternal(
  options: UpdateEmailOptions
): Promise<InstantlyResponse<Email>> {
  const { apiKey, emailId, ...updateData } = options;

  logger.info({ emailId }, 'Updating email');

  const response = await instantlyRequest<Email>(
    `/emails/${emailId}`,
    'PATCH',
    apiKey,
    updateData
  );

  logger.info({ emailId }, 'Email updated');
  return response;
}

/**
 * Internal implementation of deleteEmail
 */
async function deleteEmailInternal(
  options: DeleteEmailOptions
): Promise<InstantlyResponse> {
  const { apiKey, emailId } = options;

  logger.info({ emailId }, 'Deleting email');

  const response = await instantlyRequest(
    `/emails/${emailId}`,
    'DELETE',
    apiKey
  );

  logger.info({ emailId }, 'Email deleted');
  return response;
}

/**
 * Internal implementation of getUnreadCount
 */
async function getUnreadCountInternal(
  options: GetUnreadCountOptions
): Promise<{ count: number }> {
  const { apiKey } = options;

  logger.info('Getting unread email count');

  // This endpoint returns the count directly, not wrapped in InstantlyResponse
  const url = `${INSTANTLY_API_BASE}/emails/unread/count`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Get unread count failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as { count: number };
  logger.info({ count: data.count }, 'Unread count retrieved');
  return data;
}

/**
 * Internal implementation of markThreadAsRead
 */
async function markThreadAsReadInternal(
  options: MarkThreadAsReadOptions
): Promise<InstantlyResponse> {
  const { apiKey, threadId } = options;

  logger.info({ threadId }, 'Marking thread as read');

  const response = await instantlyRequest(
    `/emails/threads/${threadId}/mark-as-read`,
    'POST',
    apiKey
  );

  logger.info({ threadId }, 'Thread marked as read');
  return response;
}

// ============================================================================
// PROTECTED EXPORTS (WITH CIRCUIT BREAKER + RATE LIMITING)
// ============================================================================

// Campaign Functions
const createCampaignWithBreaker = createCircuitBreaker(createCampaignInternal, {
  timeout: 15000,
  name: 'instantly.createCampaign',
});

/**
 * Create a new email campaign in Instantly.ai
 *
 * @param options - Campaign creation parameters including name and schedule
 * @returns Campaign object with ID and details
 *
 * @example
 * const result = await createCampaign({
 *   apiKey: 'your-api-key',
 *   name: 'Q1 Outreach Campaign',
 *   from_email: 'sales@company.com',
 *   schedule: {
 *     days: ['monday', 'tuesday', 'wednesday'],
 *     start_hour: 9,
 *     end_hour: 17,
 *     timezone: 'America/New_York'
 *   }
 * });
 */
export const createCampaign = withRateLimit(
  (options: CreateCampaignOptions) => createCampaignWithBreaker.fire(options),
  rateLimiter
);

const listCampaignsWithBreaker = createCircuitBreaker(listCampaignsInternal, {
  timeout: 15000,
  name: 'instantly.listCampaigns',
});

/**
 * List all campaigns in your Instantly.ai account
 *
 * @param options - List parameters including pagination
 * @returns Array of campaign objects
 *
 * @example
 * const result = await listCampaigns({
 *   apiKey: 'your-api-key',
 *   limit: 50,
 *   offset: 0
 * });
 */
export const listCampaigns = withRateLimit(
  (options: ListCampaignsOptions) => listCampaignsWithBreaker.fire(options),
  rateLimiter
);

const getCampaignWithBreaker = createCircuitBreaker(getCampaignInternal, {
  timeout: 15000,
  name: 'instantly.getCampaign',
});

/**
 * Get details of a specific campaign
 *
 * @param options - Campaign ID and API key
 * @returns Campaign object with full details
 *
 * @example
 * const result = await getCampaign({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const getCampaign = withRateLimit(
  (options: GetCampaignOptions) => getCampaignWithBreaker.fire(options),
  rateLimiter
);

const updateCampaignWithBreaker = createCircuitBreaker(updateCampaignInternal, {
  timeout: 15000,
  name: 'instantly.updateCampaign',
});

/**
 * Update an existing campaign
 *
 * @param options - Campaign ID and fields to update
 * @returns Updated campaign object
 *
 * @example
 * const result = await updateCampaign({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456',
 *   name: 'Updated Campaign Name'
 * });
 */
export const updateCampaign = withRateLimit(
  (options: UpdateCampaignOptions) => updateCampaignWithBreaker.fire(options),
  rateLimiter
);

const deleteCampaignWithBreaker = createCircuitBreaker(deleteCampaignInternal, {
  timeout: 15000,
  name: 'instantly.deleteCampaign',
});

/**
 * Delete a campaign permanently
 *
 * @param options - Campaign ID and API key
 * @returns Success response
 *
 * @example
 * const result = await deleteCampaign({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const deleteCampaign = withRateLimit(
  (options: DeleteCampaignOptions) => deleteCampaignWithBreaker.fire(options),
  rateLimiter
);

const activateCampaignWithBreaker = createCircuitBreaker(activateCampaignInternal, {
  timeout: 15000,
  name: 'instantly.activateCampaign',
});

/**
 * Activate a paused or draft campaign to start sending emails
 *
 * @param options - Campaign ID and API key
 * @returns Updated campaign object with active status
 *
 * @example
 * const result = await activateCampaign({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const activateCampaign = withRateLimit(
  (options: CampaignActionOptions) => activateCampaignWithBreaker.fire(options),
  rateLimiter
);

const pauseCampaignWithBreaker = createCircuitBreaker(pauseCampaignInternal, {
  timeout: 15000,
  name: 'instantly.pauseCampaign',
});

/**
 * Pause an active campaign to stop sending emails
 *
 * @param options - Campaign ID and API key
 * @returns Updated campaign object with paused status
 *
 * @example
 * const result = await pauseCampaign({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const pauseCampaign = withRateLimit(
  (options: CampaignActionOptions) => pauseCampaignWithBreaker.fire(options),
  rateLimiter
);

const searchCampaignByContactWithBreaker = createCircuitBreaker(
  searchCampaignByContactInternal,
  {
    timeout: 15000,
    name: 'instantly.searchCampaignByContact',
  }
);

/**
 * Search for campaigns that contain a specific contact email
 *
 * @param options - Contact email and API key
 * @returns Array of campaigns containing the contact
 *
 * @example
 * const result = await searchCampaignByContact({
 *   apiKey: 'your-api-key',
 *   email: 'contact@example.com'
 * });
 */
export const searchCampaignByContact = withRateLimit(
  (options: SearchCampaignByContactOptions) =>
    searchCampaignByContactWithBreaker.fire(options),
  rateLimiter
);

// Lead Functions
const addLeadWithBreaker = createCircuitBreaker(addLeadInternal, {
  timeout: 15000,
  name: 'instantly.addLead',
});

/**
 * Add a new lead to a campaign
 *
 * @param options - Campaign ID, lead email, and optional contact details
 * @returns Lead object with ID
 *
 * @example
 * const result = await addLead({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456',
 *   email: 'lead@example.com',
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   company: 'Acme Corp'
 * });
 */
export const addLead = withRateLimit(
  (options: AddLeadOptions) => addLeadWithBreaker.fire(options),
  rateLimiter
);

const deleteLeadWithBreaker = createCircuitBreaker(deleteLeadInternal, {
  timeout: 15000,
  name: 'instantly.deleteLead',
});

/**
 * Remove a lead by its UUID
 *
 * @param options - Lead UUID to delete
 * @returns Success response
 *
 * @example
 * const result = await deleteLead({
 *   apiKey: 'your-api-key',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf'
 * });
 */
export const deleteLead = withRateLimit(
  (options: DeleteLeadOptions) => deleteLeadWithBreaker.fire(options),
  rateLimiter
);

const getLeadWithBreaker = createCircuitBreaker(getLeadInternal, {
  timeout: 15000,
  name: 'instantly.getLead',
});

/**
 * Get details of a specific lead by UUID
 *
 * @param options - Lead UUID to retrieve
 * @returns Lead object with full details
 *
 * @example
 * const result = await getLead({
 *   apiKey: 'your-api-key',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf'
 * });
 */
export const getLead = withRateLimit(
  (options: GetLeadOptions) => getLeadWithBreaker.fire(options),
  rateLimiter
);

const updateLeadWithBreaker = createCircuitBreaker(updateLeadInternal, {
  timeout: 15000,
  name: 'instantly.updateLead',
});

/**
 * Update a lead's information
 *
 * @param options - Lead UUID and fields to update
 * @returns Updated lead object
 *
 * @example
 * const result = await updateLead({
 *   apiKey: 'your-api-key',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf',
 *   first_name: 'Updated Name',
 *   company: 'New Company'
 * });
 */
export const updateLead = withRateLimit(
  (options: UpdateLeadOptions) => updateLeadWithBreaker.fire(options),
  rateLimiter
);

const listLeadsWithBreaker = createCircuitBreaker(listLeadsInternal, {
  timeout: 15000,
  name: 'instantly.listLeads',
});

/**
 * List leads (optionally filtered by campaign)
 *
 * @param options - Optional campaign ID filter and pagination parameters
 * @returns Array of lead objects
 *
 * @example
 * // List all leads
 * const allLeads = await listLeads({
 *   apiKey: 'your-api-key',
 *   limit: 100
 * });
 *
 * // List leads in a specific campaign
 * const campaignLeads = await listLeads({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456',
 *   limit: 100,
 *   skip: 0
 * });
 */
export const listLeads = withRateLimit(
  (options: ListLeadsOptions) => listLeadsWithBreaker.fire(options),
  rateLimiter
);

const mergeLeadsWithBreaker = createCircuitBreaker(mergeLeadsInternal, {
  timeout: 15000,
  name: 'instantly.mergeLeads',
});

/**
 * Merge duplicate leads into a single lead record
 *
 * @param options - Primary lead ID and duplicate lead ID
 * @returns Success response
 *
 * @example
 * const result = await mergeLeads({
 *   apiKey: 'your-api-key',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf',
 *   duplicateLeadId: '019a861c-5ff5-7c3c-88be-2269f99ed8d5'
 * });
 */
export const mergeLeads = withRateLimit(
  (options: MergeLeadsOptions) => mergeLeadsWithBreaker.fire(options),
  rateLimiter
);

const updateLeadInterestStatusWithBreaker = createCircuitBreaker(
  updateLeadInterestStatusInternal,
  {
    timeout: 15000,
    name: 'instantly.updateLeadInterestStatus',
  }
);

/**
 * Update a lead's interest status
 *
 * @param options - Lead ID and interest status
 * @returns Success response
 *
 * @example
 * const result = await updateLeadInterestStatus({
 *   apiKey: 'your-api-key',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf',
 *   status: 'interested'
 * });
 */
export const updateLeadInterestStatus = withRateLimit(
  (options: UpdateLeadInterestStatusOptions) =>
    updateLeadInterestStatusWithBreaker.fire(options),
  rateLimiter
);

const removeLeadFromSubsequenceWithBreaker = createCircuitBreaker(
  removeLeadFromSubsequenceInternal,
  {
    timeout: 15000,
    name: 'instantly.removeLeadFromSubsequence',
  }
);

/**
 * Remove a lead from an email subsequence
 *
 * @param options - Lead ID and campaign ID
 * @returns Success response
 *
 * @example
 * const result = await removeLeadFromSubsequence({
 *   apiKey: 'your-api-key',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf',
 *   campaignId: 'camp_123456'
 * });
 */
export const removeLeadFromSubsequence = withRateLimit(
  (options: RemoveLeadFromSubsequenceOptions) =>
    removeLeadFromSubsequenceWithBreaker.fire(options),
  rateLimiter
);

// Email Functions (Unibox)
const replyEmailWithBreaker = createCircuitBreaker(replyEmailInternal, {
  timeout: 15000,
  name: 'instantly.replyEmail',
});

/**
 * Send a reply to an email in Instantly.ai Unibox
 *
 * @param options - Email ID, sender account, and reply content (text and/or HTML)
 * @returns Email response object
 *
 * @example
 * const result = await replyEmail({
 *   apiKey: 'your-api-key',
 *   emailId: 'email_123456',
 *   eaccount: 'yasmineseidu@gmail.com',
 *   body: 'Thanks for reaching out! I will get back to you soon.',
 *   html_body: '<p>Thanks for reaching out! I will get back to you soon.</p>'
 * });
 */
export const replyEmail = withRateLimit(
  (options: ReplyEmailOptions) => replyEmailWithBreaker.fire(options),
  rateLimiter
);

const forwardEmailWithBreaker = createCircuitBreaker(forwardEmailInternal, {
  timeout: 15000,
  name: 'instantly.forwardEmail',
});

/**
 * Forward an email from Instantly.ai Unibox to other recipients
 *
 * @param options - Email ID, sender account, recipient addresses, and optional message
 * @returns Email response object
 *
 * @example
 * const result = await forwardEmail({
 *   apiKey: 'your-api-key',
 *   emailId: 'email_123456',
 *   eaccount: 'yasmineseidu@gmail.com',
 *   to_address_email_list: ['colleague@company.com', 'manager@company.com'],
 *   message: 'FYI - please review this inquiry'
 * });
 */
export const forwardEmail = withRateLimit(
  (options: ForwardEmailOptions) => forwardEmailWithBreaker.fire(options),
  rateLimiter
);

const listEmailsWithBreaker = createCircuitBreaker(listEmailsInternal, {
  timeout: 15000,
  name: 'instantly.listEmails',
});

/**
 * List emails in your Instantly.ai Unibox with optional filtering
 *
 * @param options - Pagination and read status filter parameters
 * @returns Array of email objects
 *
 * @example
 * // List all emails
 * const allEmails = await listEmails({
 *   apiKey: 'your-api-key',
 *   limit: 50
 * });
 *
 * // List only unread emails
 * const unreadEmails = await listEmails({
 *   apiKey: 'your-api-key',
 *   is_read: false,
 *   limit: 20
 * });
 */
export const listEmails = withRateLimit(
  (options: ListEmailsOptions) => listEmailsWithBreaker.fire(options),
  rateLimiter
);

const getEmailWithBreaker = createCircuitBreaker(getEmailInternal, {
  timeout: 15000,
  name: 'instantly.getEmail',
});

/**
 * Get full details of a specific email from Unibox
 *
 * @param options - Email ID to retrieve
 * @returns Full email object with all details
 *
 * @example
 * const result = await getEmail({
 *   apiKey: 'your-api-key',
 *   emailId: 'email_123456'
 * });
 */
export const getEmail = withRateLimit(
  (options: GetEmailOptions) => getEmailWithBreaker.fire(options),
  rateLimiter
);

const updateEmailWithBreaker = createCircuitBreaker(updateEmailInternal, {
  timeout: 15000,
  name: 'instantly.updateEmail',
});

/**
 * Update email properties (e.g., mark as read/unread)
 *
 * @param options - Email ID and fields to update
 * @returns Updated email object
 *
 * @example
 * // Mark email as read
 * const result = await updateEmail({
 *   apiKey: 'your-api-key',
 *   emailId: 'email_123456',
 *   is_unread: 0
 * });
 *
 * // Mark email as unread
 * const result = await updateEmail({
 *   apiKey: 'your-api-key',
 *   emailId: 'email_123456',
 *   is_unread: 1
 * });
 */
export const updateEmail = withRateLimit(
  (options: UpdateEmailOptions) => updateEmailWithBreaker.fire(options),
  rateLimiter
);

const deleteEmailWithBreaker = createCircuitBreaker(deleteEmailInternal, {
  timeout: 15000,
  name: 'instantly.deleteEmail',
});

/**
 * Delete an email from Instantly.ai Unibox
 *
 * @param options - Email ID to delete
 * @returns Success response
 *
 * @example
 * const result = await deleteEmail({
 *   apiKey: 'your-api-key',
 *   emailId: 'email_123456'
 * });
 */
export const deleteEmail = withRateLimit(
  (options: DeleteEmailOptions) => deleteEmailWithBreaker.fire(options),
  rateLimiter
);

const getUnreadCountWithBreaker = createCircuitBreaker(getUnreadCountInternal, {
  timeout: 15000,
  name: 'instantly.getUnreadCount',
});

/**
 * Get the count of unread emails in your Unibox
 *
 * @param options - API key
 * @returns Object with unread count
 *
 * @example
 * const result = await getUnreadCount({
 *   apiKey: 'your-api-key'
 * });
 * console.log(`You have ${result.data.count} unread emails`);
 */
export const getUnreadCount = withRateLimit(
  (options: GetUnreadCountOptions) => getUnreadCountWithBreaker.fire(options),
  rateLimiter
);

const markThreadAsReadWithBreaker = createCircuitBreaker(markThreadAsReadInternal, {
  timeout: 15000,
  name: 'instantly.markThreadAsRead',
});

/**
 * Mark an entire email thread as read in Unibox
 *
 * @param options - Thread ID to mark as read
 * @returns Success response
 *
 * @example
 * const result = await markThreadAsRead({
 *   apiKey: 'your-api-key',
 *   threadId: 'thread_123456'
 * });
 */
export const markThreadAsRead = withRateLimit(
  (options: MarkThreadAsReadOptions) => markThreadAsReadWithBreaker.fire(options),
  rateLimiter
);
