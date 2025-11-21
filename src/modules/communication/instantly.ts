/**
 * Instantly.ai API Client with Reliability Infrastructure
 *
 * Instantly.ai is a cold email outreach platform for B2B sales and marketing.
 * This module provides campaign management, lead management, email management (Unibox), analytics, and account management.
 *
 * Features:
 * - Circuit breaker to prevent hammering failing API
 * - Rate limiting for API quota management
 * - Structured logging
 * - Automatic error handling
 *
 * Supported Operations:
 * - Campaigns: Create, list, get, update, delete, activate, pause, search by contact, duplicate, stop for lead, launched count (11 endpoints)
 * - Leads: Add, get, update, delete, list, merge, update interest status, remove from subsequence, bulk assign, move, add to subsequence, bulk add (12 endpoints)
 * - Email Verification: Verify email, get verification result (2 endpoints)
 * - Lead Lists: Create, list, get, update, delete, get verification stats (6 endpoints)
 * - Emails (Unibox): Reply, forward, list, get, update, delete, get unread count, mark thread as read (8 endpoints)
 * - Analytics: Warmup analytics, test vitals, campaign analytics, overview, daily, steps (6 endpoints)
 * - Accounts: Create, list, get, update, delete, enable/disable warmup, fix, delete multiple, update tracking domain (10 endpoints)
 *
 * Total: 55 endpoints
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

export interface DuplicateCampaignOptions {
  apiKey: string;
  campaignId: string;
}

export interface StopCampaignForLeadOptions {
  apiKey: string;
  campaignId: string;
  leadId: string;
}

export interface GetLaunchedCountOptions {
  apiKey: string;
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

export interface BulkAssignLeadsOptions {
  apiKey: string;
  leadIds: string[]; // Array of lead UUIDs to assign
  organizationUserIds: string[]; // Array of organization user IDs to assign leads to
  campaignId?: string; // Optional campaign filter
}

export interface MoveLeadsOptions {
  apiKey: string;
  leadIds: string[]; // Array of lead UUIDs to move
  campaignId?: string; // Campaign ID to move to
  listId?: string; // Lead list ID to move to
}

export interface AddLeadToSubsequenceOptions {
  apiKey: string;
  leadId: string; // Lead UUID
  campaignId: string; // Campaign ID
  subsequenceId: string; // Subsequence/step ID to add lead to
}

export interface BulkAddLeadsOptions {
  apiKey: string;
  campaignId?: string; // Campaign ID to add leads to
  listId?: string; // Lead list ID to add leads to
  leads: Array<{
    email: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    [key: string]: unknown;
  }>;
}

// Email Verification Types
export interface VerifyEmailOptions {
  apiKey: string;
  email: string; // Email address to verify
}

export interface GetEmailVerificationOptions {
  apiKey: string;
  email: string; // Email address to get verification result for
}

export interface EmailVerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'risky' | 'unknown';
  is_disposable?: boolean;
  is_role_account?: boolean;
  is_free_email?: boolean;
  smtp_valid?: boolean;
  [key: string]: unknown;
}

// Lead List Types
export interface LeadList {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  lead_count?: number;
  [key: string]: unknown;
}

export interface CreateLeadListOptions {
  apiKey: string;
  name: string;
  description?: string;
  [key: string]: unknown;
}

export interface ListLeadListsOptions {
  apiKey: string;
  limit?: number;
  offset?: number;
}

export interface GetLeadListOptions {
  apiKey: string;
  listId: string;
}

export interface UpdateLeadListOptions {
  apiKey: string;
  listId: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface DeleteLeadListOptions {
  apiKey: string;
  listId: string;
}

export interface GetLeadListVerificationStatsOptions {
  apiKey: string;
  listId: string;
}

export interface LeadListVerificationStats {
  total_leads: number;
  verified_count: number;
  valid_count: number;
  invalid_count: number;
  risky_count: number;
  unknown_count: number;
  [key: string]: unknown;
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

// Analytics Types
export interface WarmupAnalyticsOptions {
  apiKey: string;
  emails: string[]; // Array of email addresses to get warmup analytics for
  [key: string]: unknown;
}

export interface TestVitalsOptions {
  apiKey: string;
  email: string; // Email account to test
  [key: string]: unknown;
}

export interface GetCampaignAnalyticsOptions {
  apiKey: string;
  campaignId: string;
}

export interface GetCampaignAnalyticsOverviewOptions {
  apiKey: string;
  campaignId: string;
}

export interface GetCampaignAnalyticsDailyOptions {
  apiKey: string;
  campaignId: string;
  startDate?: string; // ISO date format
  endDate?: string; // ISO date format
}

export interface GetCampaignAnalyticsStepsOptions {
  apiKey: string;
  campaignId: string;
}

// Account Types
export interface Account {
  email: string;
  name?: string;
  status?: string;
  warmup_enabled?: boolean;
  daily_limit?: number;
  [key: string]: unknown;
}

export interface CreateAccountOptions {
  apiKey: string;
  email: string;
  first_name: string; // Required by API
  last_name: string; // Required by API
  provider_code: number; // Required by API (numeric code for email provider)
  smtp_host: string; // Required by API
  smtp_port: number; // Required by API
  smtp_username: string; // Required by API
  smtp_password: string; // Required by API
  imap_host: string; // Required by API
  imap_port: number; // Required by API
  imap_username: string; // Required by API
  imap_password: string; // Required by API
  [key: string]: unknown;
}

export interface ListAccountsOptions {
  apiKey: string;
  limit?: number;
  offset?: number;
}

export interface GetAccountOptions {
  apiKey: string;
  email: string;
}

export interface UpdateAccountOptions {
  apiKey: string;
  email: string;
  daily_limit?: number;
  warmup_enabled?: boolean;
  [key: string]: unknown;
}

export interface DeleteAccountOptions {
  apiKey: string;
  email: string;
}

export interface WarmupActionOptions {
  apiKey: string;
  email: string;
}

export interface FixAccountsOptions {
  apiKey: string;
  emails: string[]; // Array of email addresses to mark as fixed
}

export interface DeleteMultipleAccountsOptions {
  apiKey: string;
  emails: string[]; // Array of email addresses to delete
}

export interface UpdateCustomTrackingDomainOptions {
  apiKey: string;
  email: string; // Account email
  custom_tracking_domain?: string; // Custom tracking domain to set
  [key: string]: unknown;
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

/**
 * Internal implementation of duplicateCampaign
 */
