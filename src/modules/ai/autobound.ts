/**
 * Autobound API Client with Reliability Infrastructure
 *
 * Autobound enables hyper-personalized sales content generation by accessing
 * a database of 250M+ contacts and 50M+ companies. The platform uses AI to
 * identify relevant insights and transform them into engagement-focused messages.
 *
 * Features:
 * - Circuit breaker to prevent hammering failing API
 * - Rate limiting for API quota management (300 requests/min, 50k requests/day)
 * - Structured logging
 * - Automatic error handling
 *
 * Authentication:
 * - API Key passed via X-API-KEY header
 * - Generate at: https://app2.autobound.ai/settings/api-keys
 *
 * API Documentation: https://autobound-api.readme.io/docs/introduction
 *
 * @module ai/autobound
 */

import { logger } from '@/lib/logger';
import { createCircuitBreaker } from '@/lib/resilience';
import { createRateLimiter, withRateLimit } from '@/lib/rate-limiter';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Content types supported by Autobound
 */
export type AutoboundContentType =
  | 'email'
  | 'opener'
  | 'sms'
  | 'connectionRequest'
  | 'callScript'
  | 'sequence'
  | 'custom';

/**
 * AI models available for content generation
 */
export type AutoboundModel = 'opus' | 'sonnet_3.5' | 'gpt4o' | 'fine_tuned';

/**
 * Preset writing styles
 */
export type AutoboundWritingStyle =
  | 'challenger_sale'
  | 'clever_poet'
  | 'cxo_pitch'
  | 'data_driven'
  | 'basho'
  | 'why_you_why_now'
  | 'custom';

/**
 * Options for generating personalized content
 */
export interface GenerateContentOptions {
  /** API key (optional, uses env var if not provided) */
  apiKey?: string;

  /** Email address of the contact (required if no contactLinkedinUrl) */
  contactEmail?: string;

  /** LinkedIn URL of the contact (required if no contactEmail) */
  contactLinkedinUrl?: string;

  /** Email address of the user (required if no userLinkedinUrl) */
  userEmail?: string;

  /** LinkedIn URL of the user (required if no userEmail) */
  userLinkedinUrl?: string;

  /** Type of content to generate */
  contentType: AutoboundContentType;

  /** Extra information for customizing generated content (max 10,000 chars) */
  additionalContext?: string;

  /** Overwrites automatically resolved contact name */
  contactName?: string;

  /** Overwrites automatically resolved company name */
  contactCompanyName?: string;

  /** Overwrites automatically resolved company URL */
  contactCompanyUrl?: string;

  /** Content base for rewriting/personalization */
  contentToRewrite?: string;

  /** Custom output specification for content generation */
  customContentType?: string;

  /** User-defined writing style (max 10,000 chars) */
  customWritingStyle?: string;

  /** Insights to explicitly exclude */
  disabledInsights?: string[];

  /** Insights to explicitly include */
  enabledInsights?: string[];

  /** LLM selection (default: fine_tuned for email, opus for sequence) */
  model?: AutoboundModel;

  /** Number of unique content pieces (max: 3, default: 1) */
  n?: number;

  /** Desired output language (default: english) */
  language?: string;

  /** Sales collateral text (max 10,000 chars) */
  salesAsset?: string;

  /** Email count for sequences (default: 3) */
  sequenceNumberOfEmails?: number;

  /** Overwrites automatically resolved user company */
  userCompanyName?: string;

  /** Overwrites automatically resolved company URL */
  userCompanyUrl?: string;

  /** Overwrites automatically resolved user name */
  userName?: string;

  /** Value proposition messaging (max 10,000 chars) */
  valueProposition?: string;

  /** Approximate output word count */
  wordCount?: number;

  /** Preset writing style */
  writingStyle?: AutoboundWritingStyle;
}

/**
 * Generated content item
 */
export interface ContentItem {
  /** Email subject line (for email content type) */
  subject?: string;

