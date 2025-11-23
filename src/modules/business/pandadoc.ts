import { z } from 'zod';
import { createCircuitBreaker } from '@/lib/resilience';
import { createRateLimiter, withRateLimit } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

/**
 * PandaDoc Module
 *
 * Document automation platform for proposals, quotes, contracts, and e-signatures
 * - Create and manage documents
 * - Send documents for signature
 * - Use templates for faster creation
 * - Manage contacts and recipients
 * - Track document status and analytics
 * - Handle webhooks for events
 * - Built-in resilience and rate limiting
 *
 * Perfect for:
 * - Sales proposals and quotes
 * - Contract management
 * - E-signature workflows
 * - Document automation
 */

const PANDADOC_API_URL = 'https://api.pandadoc.com/public/v1';

// Rate limiter: PandaDoc has generous rate limits
const pandadocRateLimiter = createRateLimiter({
  maxConcurrent: 5,
  minTime: 100, // 100ms between requests
  id: 'pandadoc',
});

// ============================================================================
// Types and Schemas
// ============================================================================

const apiKeySchema = z.object({
  apiKey: z.string().min(1, 'PandaDoc API key is required'),
});

const documentCreateSchema = z.object({
  apiKey: z.string(),
  name: z.string(),
  templateId: z.string().optional(),
  recipients: z.array(z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.string().default('Client'),
  })),
  tokens: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
  fields: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional(),
});

const documentListSchema = z.object({
  apiKey: z.string(),
  status: z.enum(['document.draft', 'document.sent', 'document.completed', 'document.viewed', 'document.waiting_approval', 'document.rejected', 'document.waiting_pay', 'document.paid', 'document.voided']).optional(),
  tag: z.string().optional(),
  count: z.number().max(100).default(50).optional(),
  page: z.number().default(1).optional(),
  orderBy: z.enum(['date_created', 'date_modified', 'name']).optional(),
});

const documentSendSchema = z.object({
  apiKey: z.string(),
  documentId: z.string(),
  message: z.string().optional(),
  silent: z.boolean().default(false).optional(),
});