async function duplicateCampaignInternal(
  options: DuplicateCampaignOptions
): Promise<InstantlyResponse<Campaign>> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Duplicating Instantly.ai campaign');

  const response = await instantlyRequest<Campaign>(
    `/campaigns/${campaignId}/duplicate`,
    'POST',
    apiKey
  );

  logger.info({ campaignId, newCampaignId: response.data?.id }, 'Campaign duplicated');
  return response;
}

/**
 * Internal implementation of stopCampaignForLead
 */
async function stopCampaignForLeadInternal(
  options: StopCampaignForLeadOptions
): Promise<InstantlyResponse> {
  const { apiKey, campaignId, leadId } = options;

  logger.info({ campaignId, leadId }, 'Stopping campaign for specific lead');

  const response = await instantlyRequest(
    `/campaigns/${campaignId}/stop-for-lead`,
    'POST',
    apiKey,
    { lead_id: leadId }
  );

  logger.info({ campaignId, leadId }, 'Campaign stopped for lead');
  return response;
}

/**
 * Internal implementation of getLaunchedCount
 */
async function getLaunchedCountInternal(
  options: GetLaunchedCountOptions
): Promise<InstantlyResponse<{ count: number }>> {
  const { apiKey } = options;

  logger.info('Getting launched campaigns count');

  const response = await instantlyRequest<{ count: number }>(
    '/campaigns/launched-count',
    'GET',
    apiKey
  );

  logger.info({ count: response.data?.count }, 'Launched campaigns count retrieved');
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

/**
 * Internal implementation of bulkAssignLeads
 */
async function bulkAssignLeadsInternal(
  options: BulkAssignLeadsOptions
): Promise<InstantlyResponse> {
  const { apiKey, leadIds, organizationUserIds, campaignId } = options;

  logger.info({ leadCount: leadIds.length, userCount: organizationUserIds.length }, 'Bulk assigning leads to users');

  const requestBody: Record<string, unknown> = {
    lead_ids: leadIds,
    organization_user_ids: organizationUserIds,
  };

  if (campaignId) {
    requestBody.campaign_id = campaignId;
  }

  const response = await instantlyRequest(
    `/leads/bulk-assign`,
    'POST',
    apiKey,
    requestBody
  );

  logger.info({ leadCount: leadIds.length, userCount: organizationUserIds.length }, 'Leads bulk assigned');
  return response;
}

/**
 * Internal implementation of moveLeads
 */
async function moveLeadsInternal(
  options: MoveLeadsOptions
): Promise<InstantlyResponse> {
  const { apiKey, leadIds, campaignId, listId } = options;

  logger.info({ leadCount: leadIds.length, campaignId, listId }, 'Moving leads');

  const requestBody: Record<string, unknown> = {
    lead_ids: leadIds,
  };

  // API expects to_campaign_id or to_list_id
  if (campaignId) requestBody.to_campaign_id = campaignId;
  if (listId) requestBody.to_list_id = listId;

  const response = await instantlyRequest(
    `/leads/move`,
    'POST',
    apiKey,
    requestBody
  );

  logger.info({ leadCount: leadIds.length }, 'Leads moved');
  return response;
}

/**
 * Internal implementation of addLeadToSubsequence
 */
async function addLeadToSubsequenceInternal(
  options: AddLeadToSubsequenceOptions
): Promise<InstantlyResponse> {
  const { apiKey, leadId, campaignId, subsequenceId } = options;

  logger.info({ leadId, campaignId, subsequenceId }, 'Adding lead to subsequence');

  const response = await instantlyRequest(
    `/leads/subsequence/add`,
    'POST',
    apiKey,
    {
      id: leadId,
      campaign_id: campaignId,
      subsequence_id: subsequenceId,
    }
  );

  logger.info({ leadId, subsequenceId }, 'Lead added to subsequence');
  return response;
}

/**
 * Internal implementation of bulkAddLeads
 */
async function bulkAddLeadsInternal(
  options: BulkAddLeadsOptions
): Promise<InstantlyResponse> {
  const { apiKey, campaignId, listId, leads } = options;

  logger.info({ leadCount: leads.length, campaignId, listId }, 'Bulk adding leads');

  const requestBody: Record<string, unknown> = {
    leads,
  };

  if (campaignId) requestBody.campaign_id = campaignId;
  if (listId) requestBody.list_id = listId;

  const response = await instantlyRequest(
    `/leads/bulk-add`,
    'POST',
    apiKey,
    requestBody
  );

  logger.info({ leadCount: leads.length }, 'Leads bulk added');
  return response;
}

// ============================================================================
// EMAIL VERIFICATION FUNCTIONS (INTERNAL)
// ============================================================================

/**
 * Internal implementation of verifyEmail
 */
async function verifyEmailInternal(
  options: VerifyEmailOptions
): Promise<EmailVerificationResult> {
  const { apiKey, email } = options;

  logger.info({ email }, 'Verifying email address');

  // This endpoint returns data directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/email-verification`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Email verification failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as EmailVerificationResult & { verification_status?: string };

  // Map verification_status to status for consistency
  if (data.verification_status && !data.status) {
    data.status = data.verification_status as 'valid' | 'invalid' | 'risky' | 'unknown';
  }

  logger.info({ email, status: data.status }, 'Email verified');
  return data;
}

/**
 * Internal implementation of getEmailVerification
 */
async function getEmailVerificationInternal(
  options: GetEmailVerificationOptions
): Promise<EmailVerificationResult> {
  const { apiKey, email } = options;

  logger.info({ email }, 'Getting email verification result');

  // This endpoint returns data directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/email-verification/${encodeURIComponent(email)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Get email verification failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as EmailVerificationResult & { verification_status?: string };

  // Map verification_status to status for consistency
  if (data.verification_status && !data.status) {
    data.status = data.verification_status as 'valid' | 'invalid' | 'risky' | 'unknown';
  }

  logger.info({ email, status: data.status }, 'Email verification result retrieved');
  return data;
}

// ============================================================================
// LEAD LIST FUNCTIONS (INTERNAL)
// ============================================================================

/**
 * Internal implementation of createLeadList
 */
async function createLeadListInternal(
  options: CreateLeadListOptions
): Promise<LeadList> {
  const { apiKey, ...listData } = options;

  logger.info({ name: listData.name }, 'Creating lead list');

  // This endpoint returns data directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/lead-lists`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(listData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Create lead list failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as LeadList;
  logger.info({ listId: data.id }, 'Lead list created');
  return data;
}

/**
 * Internal implementation of listLeadLists
 */
async function listLeadListsInternal(
  options: ListLeadListsOptions
): Promise<{ items: LeadList[]; next_starting_after?: string }> {
  const { apiKey, limit, offset } = options;

  logger.info({ limit, offset }, 'Listing lead lists');

  // Build endpoint with query parameters
  let endpoint = '/lead-lists';
  const params = [];
  if (limit !== undefined) params.push(`limit=${limit}`);
  if (offset !== undefined) params.push(`starting_after=${offset}`);
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
    logger.error({ status: response.status, error: errorText }, 'List lead lists failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as { items: LeadList[]; next_starting_after?: string };
  logger.info({ count: data.items?.length || 0 }, 'Lead lists retrieved');
  return data;
}

/**
 * Internal implementation of getLeadList
 */
async function getLeadListInternal(
  options: GetLeadListOptions
): Promise<LeadList> {
  const { apiKey, listId } = options;

  logger.info({ listId }, 'Getting lead list details');

  // This endpoint returns data directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/lead-lists/${listId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Get lead list failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as LeadList;
  logger.info({ listId }, 'Lead list retrieved');
  return data;
}

/**
 * Internal implementation of updateLeadList
 */
async function updateLeadListInternal(
  options: UpdateLeadListOptions
): Promise<LeadList> {
  const { apiKey, listId, ...updateData } = options;

  logger.info({ listId }, 'Updating lead list');

  // This endpoint returns data directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/lead-lists/${listId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Update lead list failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as LeadList;
  logger.info({ listId }, 'Lead list updated');
  return data;
}

/**
 * Internal implementation of deleteLeadList
 */
async function deleteLeadListInternal(
  options: DeleteLeadListOptions
): Promise<{ success: boolean }> {
  const { apiKey, listId } = options;

  logger.info({ listId }, 'Deleting lead list');

  // This endpoint returns data directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/lead-lists/${listId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Delete lead list failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  logger.info({ listId }, 'Lead list deleted');
  return { success: true };
}

/**
 * Internal implementation of getLeadListVerificationStats
 */
async function getLeadListVerificationStatsInternal(
  options: GetLeadListVerificationStatsOptions
): Promise<LeadListVerificationStats> {
  const { apiKey, listId } = options;

  logger.info({ listId }, 'Getting lead list verification stats');

  // This endpoint returns data directly, not wrapped
  const url = `${INSTANTLY_API_BASE}/lead-lists/${listId}/verification-stats`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, error: errorText }, 'Get verification stats failed');
    throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as LeadListVerificationStats;
  logger.info({ listId }, 'Lead list verification stats retrieved');
  return data;
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
// ANALYTICS FUNCTIONS (INTERNAL)
// ============================================================================

/**
 * Internal implementation of getWarmupAnalytics
 */
async function getWarmupAnalyticsInternal(
  options: WarmupAnalyticsOptions
): Promise<InstantlyResponse> {
  const { apiKey, ...requestData } = options;

  logger.info('Getting warmup analytics');

  const response = await instantlyRequest(
    '/accounts/warmup-analytics',
    'POST',
    apiKey,
    requestData
  );

  logger.info('Warmup analytics retrieved');
  return response;
}

/**
 * Internal implementation of testVitals
 */
async function testVitalsInternal(
  options: TestVitalsOptions
): Promise<InstantlyResponse> {
  const { apiKey, email, ...requestData } = options;

  logger.info({ email }, 'Testing account vitals');

  const response = await instantlyRequest(
    '/accounts/test/vitals',
    'POST',
    apiKey,
    { email, ...requestData }
  );

  logger.info({ email }, 'Account vitals test completed');
  return response;
}

/**
 * Internal implementation of getCampaignAnalytics
 */
async function getCampaignAnalyticsInternal(
  options: GetCampaignAnalyticsOptions
): Promise<InstantlyResponse> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Getting campaign analytics');

  const response = await instantlyRequest(
    `/campaigns/analytics?campaign_id=${encodeURIComponent(campaignId)}`,
    'GET',
    apiKey
  );

  logger.info({ campaignId }, 'Campaign analytics retrieved');
  return response;
}