  /** Generated content body */
  content: string;

  /** AI model used for generation */
  modelUsed: string;

  /** Unique identifier for the content item */
  contentItemId: string;

  /** Array of ranked insights with metadata */
  insightsUsed?: Array<{
    insightId: string;
    name: string;
    type: string;
    subType: string;
    rank?: number;
  }>;

  /** Value proposition details */
  valuePropsUsed?: unknown;

  /** Sales asset information */
  salesAssetsUsed?: unknown;
}

/**
 * Response from generate-content endpoint
 */
export interface GenerateContentResponse {
  /** Generated content items */
  contentList: ContentItem[];

  /** Resolved contact information */
  contactEmail?: string;
  contactCompanyName?: string;
  contactJobTitle?: string;
  contactLinkedinUrl?: string;

  /** Resolved user information */
  userEmail?: string;
  userCompanyName?: string;
  userJobTitle?: string;
  userLinkedinUrl?: string;
}

/**
 * Options for generating insights
 */
export interface GenerateInsightsOptions {
  /** API key (optional, uses env var if not provided) */
  apiKey?: string;

  /** Email address of the contact (required if no other contact identifier) */
  contactEmail?: string;

  /** LinkedIn URL of the contact */
  contactLinkedinUrl?: string;

  /** Company URL */
  contactCompanyUrl?: string;

  /** Email address of the user (optional) */
  userEmail?: string;

  /** Specific insight subtype to filter by (e.g., "podcast", "hiringTrends") */
  insightSubtype?: string;
}

/**
 * Individual insight from generate-insights endpoint
 */
export interface Insight {
  /** Unique identifier */
  insightId: string;

  /** Human-readable name */
  name: string;

  /** Primary category */
  type: string;

  /** Specific insight subtype */
  subType: string;

  /** Specific data fields for this insight */
  variables: Record<string, unknown>;
}

/**
 * Response from generate-insights endpoint
 */
export interface GenerateInsightsResponse {
  /** Success status */
  success: boolean;

  /** Resolved contact information */
  prospectResolution?: {
    contactEmail?: string;
    contactName?: string;
    contactCompanyName?: string;
    contactJobTitle?: string;
    contactLinkedinUrl?: string;
  };

  /** Resolved user company information */
  userCompanyResolution?: {
    companyName?: string;
    companyUrl?: string;
  };

  /** Array of insights (up to 20 per request) */
  insights: Insight[];
}

// ============================================================================
// CREDENTIAL DETECTION
// ============================================================================

const hasCredentials = process.env.AUTOBOUND_API_KEY !== undefined;