const contactCreateSchema = z.object({
  apiKey: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  state: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

const webhookCreateSchema = z.object({
  apiKey: z.string(),
  url: z.string().url(),
  event: z.enum([
    'document_state_changed',
    'recipient_completed',
    'document_created',
    'document_deleted',
    'document_updated',
  ]),
  sharedKey: z.string().optional(),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Make authenticated request to PandaDoc API
 */
async function makePandaDocRequest<T>(
  endpoint: string,
  apiKey: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: unknown
): Promise<T> {
  const url = `${PANDADOC_API_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `API-Key ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  logger.info({ method, endpoint }, 'Making PandaDoc API request');

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PandaDoc API error (${response.status}): ${errorText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  return data as T;
}

// ============================================================================
// Documents API
// ============================================================================

/**
 * Create a new document from template or scratch
 * @example
 * const doc = await createDocument({
 *   apiKey: '{{credential.pandadoc}}',
 *   name: 'Sales Proposal',
 *   templateId: 'abc123',
 *   recipients: [{
 *     email: 'client@example.com',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     role: 'Client'
 *   }],
 *   tokens: [{
 *     name: 'Company.Name',
 *     value: 'Acme Corp'
 *   }]
 * });
 */
async function createDocumentInternal(
  input: z.infer<typeof documentCreateSchema>
): Promise<{ id: string; name: string; status: string; uuid: string }> {
  const validated = documentCreateSchema.parse(input);
  const { apiKey, templateId, folderId, ...rest } = validated;

  // Transform to PandaDoc API format
  const body: Record<string, unknown> = {
    ...rest,
  };

  // Map templateId to template_uuid (PandaDoc API naming)
  if (templateId) {
    body.template_uuid = templateId;
  }

  // Map folderId to parent_folder_uuid (PandaDoc API naming)
  if (folderId) {
    body.parent_folder_uuid = folderId;
  }

  logger.info({ name: rest.name, templateId }, 'Creating PandaDoc document');

  const result = await makePandaDocRequest<{
    id: string;
    name: string;
    status: string;
    uuid: string;
  }>('/documents', apiKey, 'POST', body);

  logger.info({ documentId: result.id }, 'PandaDoc document created');
  return result;
}

const createDocumentWithBreaker = createCircuitBreaker(createDocumentInternal, {
  timeout: 30000,
  name: 'pandadoc-create-document',
});

const createDocumentRateLimited = withRateLimit(
  async (input: z.infer<typeof documentCreateSchema>) => createDocumentWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function createDocument(
  input: z.infer<typeof documentCreateSchema>
): Promise<{ id: string; name: string; status: string; uuid: string }> {
  return await createDocumentRateLimited(input);
}

/**
 * List documents with optional filters
 * @example
 * const docs = await listDocuments({
 *   apiKey: '{{credential.pandadoc}}',
 *   status: 'document.sent',
 *   count: 20
 * });
 */
async function listDocumentsInternal(
  input: z.infer<typeof documentListSchema>
): Promise<{
  results: Array<{
    id: string;
    name: string;
    status: string;
    date_created: string;
    date_modified: string;
  }>;
  count: number;
  next: string | null;
  previous: string | null;
}> {
  const validated = documentListSchema.parse(input);
  const { apiKey, ...params } = validated;

  const queryParams = new URLSearchParams();
  if (params.status) queryParams.set('status', params.status);
  if (params.tag) queryParams.set('tag', params.tag);
  if (params.count) queryParams.set('count', params.count.toString());
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.orderBy) queryParams.set('order_by', params.orderBy);

  const endpoint = `/documents?${queryParams.toString()}`;
  const result = await makePandaDocRequest<{
    results: Array<{
      id: string;
      name: string;
      status: string;
      date_created: string;
      date_modified: string;
    }>;
    count: number;
    next: string | null;
    previous: string | null;
  }>(endpoint, apiKey);

  logger.info({ documentCount: result.count }, 'PandaDoc documents listed');
  return result;
}

const listDocumentsWithBreaker = createCircuitBreaker(listDocumentsInternal, {
  timeout: 15000,
  name: 'pandadoc-list-documents',
});

const listDocumentsRateLimited = withRateLimit(
  async (input: z.infer<typeof documentListSchema>) => listDocumentsWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function listDocuments(input: z.infer<typeof documentListSchema>): Promise<{
  results: Array<{
    id: string;
    name: string;
    status: string;
    date_created: string;
    date_modified: string;
  }>;
  count: number;
  next: string | null;
  previous: string | null;
}> {
  return await listDocumentsRateLimited(input);
}

/**
 * Get document details by ID
 * @example
 * const doc = await getDocument({
 *   apiKey: '{{credential.pandadoc}}',
 *   documentId: 'abc123'
 * });
 */
async function getDocumentInternal(input: {
  apiKey: string;
  documentId: string;
}): Promise<{
  id: string;
  name: string;
  status: string;
  date_created: string;
  date_modified: string;
  recipients: Array<{
    email: string;
    first_name: string;
    last_name: string;
    has_completed: boolean;
  }>;
}> {
  const { apiKey, documentId } = apiKeySchema.extend({ documentId: z.string() }).parse(input);

  logger.info({ documentId }, 'Getting PandaDoc document details');

  const result = await makePandaDocRequest<{
    id: string;
    name: string;
    status: string;
    date_created: string;
    date_modified: string;
    recipients: Array<{
      email: string;
      first_name: string;
      last_name: string;
      has_completed: boolean;
    }>;
  }>(`/documents/${documentId}`, apiKey);

  return result;
}

const getDocumentWithBreaker = createCircuitBreaker(getDocumentInternal, {
  timeout: 15000,
  name: 'pandadoc-get-document',
});

const getDocumentRateLimited = withRateLimit(
  async (input: { apiKey: string; documentId: string }) => getDocumentWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function getDocument(input: { apiKey: string; documentId: string }): Promise<{
  id: string;
  name: string;
  status: string;
  date_created: string;
  date_modified: string;
  recipients: Array<{
    email: string;
    first_name: string;
    last_name: string;
    has_completed: boolean;
  }>;
}> {
  return await getDocumentRateLimited(input);
}

/**
 * Send document to recipients for completion
 * @example
 * const result = await sendDocument({
 *   apiKey: '{{credential.pandadoc}}',
 *   documentId: 'abc123',
 *   message: 'Please review and sign this document'
 * });
 */
async function sendDocumentInternal(
  input: z.infer<typeof documentSendSchema>
): Promise<{ id: string; status: string }> {
  const validated = documentSendSchema.parse(input);
  const { apiKey, documentId, ...body } = validated;

  logger.info({ documentId }, 'Sending PandaDoc document');

  const result = await makePandaDocRequest<{ id: string; status: string }>(
    `/documents/${documentId}/send`,
    apiKey,
    'POST',
    body
  );

  logger.info({ documentId }, 'PandaDoc document sent');
  return result;
}

const sendDocumentWithBreaker = createCircuitBreaker(sendDocumentInternal, {
  timeout: 15000,
  name: 'pandadoc-send-document',
});

const sendDocumentRateLimited = withRateLimit(
  async (input: z.infer<typeof documentSendSchema>) => sendDocumentWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function sendDocument(
  input: z.infer<typeof documentSendSchema>
): Promise<{ id: string; status: string }> {
  return await sendDocumentRateLimited(input);
}

/**
 * Download document as PDF
 * @example
 * const pdf = await downloadDocument({
 *   apiKey: '{{credential.pandadoc}}',
 *   documentId: 'abc123'
 * });
 */
export async function downloadDocument(input: {
  apiKey: string;
  documentId: string;
}): Promise<Blob> {
  const { apiKey, documentId } = apiKeySchema.extend({ documentId: z.string() }).parse(input);

  logger.info({ documentId }, 'Downloading PandaDoc document');

  const url = `${PANDADOC_API_URL}/documents/${documentId}/download`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `API-Key ${apiKey}`,
      'Accept': 'application/pdf',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download document: ${response.statusText}`);
  }

  const blob = await response.blob();
  logger.info({ documentId, size: blob.size }, 'PandaDoc document downloaded');
  return blob;
}

/**
 * Delete a document
 * @example
 * await deleteDocument({
 *   apiKey: '{{credential.pandadoc}}',
 *   documentId: 'abc123'
 * });
 */
async function deleteDocumentInternal(input: {
  apiKey: string;
  documentId: string;
}): Promise<void> {
  const { apiKey, documentId } = apiKeySchema.extend({ documentId: z.string() }).parse(input);

  logger.info({ documentId }, 'Deleting PandaDoc document');

  await makePandaDocRequest<void>(`/documents/${documentId}`, apiKey, 'DELETE');

  logger.info({ documentId }, 'PandaDoc document deleted');
}

const deleteDocumentWithBreaker = createCircuitBreaker(deleteDocumentInternal, {
  timeout: 15000,
  name: 'pandadoc-delete-document',
});

const deleteDocumentRateLimited = withRateLimit(
  async (input: { apiKey: string; documentId: string }) => deleteDocumentWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function deleteDocument(input: { apiKey: string; documentId: string }): Promise<void> {
  return await deleteDocumentRateLimited(input);
}

/**
 * Get document session link for embedded signing
 * @example
 * const session = await createDocumentSession({
 *   apiKey: '{{credential.pandadoc}}',
 *   documentId: 'abc123',
 *   recipientEmail: 'client@example.com',
 *   lifetime: 900
 * });
 */
async function createDocumentSessionInternal(input: {
  apiKey: string;
  documentId: string;
  recipientEmail: string;
  lifetime?: number;
}): Promise<{ id: string; expires_at: string }> {
  const { apiKey, documentId, recipientEmail, lifetime } = z
    .object({
      apiKey: z.string(),
      documentId: z.string(),
      recipientEmail: z.string().email(),
      lifetime: z.number().default(900).optional(),
    })
    .parse(input);

  logger.info({ documentId, recipientEmail }, 'Creating PandaDoc document session');

  const result = await makePandaDocRequest<{ id: string; expires_at: string }>(
    `/documents/${documentId}/session`,
    apiKey,
    'POST',
    { recipient: recipientEmail, lifetime }
  );

  logger.info({ documentId, sessionId: result.id }, 'PandaDoc document session created');
  return result;
}

const createDocumentSessionWithBreaker = createCircuitBreaker(createDocumentSessionInternal, {
  timeout: 15000,
  name: 'pandadoc-create-session',
});

const createDocumentSessionRateLimited = withRateLimit(
  async (input: {
    apiKey: string;
    documentId: string;
    recipientEmail: string;
    lifetime?: number;
  }) => createDocumentSessionWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function createDocumentSession(input: {
  apiKey: string;
  documentId: string;
  recipientEmail: string;
  lifetime?: number;
}): Promise<{ id: string; expires_at: string }> {
  return await createDocumentSessionRateLimited(input);
}

// ============================================================================
// Templates API
// ============================================================================

/**
 * List all templates
 * @example
 * const templates = await listTemplates({
 *   apiKey: '{{credential.pandadoc}}',
 *   count: 20
 * });
 */
async function listTemplatesInternal(input: {
  apiKey: string;
  tag?: string;
  count?: number;
  page?: number;
}): Promise<{
  results: Array<{
    id: string;
    name: string;
    date_created: string;
    date_modified: string;
  }>;
  count: number;
}> {
  const { apiKey, tag, count, page } = z
    .object({
      apiKey: z.string(),
      tag: z.string().optional(),
      count: z.number().max(100).default(50).optional(),
      page: z.number().default(1).optional(),
    })
    .parse(input);

  const queryParams = new URLSearchParams();
  if (tag) queryParams.set('tag', tag);
  if (count) queryParams.set('count', count.toString());
  if (page) queryParams.set('page', page.toString());

  const endpoint = `/templates?${queryParams.toString()}`;
  const result = await makePandaDocRequest<{
    results: Array<{
      id: string;
      name: string;
      date_created: string;
      date_modified: string;
    }>;
    count: number;
  }>(endpoint, apiKey);

  logger.info({ templateCount: result.count }, 'PandaDoc templates listed');
  return result;
}

const listTemplatesWithBreaker = createCircuitBreaker(listTemplatesInternal, {
  timeout: 15000,
  name: 'pandadoc-list-templates',
});

const listTemplatesRateLimited = withRateLimit(
  async (input: {
    apiKey: string;
    tag?: string;
    count?: number;
    page?: number;
  }) => listTemplatesWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function listTemplates(input: {
  apiKey: string;
  tag?: string;
  count?: number;
  page?: number;
}): Promise<{
  results: Array<{
    id: string;
    name: string;
    date_created: string;
    date_modified: string;
  }>;
  count: number;
}> {
  return await listTemplatesRateLimited(input);
}

/**
 * Get template details by ID
 * @example
 * const template = await getTemplate({
 *   apiKey: '{{credential.pandadoc}}',
 *   templateId: 'abc123'
 * });
 */
async function getTemplateInternal(input: {
  apiKey: string;
  templateId: string;
}): Promise<{
  id: string;
  name: string;
  date_created: string;
  date_modified: string;
  tokens: Array<{ name: string }>;
  roles: Array<{ name: string }>;
}> {
  const { apiKey, templateId } = apiKeySchema.extend({ templateId: z.string() }).parse(input);

  logger.info({ templateId }, 'Getting PandaDoc template details');

  const result = await makePandaDocRequest<{
    id: string;
    name: string;
    date_created: string;
    date_modified: string;
    tokens: Array<{ name: string }>;
    roles: Array<{ name: string }>;
  }>(`/templates/${templateId}/details`, apiKey);

  return result;
}

const getTemplateWithBreaker = createCircuitBreaker(getTemplateInternal, {
  timeout: 15000,
  name: 'pandadoc-get-template',
});

const getTemplateRateLimited = withRateLimit(
  async (input: { apiKey: string; templateId: string }) => getTemplateWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function getTemplate(input: { apiKey: string; templateId: string }): Promise<{
  id: string;
  name: string;
  date_created: string;
  date_modified: string;
  tokens: Array<{ name: string }>;
  roles: Array<{ name: string }>;
}> {
  return await getTemplateRateLimited(input);
}

// ============================================================================
// Contacts API
// ============================================================================

/**
 * Create a new contact
 * @example
 * const contact = await createContact({
 *   apiKey: '{{credential.pandadoc}}',
 *   email: 'john@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   company: 'Acme Corp'
 * });
 */
async function createContactInternal(
  input: z.infer<typeof contactCreateSchema>
): Promise<{ id: string; email: string }> {
  const validated = contactCreateSchema.parse(input);
  const { apiKey, ...body } = validated;

  logger.info({ email: body.email }, 'Creating PandaDoc contact');

  const result = await makePandaDocRequest<{ id: string; email: string }>(
    '/contacts',
    apiKey,
    'POST',
    body
  );

  logger.info({ contactId: result.id }, 'PandaDoc contact created');
  return result;
}

const createContactWithBreaker = createCircuitBreaker(createContactInternal, {
  timeout: 15000,
  name: 'pandadoc-create-contact',
});

const createContactRateLimited = withRateLimit(
  async (input: z.infer<typeof contactCreateSchema>) => createContactWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function createContact(
  input: z.infer<typeof contactCreateSchema>
): Promise<{ id: string; email: string }> {
  return await createContactRateLimited(input);
}

/**
 * List all contacts
 * @example
 * const contacts = await listContacts({
 *   apiKey: '{{credential.pandadoc}}',
 *   count: 50
 * });
 */
async function listContactsInternal(input: {
  apiKey: string;
  email?: string;
  count?: number;
  page?: number;
}): Promise<{
  results: Array<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company: string;
  }>;
  count: number;
}> {
  const { apiKey, email, count, page } = z
    .object({
      apiKey: z.string(),
      email: z.string().optional(),
      count: z.number().max(100).default(50).optional(),
      page: z.number().default(1).optional(),
    })
    .parse(input);

  const queryParams = new URLSearchParams();
  if (email) queryParams.set('email', email);
  if (count) queryParams.set('count', count.toString());
  if (page) queryParams.set('page', page.toString());

  const endpoint = `/contacts?${queryParams.toString()}`;
  const result = await makePandaDocRequest<{
    results: Array<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      company: string;
    }>;
    count: number;
  }>(endpoint, apiKey);

  logger.info({ contactCount: result.count }, 'PandaDoc contacts listed');
  return result;
}

const listContactsWithBreaker = createCircuitBreaker(listContactsInternal, {
  timeout: 15000,
  name: 'pandadoc-list-contacts',
});

const listContactsRateLimited = withRateLimit(
  async (input: {
    apiKey: string;
    email?: string;
    count?: number;
    page?: number;
  }) => listContactsWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function listContacts(input: {
  apiKey: string;
  email?: string;
  count?: number;
  page?: number;
}): Promise<{
  results: Array<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company: string;
  }>;
  count: number;
}> {
  return await listContactsRateLimited(input);
}

/**
 * Update a contact
 * @example
 * await updateContact({
 *   apiKey: '{{credential.pandadoc}}',
 *   contactId: 'abc123',
 *   company: 'New Company Inc'
 * });
 */
async function updateContactInternal(input: {
  apiKey: string;
  contactId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
}): Promise<void> {
  const { apiKey, contactId, ...body } = z
    .object({
      apiKey: z.string(),
      contactId: z.string(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      company: z.string().optional(),
      jobTitle: z.string().optional(),
      phone: z.string().optional(),
    })
    .parse(input);

  logger.info({ contactId }, 'Updating PandaDoc contact');

  await makePandaDocRequest<void>(`/contacts/${contactId}`, apiKey, 'PUT', body);

  logger.info({ contactId }, 'PandaDoc contact updated');
}

const updateContactWithBreaker = createCircuitBreaker(updateContactInternal, {
  timeout: 15000,
  name: 'pandadoc-update-contact',
});

const updateContactRateLimited = withRateLimit(
  async (input: {
    apiKey: string;
    contactId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    phone?: string;
  }) => updateContactWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function updateContact(input: {
  apiKey: string;
  contactId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
}): Promise<void> {
  return await updateContactRateLimited(input);
}

/**
 * Delete a contact
 * @example
 * await deleteContact({
 *   apiKey: '{{credential.pandadoc}}',
 *   contactId: 'abc123'
 * });
 */
async function deleteContactInternal(input: {
  apiKey: string;
  contactId: string;
}): Promise<void> {
  const { apiKey, contactId } = apiKeySchema.extend({ contactId: z.string() }).parse(input);

  logger.info({ contactId }, 'Deleting PandaDoc contact');

  await makePandaDocRequest<void>(`/contacts/${contactId}`, apiKey, 'DELETE');

  logger.info({ contactId }, 'PandaDoc contact deleted');
}

const deleteContactWithBreaker = createCircuitBreaker(deleteContactInternal, {
  timeout: 15000,
  name: 'pandadoc-delete-contact',
});

const deleteContactRateLimited = withRateLimit(
  async (input: { apiKey: string; contactId: string }) => deleteContactWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function deleteContact(input: { apiKey: string; contactId: string }): Promise<void> {
  return await deleteContactRateLimited(input);
}

// ============================================================================
// Webhooks API
// ============================================================================

/**
 * Create a webhook subscription
 * @example
 * const webhook = await createWebhook({
 *   apiKey: '{{credential.pandadoc}}',
 *   url: 'https://myapp.com/webhooks/pandadoc',
 *   event: 'document_state_changed'
 * });
 */
async function createWebhookInternal(
  input: z.infer<typeof webhookCreateSchema>
): Promise<{ uuid: string; url: string; event: string }> {
  const validated = webhookCreateSchema.parse(input);
  const { apiKey, ...body } = validated;

  logger.info({ url: body.url, event: body.event }, 'Creating PandaDoc webhook');

  const result = await makePandaDocRequest<{ uuid: string; url: string; event: string }>(
    '/webhook-subscriptions',
    apiKey,
    'POST',
    body
  );

  logger.info({ webhookId: result.uuid }, 'PandaDoc webhook created');
  return result;
}

const createWebhookWithBreaker = createCircuitBreaker(createWebhookInternal, {
  timeout: 15000,
  name: 'pandadoc-create-webhook',
});

const createWebhookRateLimited = withRateLimit(
  async (input: z.infer<typeof webhookCreateSchema>) => createWebhookWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function createWebhook(
  input: z.infer<typeof webhookCreateSchema>
): Promise<{ uuid: string; url: string; event: string }> {
  return await createWebhookRateLimited(input);
}

/**
 * List all webhook subscriptions
 * @example
 * const webhooks = await listWebhooks({
 *   apiKey: '{{credential.pandadoc}}'
 * });
 */
async function listWebhooksInternal(input: {
  apiKey: string;
}): Promise<{
  results: Array<{
    uuid: string;
    url: string;
    event: string;
    active: boolean;
  }>;
}> {
  const { apiKey } = apiKeySchema.parse(input);

  const result = await makePandaDocRequest<{
    results: Array<{
      uuid: string;
      url: string;
      event: string;
      active: boolean;
    }>;
  }>('/webhook-subscriptions', apiKey);

  logger.info({ webhookCount: result.results?.length || 0 }, 'PandaDoc webhooks listed');
  return result;
}

const listWebhooksWithBreaker = createCircuitBreaker(listWebhooksInternal, {
  timeout: 15000,
  name: 'pandadoc-list-webhooks',
});

const listWebhooksRateLimited = withRateLimit(
  async (input: { apiKey: string }) => listWebhooksWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function listWebhooks(input: { apiKey: string }): Promise<{
  results: Array<{
    uuid: string;
    url: string;
    event: string;
    active: boolean;
  }>;
}> {
  return await listWebhooksRateLimited(input);
}

/**
 * Update a webhook subscription
 * @example
 * await updateWebhook({
 *   apiKey: '{{credential.pandadoc}}',
 *   webhookId: 'abc123',
 *   active: false
 * });
 */
async function updateWebhookInternal(input: {
  apiKey: string;
  webhookId: string;
  url?: string;
  active?: boolean;
  sharedKey?: string;
}): Promise<void> {
  const { apiKey, webhookId, ...body } = z
    .object({
      apiKey: z.string(),
      webhookId: z.string(),
      url: z.string().url().optional(),
      active: z.boolean().optional(),
      sharedKey: z.string().optional(),
    })
    .parse(input);

  logger.info({ webhookId }, 'Updating PandaDoc webhook');

  await makePandaDocRequest<void>(`/webhook-subscriptions/${webhookId}`, apiKey, 'PATCH', body);

  logger.info({ webhookId }, 'PandaDoc webhook updated');
}

const updateWebhookWithBreaker = createCircuitBreaker(updateWebhookInternal, {
  timeout: 15000,
  name: 'pandadoc-update-webhook',
});

const updateWebhookRateLimited = withRateLimit(
  async (input: {
    apiKey: string;
    webhookId: string;
    url?: string;
    active?: boolean;
    sharedKey?: string;
  }) => updateWebhookWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function updateWebhook(input: {
  apiKey: string;
  webhookId: string;
  url?: string;
  active?: boolean;
  sharedKey?: string;
}): Promise<void> {
  return await updateWebhookRateLimited(input);
}

/**
 * Delete a webhook subscription
 * @example
 * await deleteWebhook({
 *   apiKey: '{{credential.pandadoc}}',
 *   webhookId: 'abc123'
 * });
 */
async function deleteWebhookInternal(input: {
  apiKey: string;
  webhookId: string;
}): Promise<void> {
  const { apiKey, webhookId } = apiKeySchema.extend({ webhookId: z.string() }).parse(input);

  logger.info({ webhookId }, 'Deleting PandaDoc webhook');

  await makePandaDocRequest<void>(`/webhook-subscriptions/${webhookId}`, apiKey, 'DELETE');

  logger.info({ webhookId }, 'PandaDoc webhook deleted');
}

const deleteWebhookWithBreaker = createCircuitBreaker(deleteWebhookInternal, {
  timeout: 15000,
  name: 'pandadoc-delete-webhook',
});

const deleteWebhookRateLimited = withRateLimit(
  async (input: { apiKey: string; webhookId: string }) => deleteWebhookWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function deleteWebhook(input: { apiKey: string; webhookId: string }): Promise<void> {
  return await deleteWebhookRateLimited(input);
}

// ============================================================================
// Folders API
// ============================================================================

/**
 * List all folders
 * @example
 * const folders = await listFolders({
 *   apiKey: '{{credential.pandadoc}}'
 * });
 */
async function listFoldersInternal(input: {
  apiKey: string;
  parentId?: string;
  count?: number;
  page?: number;
}): Promise<{
  results: Array<{
    uuid: string;
    name: string;
    date_created: string;
    date_modified: string;
  }>;
  count: number;
}> {
  const { apiKey, parentId, count, page } = z
    .object({
      apiKey: z.string(),
      parentId: z.string().optional(),
      count: z.number().max(100).default(50).optional(),
      page: z.number().default(1).optional(),
    })
    .parse(input);

  const queryParams = new URLSearchParams();
  if (parentId) queryParams.set('parent_uuid', parentId);
  if (count) queryParams.set('count', count.toString());
  if (page) queryParams.set('page', page.toString());

  const endpoint = `/documents/folders?${queryParams.toString()}`;
  const result = await makePandaDocRequest<{
    results: Array<{
      uuid: string;
      name: string;
      date_created: string;
      date_modified: string;
    }>;
    count: number;
  }>(endpoint, apiKey);

  logger.info({ folderCount: result.count }, 'PandaDoc folders listed');
  return result;
}

const listFoldersWithBreaker = createCircuitBreaker(listFoldersInternal, {
  timeout: 15000,
  name: 'pandadoc-list-folders',
});

const listFoldersRateLimited = withRateLimit(
  async (input: {
    apiKey: string;
    parentId?: string;
    count?: number;
    page?: number;
  }) => listFoldersWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function listFolders(input: {
  apiKey: string;
  parentId?: string;
  count?: number;
  page?: number;
}): Promise<{
  results: Array<{
    uuid: string;
    name: string;
    date_created: string;
    date_modified: string;
  }>;
  count: number;
}> {
  return await listFoldersRateLimited(input);
}

/**
 * Create a new folder
 * @example
 * const folder = await createFolder({
 *   apiKey: '{{credential.pandadoc}}',
 *   name: 'Sales Proposals 2025'
 * });
 */
async function createFolderInternal(input: {
  apiKey: string;
  name: string;
  parentId?: string;
}): Promise<{ uuid: string; name: string }> {
  const { apiKey, name, parentId } = z
    .object({
      apiKey: z.string(),
      name: z.string(),
      parentId: z.string().optional(),
    })
    .parse(input);

  logger.info({ name }, 'Creating PandaDoc folder');

  const body: { name: string; parent_uuid?: string } = { name };
  if (parentId) body.parent_uuid = parentId;

  const result = await makePandaDocRequest<{ uuid: string; name: string }>(
    '/documents/folders',
    apiKey,
    'POST',
    body
  );

  logger.info({ folderId: result.uuid }, 'PandaDoc folder created');
  return result;
}

const createFolderWithBreaker = createCircuitBreaker(createFolderInternal, {
  timeout: 15000,
  name: 'pandadoc-create-folder',
});

const createFolderRateLimited = withRateLimit(
  async (input: { apiKey: string; name: string; parentId?: string }) => createFolderWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function createFolder(input: {
  apiKey: string;
  name: string;
  parentId?: string
}): Promise<{ uuid: string; name: string }> {
  return await createFolderRateLimited(input);
}

/**
 * Rename a folder
 * @example
 * await renameFolder({
 *   apiKey: '{{credential.pandadoc}}',
 *   folderId: 'abc123',
 *   name: 'Sales Proposals 2026'
 * });
 */
async function renameFolderInternal(input: {
  apiKey: string;
  folderId: string;
  name: string;
}): Promise<void> {
  const { apiKey, folderId, name } = z
    .object({
      apiKey: z.string(),
      folderId: z.string(),
      name: z.string(),
    })
    .parse(input);

  logger.info({ folderId, name }, 'Renaming PandaDoc folder');

  await makePandaDocRequest<void>(`/documents/folders/${folderId}`, apiKey, 'PUT', { name });

  logger.info({ folderId }, 'PandaDoc folder renamed');
}

const renameFolderWithBreaker = createCircuitBreaker(renameFolderInternal, {
  timeout: 15000,
  name: 'pandadoc-rename-folder',
});

const renameFolderRateLimited = withRateLimit(
  async (input: { apiKey: string; folderId: string; name: string }) => renameFolderWithBreaker.fire(input),
  pandadocRateLimiter
);

export async function renameFolder(input: {
  apiKey: string;
  folderId: string;
  name: string;
}): Promise<void> {
  return await renameFolderRateLimited(input);
}