/**
 * Internal implementation of getCampaignAnalyticsOverview
 */
async function getCampaignAnalyticsOverviewInternal(
  options: GetCampaignAnalyticsOverviewOptions
): Promise<InstantlyResponse> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Getting campaign analytics overview');

  const response = await instantlyRequest(
    `/campaigns/analytics/overview?campaign_id=${encodeURIComponent(campaignId)}`,
    'GET',
    apiKey
  );

  logger.info({ campaignId }, 'Campaign analytics overview retrieved');
  return response;
}

/**
 * Internal implementation of getCampaignAnalyticsDaily
 */
async function getCampaignAnalyticsDailyInternal(
  options: GetCampaignAnalyticsDailyOptions
): Promise<InstantlyResponse> {
  const { apiKey, campaignId, startDate, endDate } = options;

  logger.info({ campaignId, startDate, endDate }, 'Getting daily campaign analytics');

  let endpoint = `/campaigns/analytics/daily?campaign_id=${encodeURIComponent(campaignId)}`;
  if (startDate) endpoint += `&start_date=${encodeURIComponent(startDate)}`;
  if (endDate) endpoint += `&end_date=${encodeURIComponent(endDate)}`;

  const response = await instantlyRequest(endpoint, 'GET', apiKey);

  logger.info({ campaignId }, 'Daily campaign analytics retrieved');
  return response;
}