if (!hasCredentials) {
  logger.warn('⚠️  AUTOBOUND_API_KEY is not set. Autobound features will not work.');
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

const AUTOBOUND_API_URL = 'https://api.autobound.ai/api/external';
const GENERATE_CONTENT_VERSION = 'v3.6';
const GENERATE_INSIGHTS_VERSION = 'v1.4';

// ============================================================================
// RATE LIMITER CONFIGURATION
// ============================================================================

// Rate limits: 300 requests/min, 50,000 requests/day
const rateLimiter = createRateLimiter({
  maxConcurrent: 10, // Max parallel requests
  minTime: 200, // Min time between requests (ms) - 300/min = 200ms
  reservoir: 300, // Initial token count
  reservoirRefreshAmount: 300, // Tokens added per interval
  reservoirRefreshInterval: 60000, // Refresh interval (1 minute)
  id: 'autobound',
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to make Autobound API requests
 */
async function autoboundApiRequest(
  endpoint: string,
  apiKey: string | undefined,
  body: Record<string, unknown>
): Promise<unknown> {
  const key = apiKey || process.env.AUTOBOUND_API_KEY;

  if (!key) {
    throw new Error('Autobound API key is required. Set AUTOBOUND_API_KEY or pass apiKey parameter.');
  }

  const headers: Record<string, string> = {
    'X-API-KEY': key,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${AUTOBOUND_API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error(
      { status: response.status, error: errorText },
      'Autobound API request failed'
    );

    // Handle specific error codes
    if (response.status === 401) {
      throw new Error('Authentication failed. Check your API key.');
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Try again later.');
    } else if (response.status === 400) {
      throw new Error(`Invalid parameters: ${errorText}`);
    }

    throw new Error(`Autobound API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// INTERNAL FUNCTIONS (UNPROTECTED)
// ============================================================================

/**
 * Internal implementation of generateContent
 */
async function generateContentInternal(
  options: GenerateContentOptions
): Promise<GenerateContentResponse> {
  logger.info(
    {
      contentType: options.contentType,
      hasContactEmail: !!options.contactEmail,
      hasContactLinkedin: !!options.contactLinkedinUrl,
      model: options.model,
      n: options.n,
    },
    'Starting content generation'
  );

  // Validate required identifiers
  if (!options.contactEmail && !options.contactLinkedinUrl) {
    throw new Error('Either contactEmail or contactLinkedinUrl is required');
  }

  if (!options.userEmail && !options.userLinkedinUrl) {
    throw new Error('Either userEmail or userLinkedinUrl is required');
  }

  // Build request body
  const body: Record<string, unknown> = {
    contentType: options.contentType,
  };

  // Add all optional parameters
  if (options.contactEmail) body.contactEmail = options.contactEmail;
  if (options.contactLinkedinUrl) body.contactLinkedinUrl = options.contactLinkedinUrl;
  if (options.userEmail) body.userEmail = options.userEmail;
  if (options.userLinkedinUrl) body.userLinkedinUrl = options.userLinkedinUrl;
  if (options.additionalContext) body.additionalContext = options.additionalContext;
  if (options.contactName) body.contactName = options.contactName;
  if (options.contactCompanyName) body.contactCompanyName = options.contactCompanyName;
  if (options.contactCompanyUrl) body.contactCompanyUrl = options.contactCompanyUrl;
  if (options.contentToRewrite) body.contentToRewrite = options.contentToRewrite;
  if (options.customContentType) body.customContentType = options.customContentType;
  if (options.customWritingStyle) body.customWritingStyle = options.customWritingStyle;
  if (options.disabledInsights) body.disabledInsights = options.disabledInsights;
  if (options.enabledInsights) body.enabledInsights = options.enabledInsights;
  if (options.model) body.model = options.model;
  if (options.n) body.n = options.n;
  if (options.language) body.language = options.language;
  if (options.salesAsset) body.salesAsset = options.salesAsset;
  if (options.sequenceNumberOfEmails) body.sequenceNumberOfEmails = options.sequenceNumberOfEmails;
  if (options.userCompanyName) body.userCompanyName = options.userCompanyName;
  if (options.userCompanyUrl) body.userCompanyUrl = options.userCompanyUrl;
  if (options.userName) body.userName = options.userName;
  if (options.valueProposition) body.valueProposition = options.valueProposition;
  if (options.wordCount) body.wordCount = options.wordCount;
  if (options.writingStyle) body.writingStyle = options.writingStyle;

  try {
    const result = await autoboundApiRequest(
      `/generate-content/${GENERATE_CONTENT_VERSION}`,
      options.apiKey,
      body
    );

    const response = result as GenerateContentResponse;
    logger.info(
      { contentCount: response.contentList?.length },
      'Content generation completed'
    );

    return response;
  } catch (error) {
    logger.error({ error }, 'Content generation failed');
    throw error;
  }
}

/**
 * Internal implementation of generateInsights
 */
async function generateInsightsInternal(
  options: GenerateInsightsOptions
): Promise<GenerateInsightsResponse> {
  logger.info(
    {
      hasContactEmail: !!options.contactEmail,
      hasContactLinkedin: !!options.contactLinkedinUrl,
      hasCompanyUrl: !!options.contactCompanyUrl,
      insightSubtype: options.insightSubtype,
    },
    'Starting insights generation'
  );

  // Validate required identifiers
  if (!options.contactEmail && !options.contactLinkedinUrl && !options.contactCompanyUrl) {
    throw new Error('At least one of contactEmail, contactLinkedinUrl, or contactCompanyUrl is required');
  }

  // Build request body
  const body: Record<string, unknown> = {};

  if (options.contactEmail) body.contactEmail = options.contactEmail;
  if (options.contactLinkedinUrl) body.contactLinkedinUrl = options.contactLinkedinUrl;
  if (options.contactCompanyUrl) body.contactCompanyUrl = options.contactCompanyUrl;
  if (options.userEmail) body.userEmail = options.userEmail;
  if (options.insightSubtype) body.insightSubtype = options.insightSubtype;

  try {
    const result = await autoboundApiRequest(
      `/generate-insights/${GENERATE_INSIGHTS_VERSION}`,
      options.apiKey,
      body
    );

    const response = result as GenerateInsightsResponse;
    logger.info(
      { insightCount: response.insights?.length },
      'Insights generation completed'
    );

    return response;
  } catch (error) {
    logger.error({ error }, 'Insights generation failed');
    throw error;
  }
}

// ============================================================================
// PROTECTED EXPORTS (WITH CIRCUIT BREAKER + RATE LIMITING)
// ============================================================================

const generateContentWithBreaker = createCircuitBreaker(generateContentInternal, {
  timeout: 30000, // 30 second timeout for content generation
  name: 'autobound.generateContent',
});

/**
 * Generate hyper-personalized sales content (emails, call scripts, messages, etc.)
 *
 * Uses Autobound's AI to create personalized content based on contact information,
 * relevant insights, and your value proposition. Supports multiple content types
 * including emails, LinkedIn messages, SMS, call scripts, and custom formats.
 *
 * @param options - Content generation parameters
 * @returns Generated content with insights and metadata
 *
 * @example
 * // Generate a personalized email
 * const result = await generateContent({
 *   contactEmail: '[email protected]',
 *   userEmail: '[email protected]',
 *   contentType: 'email',
 *   valueProposition: 'We help sales teams automate outreach',
 *   writingStyle: 'challenger_sale'
 * });
 * console.log(result.contentList[0].subject);
 * console.log(result.contentList[0].content);
 *
 * @example
 * // Generate multiple variations
 * const result = await generateContent({
 *   contactLinkedinUrl: 'https://linkedin.com/in/prospect',
 *   userLinkedinUrl: 'https://linkedin.com/in/me',
 *   contentType: 'opener',
 *   n: 3, // Generate 3 variations
 *   wordCount: 50
 * });
 */
export const generateContent = withRateLimit(
  (options: GenerateContentOptions) => generateContentWithBreaker.fire(options),
  rateLimiter
);

const generateInsightsWithBreaker = createCircuitBreaker(generateInsightsInternal, {
  timeout: 20000, // 20 second timeout for insights
  name: 'autobound.generateInsights',
});

/**
 * Generate relevant prospect insights from Autobound's database
 *
 * Retrieves up to 20 actionable insights about a contact or company, including
 * job changes, LinkedIn activity, podcasts, hiring trends, financial data,
 * news events, and more. Useful for research and personalization.
 *
 * @param options - Insights generation parameters
 * @returns Array of insights with metadata
 *
 * @example
 * // Get all insights for a contact
 * const result = await generateInsights({
 *   contactEmail: '[email protected]',
 *   userEmail: '[email protected]'
 * });
 * console.log(result.insights);
 *
 * @example
 * // Get specific insight types
 * const result = await generateInsights({
 *   contactLinkedinUrl: 'https://linkedin.com/in/prospect',
 *   insightSubtype: 'podcast' // Filter for podcast appearances
 * });
 */
export const generateInsights = withRateLimit(
  (options: GenerateInsightsOptions) => generateInsightsWithBreaker.fire(options),
  rateLimiter
);