/**
 * Internal implementation of getCampaignAnalyticsSteps
 */
async function getCampaignAnalyticsStepsInternal(
  options: GetCampaignAnalyticsStepsOptions
): Promise<InstantlyResponse> {
  const { apiKey, campaignId } = options;

  logger.info({ campaignId }, 'Getting campaign analytics by steps');

  const response = await instantlyRequest(
    `/campaigns/analytics/steps?campaign_id=${encodeURIComponent(campaignId)}`,
    'GET',
    apiKey
  );

  logger.info({ campaignId }, 'Campaign analytics steps retrieved');
  return response;
}

// ============================================================================
// ACCOUNT FUNCTIONS (INTERNAL)
// ============================================================================

/**
 * Internal implementation of createAccount
 */
async function createAccountInternal(
  options: CreateAccountOptions
): Promise<InstantlyResponse<Account>> {
  const { apiKey, ...accountData } = options;

  logger.info({ email: accountData.email }, 'Creating email account');

  const response = await instantlyRequest<Account>(
    '/accounts',
    'POST',
    apiKey,
    accountData
  );

  logger.info({ email: accountData.email }, 'Email account created');
  return response;
}

/**
 * Internal implementation of listAccounts
 */
async function listAccountsInternal(
  options: ListAccountsOptions
): Promise<InstantlyResponse<Account[]>> {
  const { apiKey, limit, offset } = options;

  logger.info({ limit, offset }, 'Listing email accounts');

  let endpoint = '/accounts';
  const params = [];
  if (limit) params.push(`limit=${limit}`);
  if (offset) params.push(`offset=${offset}`);
  if (params.length > 0) endpoint += `?${params.join('&')}`;

  const response = await instantlyRequest<Account[]>(endpoint, 'GET', apiKey);

  logger.info(
    { count: Array.isArray(response.data) ? response.data.length : 0 },
    'Email accounts listed'
  );
  return response;
}

/**
 * Internal implementation of getAccount
 */
async function getAccountInternal(
  options: GetAccountOptions
): Promise<InstantlyResponse<Account>> {
  const { apiKey, email } = options;

  logger.info({ email }, 'Getting email account details');

  const response = await instantlyRequest<Account>(
    `/accounts/${encodeURIComponent(email)}`,
    'GET',
    apiKey
  );

  logger.info({ email }, 'Email account retrieved');
  return response;
}

/**
 * Internal implementation of updateAccount
 */
async function updateAccountInternal(
  options: UpdateAccountOptions
): Promise<InstantlyResponse<Account>> {
  const { apiKey, email, ...updateData } = options;

  logger.info({ email }, 'Updating email account');

  const response = await instantlyRequest<Account>(
    `/accounts/${encodeURIComponent(email)}`,
    'PATCH',
    apiKey,
    updateData
  );

  logger.info({ email }, 'Email account updated');
  return response;
}

/**
 * Internal implementation of deleteAccount
 */
async function deleteAccountInternal(
  options: DeleteAccountOptions
): Promise<InstantlyResponse> {
  const { apiKey, email } = options;

  logger.info({ email }, 'Deleting email account');

  const response = await instantlyRequest(
    `/accounts/${encodeURIComponent(email)}`,
    'DELETE',
    apiKey
  );

  logger.info({ email }, 'Email account deleted');
  return response;
}

/**
 * Internal implementation of enableWarmup
 */
async function enableWarmupInternal(
  options: WarmupActionOptions
): Promise<InstantlyResponse> {
  const { apiKey, email } = options;

  logger.info({ email }, 'Enabling warmup for account');

  const response = await instantlyRequest(
    '/accounts/warmup/enable',
    'POST',
    apiKey,
    { email }
  );

  logger.info({ email }, 'Warmup enabled');
  return response;
}

/**
 * Internal implementation of disableWarmup
 */
async function disableWarmupInternal(
  options: WarmupActionOptions
): Promise<InstantlyResponse> {
  const { apiKey, email } = options;

  logger.info({ email }, 'Disabling warmup for account');

  const response = await instantlyRequest(
    '/accounts/warmup/disable',
    'POST',
    apiKey,
    { email }
  );

  logger.info({ email }, 'Warmup disabled');
  return response;
}

/**
 * Internal implementation of fixAccounts
 */
async function fixAccountsInternal(
  options: FixAccountsOptions
): Promise<InstantlyResponse> {
  const { apiKey, emails } = options;

  logger.info({ count: emails.length }, 'Marking accounts as fixed');

  const response = await instantlyRequest(
    '/accounts/fix',
    'POST',
    apiKey,
    { emails }
  );

  logger.info({ count: emails.length }, 'Accounts marked as fixed');
  return response;
}

/**
 * Internal implementation of deleteMultipleAccounts
 */
async function deleteMultipleAccountsInternal(
  options: DeleteMultipleAccountsOptions
): Promise<InstantlyResponse> {
  const { apiKey, emails } = options;

  logger.info({ count: emails.length }, 'Deleting multiple accounts');

  const response = await instantlyRequest(
    '/accounts/delete-multiple',
    'POST',
    apiKey,
    { emails }
  );

  logger.info({ count: emails.length }, 'Multiple accounts deleted');
  return response;
}

/**
 * Internal implementation of updateCustomTrackingDomain
 */
async function updateCustomTrackingDomainInternal(
  options: UpdateCustomTrackingDomainOptions
): Promise<InstantlyResponse> {
  const { apiKey, email, ...updateData } = options;

  logger.info({ email }, 'Updating custom tracking domain');

  const response = await instantlyRequest(
    '/accounts/update-custom-tracking-domain',
    'POST',
    apiKey,
    { email, ...updateData }
  );

  logger.info({ email }, 'Custom tracking domain updated');
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

const duplicateCampaignWithBreaker = createCircuitBreaker(duplicateCampaignInternal, {
  timeout: 15000,
  name: 'instantly.duplicateCampaign',
});

/**
 * Duplicate an existing campaign with all its settings
 *
 * @param options - Campaign ID to duplicate
 * @returns New campaign object with duplicated settings
 *
 * @example
 * const result = await duplicateCampaign({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const duplicateCampaign = withRateLimit(
  (options: DuplicateCampaignOptions) => duplicateCampaignWithBreaker.fire(options),
  rateLimiter
);

const stopCampaignForLeadWithBreaker = createCircuitBreaker(stopCampaignForLeadInternal, {
  timeout: 15000,
  name: 'instantly.stopCampaignForLead',
});

/**
 * Stop a campaign for a specific lead
 *
 * @param options - Campaign ID and lead ID
 * @returns Success response
 *
 * @example
 * const result = await stopCampaignForLead({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf'
 * });
 */
export const stopCampaignForLead = withRateLimit(
  (options: StopCampaignForLeadOptions) => stopCampaignForLeadWithBreaker.fire(options),
  rateLimiter
);

const getLaunchedCountWithBreaker = createCircuitBreaker(getLaunchedCountInternal, {
  timeout: 15000,
  name: 'instantly.getLaunchedCount',
});

/**
 * Get the count of launched (active) campaigns
 *
 * @param options - API key
 * @returns Object with count of launched campaigns
 *
 * @example
 * const result = await getLaunchedCount({
 *   apiKey: 'your-api-key'
 * });
 * console.log(`You have ${result.data.count} launched campaigns`);
 */
export const getLaunchedCount = withRateLimit(
  (options: GetLaunchedCountOptions) => getLaunchedCountWithBreaker.fire(options),
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

const bulkAssignLeadsWithBreaker = createCircuitBreaker(bulkAssignLeadsInternal, {
  timeout: 15000,
  name: 'instantly.bulkAssignLeads',
});

/**
 * Bulk assign multiple leads to organization users
 *
 * @param options - Array of lead IDs, array of organization user IDs, and optional campaign filter
 * @returns Success response
 *
 * @example
 * const result = await bulkAssignLeads({
 *   apiKey: 'your-api-key',
 *   leadIds: ['019a861c-5abb-76fb-a399-6c551d19c0cf', '019a861c-5ff5-7c3c-88be-2269f99ed8d5'],
 *   organizationUserIds: ['org_user_123', 'org_user_456'],
 *   campaignId: 'camp_123456'
 * });
 */
export const bulkAssignLeads = withRateLimit(
  (options: BulkAssignLeadsOptions) => bulkAssignLeadsWithBreaker.fire(options),
  rateLimiter
);

const moveLeadsWithBreaker = createCircuitBreaker(moveLeadsInternal, {
  timeout: 15000,
  name: 'instantly.moveLeads',
});

/**
 * Move multiple leads to a different campaign or lead list
 *
 * @param options - Array of lead IDs and destination campaign or list
 * @returns Success response
 *
 * @example
 * // Move leads to a campaign
 * const result = await moveLeads({
 *   apiKey: 'your-api-key',
 *   leadIds: ['019a861c-5abb-76fb-a399-6c551d19c0cf', '019a861c-5ff5-7c3c-88be-2269f99ed8d5'],
 *   campaignId: 'camp_789012'
 * });
 *
 * // Move leads to a list
 * const result = await moveLeads({
 *   apiKey: 'your-api-key',
 *   leadIds: ['019a861c-5abb-76fb-a399-6c551d19c0cf'],
 *   listId: 'list_456789'
 * });
 */
export const moveLeads = withRateLimit(
  (options: MoveLeadsOptions) => moveLeadsWithBreaker.fire(options),
  rateLimiter
);

const addLeadToSubsequenceWithBreaker = createCircuitBreaker(addLeadToSubsequenceInternal, {
  timeout: 15000,
  name: 'instantly.addLeadToSubsequence',
});

/**
 * Add a lead to a specific subsequence/step in a campaign
 *
 * @param options - Lead ID, campaign ID, and subsequence ID
 * @returns Success response
 *
 * @example
 * const result = await addLeadToSubsequence({
 *   apiKey: 'your-api-key',
 *   leadId: '019a861c-5abb-76fb-a399-6c551d19c0cf',
 *   campaignId: 'camp_123456',
 *   subsequenceId: 'subseq_789012'
 * });
 */
export const addLeadToSubsequence = withRateLimit(
  (options: AddLeadToSubsequenceOptions) => addLeadToSubsequenceWithBreaker.fire(options),
  rateLimiter
);

const bulkAddLeadsWithBreaker = createCircuitBreaker(bulkAddLeadsInternal, {
  timeout: 15000,
  name: 'instantly.bulkAddLeads',
});

/**
 * Add multiple leads in bulk to a campaign or lead list
 *
 * @param options - Array of lead objects and destination campaign or list
 * @returns Success response
 *
 * @example
 * // Add leads to a campaign
 * const result = await bulkAddLeads({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456',
 *   leads: [
 *     { email: 'lead1@example.com', first_name: 'John', last_name: 'Doe', company: 'Acme Corp' },
 *     { email: 'lead2@example.com', first_name: 'Jane', last_name: 'Smith', company: 'Tech Inc' }
 *   ]
 * });
 *
 * // Add leads to a list
 * const result = await bulkAddLeads({
 *   apiKey: 'your-api-key',
 *   listId: 'list_456789',
 *   leads: [
 *     { email: 'lead3@example.com', first_name: 'Bob', company: 'StartupXYZ' }
 *   ]
 * });
 */
export const bulkAddLeads = withRateLimit(
  (options: BulkAddLeadsOptions) => bulkAddLeadsWithBreaker.fire(options),
  rateLimiter
);

// Email Verification Functions
const verifyEmailWithBreaker = createCircuitBreaker(verifyEmailInternal, {
  timeout: 15000,
  name: 'instantly.verifyEmail',
});

/**
 * Verify a single email address for deliverability and validity
 *
 * @param options - Email address to verify
 * @returns Email verification result with status and details
 *
 * @example
 * const result = await verifyEmail({
 *   apiKey: 'your-api-key',
 *   email: 'prospect@example.com'
 * });
 * console.log(`Email status: ${result.data.status}`);
 * console.log(`Is disposable: ${result.data.is_disposable}`);
 */
export const verifyEmail = withRateLimit(
  (options: VerifyEmailOptions) => verifyEmailWithBreaker.fire(options),
  rateLimiter
);

const getEmailVerificationWithBreaker = createCircuitBreaker(getEmailVerificationInternal, {
  timeout: 15000,
  name: 'instantly.getEmailVerification',
});

/**
 * Get the verification result for a previously verified email
 *
 * @param options - Email address to get verification result for
 * @returns Cached email verification result
 *
 * @example
 * const result = await getEmailVerification({
 *   apiKey: 'your-api-key',
 *   email: 'prospect@example.com'
 * });
 */
export const getEmailVerification = withRateLimit(
  (options: GetEmailVerificationOptions) => getEmailVerificationWithBreaker.fire(options),
  rateLimiter
);

// Lead List Functions
const createLeadListWithBreaker = createCircuitBreaker(createLeadListInternal, {
  timeout: 15000,
  name: 'instantly.createLeadList',
});

/**
 * Create a new lead list to organize your prospects
 *
 * @param options - List name and optional description
 * @returns Created lead list object with ID
 *
 * @example
 * const result = await createLeadList({
 *   apiKey: 'your-api-key',
 *   name: 'Q1 2025 Prospects',
 *   description: 'High-priority leads for Q1 outreach'
 * });
 */
export const createLeadList = withRateLimit(
  (options: CreateLeadListOptions) => createLeadListWithBreaker.fire(options),
  rateLimiter
);

const listLeadListsWithBreaker = createCircuitBreaker(listLeadListsInternal, {
  timeout: 15000,
  name: 'instantly.listLeadLists',
});

/**
 * List all lead lists in your account
 *
 * @param options - Pagination parameters
 * @returns Array of lead list objects
 *
 * @example
 * const result = await listLeadLists({
 *   apiKey: 'your-api-key',
 *   limit: 50,
 *   offset: 0
 * });
 */
export const listLeadLists = withRateLimit(
  (options: ListLeadListsOptions) => listLeadListsWithBreaker.fire(options),
  rateLimiter
);

const getLeadListWithBreaker = createCircuitBreaker(getLeadListInternal, {
  timeout: 15000,
  name: 'instantly.getLeadList',
});

/**
 * Get details of a specific lead list
 *
 * @param options - Lead list ID
 * @returns Lead list object with full details
 *
 * @example
 * const result = await getLeadList({
 *   apiKey: 'your-api-key',
 *   listId: 'list_123456'
 * });
 */
export const getLeadList = withRateLimit(
  (options: GetLeadListOptions) => getLeadListWithBreaker.fire(options),
  rateLimiter
);

const updateLeadListWithBreaker = createCircuitBreaker(updateLeadListInternal, {
  timeout: 15000,
  name: 'instantly.updateLeadList',
});

/**
 * Update a lead list's name or description
 *
 * @param options - List ID and fields to update
 * @returns Updated lead list object
 *
 * @example
 * const result = await updateLeadList({
 *   apiKey: 'your-api-key',
 *   listId: 'list_123456',
 *   name: 'Updated List Name',
 *   description: 'New description'
 * });
 */
export const updateLeadList = withRateLimit(
  (options: UpdateLeadListOptions) => updateLeadListWithBreaker.fire(options),
  rateLimiter
);

const deleteLeadListWithBreaker = createCircuitBreaker(deleteLeadListInternal, {
  timeout: 15000,
  name: 'instantly.deleteLeadList',
});

/**
 * Delete a lead list permanently
 *
 * @param options - Lead list ID to delete
 * @returns Success response
 *
 * @example
 * const result = await deleteLeadList({
 *   apiKey: 'your-api-key',
 *   listId: 'list_123456'
 * });
 */
export const deleteLeadList = withRateLimit(
  (options: DeleteLeadListOptions) => deleteLeadListWithBreaker.fire(options),
  rateLimiter
);

const getLeadListVerificationStatsWithBreaker = createCircuitBreaker(
  getLeadListVerificationStatsInternal,
  {
    timeout: 15000,
    name: 'instantly.getLeadListVerificationStats',
  }
);

/**
 * Get email verification statistics for all leads in a list
 *
 * @param options - Lead list ID
 * @returns Verification statistics including valid, invalid, risky counts
 *
 * @example
 * const result = await getLeadListVerificationStats({
 *   apiKey: 'your-api-key',
 *   listId: 'list_123456'
 * });
 * console.log(`Total leads: ${result.data.total_leads}`);
 * console.log(`Valid: ${result.data.valid_count}`);
 * console.log(`Invalid: ${result.data.invalid_count}`);
 */
export const getLeadListVerificationStats = withRateLimit(
  (options: GetLeadListVerificationStatsOptions) =>
    getLeadListVerificationStatsWithBreaker.fire(options),
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

// Analytics Functions
const getWarmupAnalyticsWithBreaker = createCircuitBreaker(getWarmupAnalyticsInternal, {
  timeout: 15000,
  name: 'instantly.getWarmupAnalytics',
});

/**
 * Get warmup analytics for email accounts
 *
 * @param options - API key and array of email addresses
 * @returns Warmup analytics data for specified email accounts
 *
 * @example
 * const result = await getWarmupAnalytics({
 *   apiKey: 'your-api-key',
 *   emails: ['sender@example.com', 'sales@company.com']
 * });
 */
export const getWarmupAnalytics = withRateLimit(
  (options: WarmupAnalyticsOptions) => getWarmupAnalyticsWithBreaker.fire(options),
  rateLimiter
);

const testVitalsWithBreaker = createCircuitBreaker(testVitalsInternal, {
  timeout: 15000,
  name: 'instantly.testVitals',
});

/**
 * Test account vitals to verify email deliverability and health
 *
 * @param options - Email account to test
 * @returns Vitals test results
 *
 * @example
 * const result = await testVitals({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com'
 * });
 */
export const testVitals = withRateLimit(
  (options: TestVitalsOptions) => testVitalsWithBreaker.fire(options),
  rateLimiter
);

const getCampaignAnalyticsWithBreaker = createCircuitBreaker(getCampaignAnalyticsInternal, {
  timeout: 15000,
  name: 'instantly.getCampaignAnalytics',
});

/**
 * Get comprehensive analytics for a specific campaign
 *
 * @param options - Campaign ID and API key
 * @returns Campaign analytics including opens, clicks, replies, bounces
 *
 * @example
 * const result = await getCampaignAnalytics({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const getCampaignAnalytics = withRateLimit(
  (options: GetCampaignAnalyticsOptions) => getCampaignAnalyticsWithBreaker.fire(options),
  rateLimiter
);

const getCampaignAnalyticsOverviewWithBreaker = createCircuitBreaker(
  getCampaignAnalyticsOverviewInternal,
  {
    timeout: 15000,
    name: 'instantly.getCampaignAnalyticsOverview',
  }
);

/**
 * Get overview analytics for a campaign with summary metrics
 *
 * @param options - Campaign ID and API key
 * @returns Campaign analytics overview with key performance indicators
 *
 * @example
 * const result = await getCampaignAnalyticsOverview({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const getCampaignAnalyticsOverview = withRateLimit(
  (options: GetCampaignAnalyticsOverviewOptions) =>
    getCampaignAnalyticsOverviewWithBreaker.fire(options),
  rateLimiter
);

const getCampaignAnalyticsDailyWithBreaker = createCircuitBreaker(
  getCampaignAnalyticsDailyInternal,
  {
    timeout: 15000,
    name: 'instantly.getCampaignAnalyticsDaily',
  }
);

/**
 * Get daily analytics breakdown for a campaign
 *
 * @param options - Campaign ID, optional date range
 * @returns Daily analytics data
 *
 * @example
 * const result = await getCampaignAnalyticsDaily({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456',
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 */
export const getCampaignAnalyticsDaily = withRateLimit(
  (options: GetCampaignAnalyticsDailyOptions) =>
    getCampaignAnalyticsDailyWithBreaker.fire(options),
  rateLimiter
);

const getCampaignAnalyticsStepsWithBreaker = createCircuitBreaker(
  getCampaignAnalyticsStepsInternal,
  {
    timeout: 15000,
    name: 'instantly.getCampaignAnalyticsSteps',
  }
);

/**
 * Get analytics breakdown by campaign steps/sequences
 *
 * @param options - Campaign ID and API key
 * @returns Analytics data for each step in the campaign sequence
 *
 * @example
 * const result = await getCampaignAnalyticsSteps({
 *   apiKey: 'your-api-key',
 *   campaignId: 'camp_123456'
 * });
 */
export const getCampaignAnalyticsSteps = withRateLimit(
  (options: GetCampaignAnalyticsStepsOptions) =>
    getCampaignAnalyticsStepsWithBreaker.fire(options),
  rateLimiter
);

// Account Functions
const createAccountWithBreaker = createCircuitBreaker(createAccountInternal, {
  timeout: 15000,
  name: 'instantly.createAccount',
});

/**
 * Create a new email account in Instantly.ai
 *
 * @param options - Email, first/last name, provider code, and complete SMTP/IMAP configuration
 * @returns Created account object
 *
 * @example
 * const result = await createAccount({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com',
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   provider_code: 1, // Numeric provider code
 *   smtp_host: 'smtp.gmail.com',
 *   smtp_port: 587,
 *   smtp_username: 'sender@example.com',
 *   smtp_password: 'app-password',
 *   imap_host: 'imap.gmail.com',
 *   imap_port: 993,
 *   imap_username: 'sender@example.com',
 *   imap_password: 'app-password'
 * });
 */
export const createAccount = withRateLimit(
  (options: CreateAccountOptions) => createAccountWithBreaker.fire(options),
  rateLimiter
);

const listAccountsWithBreaker = createCircuitBreaker(listAccountsInternal, {
  timeout: 15000,
  name: 'instantly.listAccounts',
});

/**
 * List all email accounts in your Instantly.ai workspace
 *
 * @param options - Pagination parameters
 * @returns Array of email account objects
 *
 * @example
 * const result = await listAccounts({
 *   apiKey: 'your-api-key',
 *   limit: 50,
 *   offset: 0
 * });
 */
export const listAccounts = withRateLimit(
  (options: ListAccountsOptions) => listAccountsWithBreaker.fire(options),
  rateLimiter
);

const getAccountWithBreaker = createCircuitBreaker(getAccountInternal, {
  timeout: 15000,
  name: 'instantly.getAccount',
});

/**
 * Get details of a specific email account
 *
 * @param options - Email address to retrieve
 * @returns Account object with full details
 *
 * @example
 * const result = await getAccount({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com'
 * });
 */
export const getAccount = withRateLimit(
  (options: GetAccountOptions) => getAccountWithBreaker.fire(options),
  rateLimiter
);

const updateAccountWithBreaker = createCircuitBreaker(updateAccountInternal, {
  timeout: 15000,
  name: 'instantly.updateAccount',
});

/**
 * Update email account settings
 *
 * @param options - Email address and fields to update
 * @returns Updated account object
 *
 * @example
 * const result = await updateAccount({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com',
 *   daily_limit: 50,
 *   warmup_enabled: true
 * });
 */
export const updateAccount = withRateLimit(
  (options: UpdateAccountOptions) => updateAccountWithBreaker.fire(options),
  rateLimiter
);

const deleteAccountWithBreaker = createCircuitBreaker(deleteAccountInternal, {
  timeout: 15000,
  name: 'instantly.deleteAccount',
});

/**
 * Delete an email account from Instantly.ai
 *
 * @param options - Email address to delete
 * @returns Success response
 *
 * @example
 * const result = await deleteAccount({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com'
 * });
 */
export const deleteAccount = withRateLimit(
  (options: DeleteAccountOptions) => deleteAccountWithBreaker.fire(options),
  rateLimiter
);

const enableWarmupWithBreaker = createCircuitBreaker(enableWarmupInternal, {
  timeout: 15000,
  name: 'instantly.enableWarmup',
});

/**
 * Enable email warmup for an account to improve deliverability
 *
 * @param options - Email address to enable warmup for
 * @returns Success response
 *
 * @example
 * const result = await enableWarmup({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com'
 * });
 */
export const enableWarmup = withRateLimit(
  (options: WarmupActionOptions) => enableWarmupWithBreaker.fire(options),
  rateLimiter
);

const disableWarmupWithBreaker = createCircuitBreaker(disableWarmupInternal, {
  timeout: 15000,
  name: 'instantly.disableWarmup',
});

/**
 * Disable email warmup for an account
 *
 * @param options - Email address to disable warmup for
 * @returns Success response
 *
 * @example
 * const result = await disableWarmup({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com'
 * });
 */
export const disableWarmup = withRateLimit(
  (options: WarmupActionOptions) => disableWarmupWithBreaker.fire(options),
  rateLimiter
);

const fixAccountsWithBreaker = createCircuitBreaker(fixAccountsInternal, {
  timeout: 15000,
  name: 'instantly.fixAccounts',
});

/**
 * Mark multiple accounts as fixed after resolving connection issues
 *
 * @param options - Array of email addresses to mark as fixed
 * @returns Success response
 *
 * @example
 * const result = await fixAccounts({
 *   apiKey: 'your-api-key',
 *   emails: ['account1@example.com', 'account2@example.com']
 * });
 */
export const fixAccounts = withRateLimit(
  (options: FixAccountsOptions) => fixAccountsWithBreaker.fire(options),
  rateLimiter
);

const deleteMultipleAccountsWithBreaker = createCircuitBreaker(deleteMultipleAccountsInternal, {
  timeout: 15000,
  name: 'instantly.deleteMultipleAccounts',
});

/**
 * Delete multiple email accounts in bulk
 *
 * @param options - Array of email addresses to delete
 * @returns Success response
 *
 * @example
 * const result = await deleteMultipleAccounts({
 *   apiKey: 'your-api-key',
 *   emails: ['old1@example.com', 'old2@example.com']
 * });
 */
export const deleteMultipleAccounts = withRateLimit(
  (options: DeleteMultipleAccountsOptions) => deleteMultipleAccountsWithBreaker.fire(options),
  rateLimiter
);

const updateCustomTrackingDomainWithBreaker = createCircuitBreaker(
  updateCustomTrackingDomainInternal,
  {
    timeout: 15000,
    name: 'instantly.updateCustomTrackingDomain',
  }
);

/**
 * Update custom tracking domain for an email account
 *
 * @param options - Account email and custom tracking domain
 * @returns Success response
 *
 * @example
 * const result = await updateCustomTrackingDomain({
 *   apiKey: 'your-api-key',
 *   email: 'sender@example.com',
 *   custom_tracking_domain: 'track.mydomain.com'
 * });
 */
export const updateCustomTrackingDomain = withRateLimit(
  (options: UpdateCustomTrackingDomainOptions) =>
    updateCustomTrackingDomainWithBreaker.fire(options),
  rateLimiter
);
