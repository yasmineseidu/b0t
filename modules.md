# b0t Modules & Endpoints

Complete reference of all 16 module categories and 140+ integrated services in the b0t platform.

## Table of Contents

- [Ai](#ai)
- [Business](#business)
- [Communication](#communication)
- [Content](#content)
- [Data](#data)
- [Dataprocessing](#dataprocessing)
- [Devtools](#devtools)
- [Ecommerce](#ecommerce)
- [External-apis](#external-apis)
- [Leads](#leads)
- [Mcp](#mcp)
- [Payments](#payments)
- [Productivity](#productivity)
- [Social](#social)
- [Utilities](#utilities)
- [Video](#video)

---

## Ai

**Modules:** 16 | **Total Functions:** 96

### agent-tools-library

#### `getAgentToolsByCategory(categories)`

Get agent tools by category

#### `getAgentTools(toolNames)`

Get specific tools by name

#### `getAllAgentTools()`

Get all agent tools

#### `getMCPAgentTools(mcpServers?)`

Get MCP tools for agents


### ai-agent-stream

#### `streamAgent(options)`

Stream an AI agent with step-by-step tracking

#### `runStreamingAgent(options)`

Convenience function: Stream agent and collect full response

#### `streamSocialAgent(prompt, credentials?, onStep?)`

Convenience function: Stream social media agent

#### `streamCommunicationAgent(prompt, credentials?, onStep?)`

Convenience function: Stream communication agent

#### `streamDataAgent(prompt, credentials?, onStep?)`

Convenience function: Stream data agent


### ai-agent

#### `runAgent(options)`

Run an AI agent with tool access (main export)

#### `runWebAgent(prompt)`

Convenience function: Run agent with web tools (search, fetch content)

#### `runCreativeAgent(prompt)`

Convenience function: Run agent with AI generation tools

#### `runCommunicationAgent(prompt)`

Convenience function: Run agent with communication tools

#### `runUniversalAgent(prompt)`

Convenience function: Run agent with all available tools


### ai-sdk

#### `generateText(options)`

Generate text (main export)

#### `chat(options)`

Execute chat

#### `streamGeneration(options)`

Stream text generation

#### `generateJSON(options)`

Generate structured JSON output

#### `generateFast(prompt, systemPrompt?, apiKey?)`

Convenience functions

#### `generateQuality(prompt, systemPrompt?, apiKey?)`

High quality generation with GPT-4o

#### `generateClaudeFast(prompt, systemPrompt?, apiKey?)`

Fast Claude generation with Haiku

#### `generateClaudeQuality(prompt, systemPrompt?, apiKey?)`

High quality Claude generation with Sonnet


### ai-tools

#### `generateToolsFromModules(options?)`

Generate AI SDK tools from module registry

#### `generateToolsForCategory(categoryName, credentials?)`

Generate tools for a specific category (convenience function)

#### `generateAgentTools(preset, credentials?)`

Generate a focused tool set for common agent use cases

#### `getToolCount(options?)`

Get tool count for a given configuration

#### `listAvailableTools(options?)`

List available tools for a given configuration


### autobound

#### `generateContent(options)`

Generate hyper-personalized sales content (emails, call scripts, messages, etc.)

**Example:**
```typescript
// Generate a personalized email
const result = await generateContent({
  contactEmail: '[email protected]',
  userEmail: '[email protected]',
  contentType: 'email',
  valueProposition: 'We help sales teams automate outreach',
  writingStyle: 'challenger_sale'
});
console.log(result.contentList[0].subject);
console.log(result.contentList[0].content);
```

#### `generateInsights(options)`

Generate relevant prospect insights from Autobound's database

**Example:**
```typescript
// Get all insights for a contact
const result = await generateInsights({
  contactEmail: '[email protected]',
  userEmail: '[email protected]'
});
console.log(result.insights);
```


### chroma

#### `getOrCreateCollection(collectionName, metadata?)`

Create or get a collection (protected)

#### `addDocuments(collectionName, documents)`

Add documents to a collection (protected)

#### `queryDocuments(collectionName, queryTexts, nResults?, where?)`

Query documents from a collection (protected)

#### `deleteDocuments(collectionName, ids)`

Delete documents from a collection (protected)

#### `getDocuments(collectionName, ids)`

Get documents by IDs (protected)

#### `updateDocuments(collectionName, documents)`

Update documents in a collection (protected)

#### `listCollections()`

List all collections (protected)

#### `deleteCollection(collectionName)`

Delete a collection (protected)


### cohere

#### `generate(prompt, model?, maxTokens?, temperature?, stopSequences?)`

Execute generate

#### `embed(texts, model?, inputType?)`

Execute embed

#### `rerank(query, documents, topN?, model?)`

Execute rerank


### heygen-advanced

#### `createCustomAvatar(videoUrl, avatarName)`

Create custom avatar from video (protected)

#### `generateVideo(avatarId, script, voice?, background?)`

Generate video with avatar (protected)

#### `getVideoStatus(videoId)`

Get video status (protected)

#### `listAvatars()`

List available avatars (protected)

#### `listVoices()`

List available voices (protected)

#### `addBackground(videoId, background)`

Add background to video (protected)

#### `translateVideo(videoId, targetLanguage, voiceId?)`

Translate video to another language (protected)

#### `listVideos(limit?, offset?)`

List all videos (protected)


### mubert

#### `generateTrack(tags, duration?, format?)`

Generate track based on mood/genre tags (protected)

#### `generateFromPrompt(prompt, duration?, format?)`

Generate track from prompt (protected)

#### `getTrack(trackId)`

Get track status and download URL (protected)

#### `searchTracks(tags, limit?)`

Search for tracks by tags (protected)

#### `getTags()`

Get available tags/genres (protected)

#### `startStream(tags, bitrate?)`

Start streaming session (protected)

#### `stopStream(sessionId)`

Stop streaming session (protected)


### pinecone

#### `upsertVectors(indexName, vectors, namespace?)`

Upsert vectors into Pinecone index (protected)

#### `queryVectors(indexName, vector, topK?, namespace?, filter?)`

Query vectors from Pinecone index (protected)

#### `deleteVectors(indexName, ids, namespace?)`

Delete vectors from Pinecone index (protected)

#### `deleteNamespace(indexName, namespace)`

Delete all vectors in a namespace (protected)

#### `listIndexes()`

List all indexes (protected)

#### `getIndexStats(indexName)`

Get index statistics (protected)

#### `fetchVectors(indexName, ids, namespace?)`

Fetch vectors by IDs (protected)


### replicate-video

#### `generateVideo(modelVersion, prompt, duration?, additionalInputs?)`

Execute generateVideo

#### `getPrediction(predictionId)`

Execute getPrediction

#### `listModels(query?)`

Execute listModels

#### `getModel(owner, name)`

Execute getModel


### runway-video

#### `generateVideo(prompt, duration?, aspectRatio?, style?)`

Generate video from text prompt (protected)

#### `getGenerationStatus(generationId)`

Get video generation status (protected)

#### `extendVideo(videoUrl, prompt, duration?)`

Extend an existing video (protected)

#### `interpolateFrames(startImageUrl, endImageUrl, frames?)`

Interpolate frames between two images (protected)

#### `upscaleVideo(videoUrl, scale?)`

Upscale video resolution (protected)

#### `imageToVideo(imageUrl, prompt, duration?)`

Generate video from image (protected)

#### `removeBackground(videoUrl)`

Remove background from video (protected)

#### `listGenerations(limit?, offset?)`

List all generations (protected)


### stabilityai

#### `generateImage(prompt, negativePrompt?, width?, height?, samples?, steps?, cfgScale?, engine?)`

Generate image from text prompt (protected)

#### `upscaleImage(imageBase64, width?, height?, engine?)`

Upscale an image (protected)

#### `editImage(imageBase64, maskBase64, prompt, engine?)`

Edit an image using a mask (protected)

#### `removeBackground(imageBase64)`

Remove background from an image (protected)

#### `imageToImage(imageBase64, prompt, strength?, steps?, engine?)`

Image-to-image transformation (protected)

#### `listEngines()`

List available engines/models (protected)

#### `getBalance()`

Get account balance/credits (protected)


### suno

#### `generateMusic(prompt, lyrics?, style?, duration?, instrumental?)`

Generate music from text prompt (protected)

#### `generateSong(lyrics, title, genre?, mood?)`

Generate song with custom lyrics (protected)

#### `getGeneration(generationId)`

Get generation status (protected)

#### `listGenerations(limit?, offset?)`

List all generations (protected)

#### `extendMusic(generationId, duration?)`

Extend/continue existing music (protected)

#### `getCredits()`

Get credits/usage information (protected)

#### `deleteGeneration(generationId)`

Delete a generation (protected)


### weaviate

#### `createObject(className, properties, vector?)`

Create a new object in Weaviate (protected)

#### `queryObjects(className, fields, limit?, nearVector?, where?)`

Query objects from Weaviate (protected)

#### `deleteObject(className, id)`

Delete an object from Weaviate (protected)

#### `updateObject(className, id, properties)`

Update an object in Weaviate (protected)

#### `getObjectById(className, id)`

Get object by ID (protected)

#### `getSchema(className?)`

Get schema for a class (protected)

#### `createClass(classObj)`

Create a new class in schema (protected)

#### `deleteClass(className)`

Delete a class from schema (protected)


---

## Business

**Modules:** 9 | **Total Functions:** 123

### docusign

#### `createEnvelope(envelope)`

Execute createEnvelope

#### `createAndSendEnvelope(emailSubject, documents, signers)`

Create and send envelope (convenience method)

#### `getEnvelopeStatus(envelopeId)`

Get envelope status

#### `listEnvelopes(options?)`

List envelopes

#### `getEnvelopeDocuments(envelopeId)`

Get envelope documents

#### `downloadEnvelopeDocument(envelopeId, documentId)`

Download envelope document

#### `downloadCombinedDocuments(envelopeId)`

Download all envelope documents as combined PDF

#### `getEnvelopeRecipients(envelopeId)`

Get envelope recipients

#### `voidEnvelope(envelopeId, voidedReason)`

Void envelope

#### `resendEnvelope(envelopeId)`

Resend envelope

#### `getEnvelopeAuditEvents(envelopeId)`

Get envelope audit events


### freshbooks

#### `createClient(client)`

Execute createClient

#### `getClient(clientId)`

Get client by ID

#### `updateClient(clientId, updates)`

Update client

#### `listClients(options?)`

List clients

#### `createInvoice(invoice)`

Create invoice

#### `getInvoice(invoiceId)`

Get invoice by ID

#### `updateInvoice(invoiceId, updates)`

Update invoice

#### `listInvoices(options?)`

List invoices

#### `sendInvoice(invoiceId, action?)`

Send invoice

#### `createExpense(expense)`

Create expense

#### `getExpense(expenseId)`

Get expense by ID

#### `createPayment(payment)`

Create payment

#### `getReportsSummary(options?)`

Get financial reports summary


### gohighlevel

#### `createContact(contactData, options?)`

Create a new contact in GoHighLevel

**Example:**
```typescript
const contact = await createContact({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  tags: ['lead', 'website']
}, { accessToken: 'your-token', locationId: 'location-id' });
```

#### `getContact(contactId, options?)`

Get a contact by ID

**Example:**
```typescript
const contact = await getContact('contact-id', { accessToken: 'your-token' });
```

#### `updateContact(contactId, contactData, options?)`

Update an existing contact

**Example:**
```typescript
const contact = await updateContact('contact-id', {
  firstName: 'Jane',
  tags: ['customer', 'vip']
}, { accessToken: 'your-token' });
```

#### `deleteContact(contactId, options?)`

Delete a contact by ID

**Example:**
```typescript
const result = await deleteContact('contact-id', { accessToken: 'your-token' });
```

#### `searchContacts(searchParams, options?)`

Search contacts by various criteria

**Example:**
```typescript
const contacts = await searchContacts({
  locationId: 'location-id',
  query: 'john@example.com',
  limit: 10
}, { accessToken: 'your-token' });
```

#### `getConversations(contactId, options?)`

Get all conversations for a contact

**Example:**
```typescript
const conversations = await getConversations('contact-id', { accessToken: 'your-token' });
```

#### `sendMessage(messageData, options?)`

Send a message to a contact (SMS, Email, or WhatsApp)

**Example:**
```typescript
// Send SMS
const message = await sendMessage({
  contactId: 'contact-id',
  type: 'SMS',
  message: 'Hello from GHL!'
}, { accessToken: 'your-token' });
```

#### `getMessages(conversationId, options?)`

Get all messages from a conversation

**Example:**
```typescript
const messages = await getMessages('conversation-id', {
  accessToken: 'your-token',
  limit: 50
});
```

#### `getCalendars(locationId, options?)`

Get all calendars for a location

**Example:**
```typescript
const calendars = await getCalendars('location-id', { accessToken: 'your-token' });
```

#### `createAppointment(appointmentData, options?)`

Create a new appointment

**Example:**
```typescript
const appointment = await createAppointment({
  calendarId: 'calendar-id',
  contactId: 'contact-id',
  locationId: 'location-id',
  title: 'Consultation',
  startTime: '2025-01-15T10:00:00Z',
  endTime: '2025-01-15T11:00:00Z',
  appointmentStatus: 'confirmed'
}, { accessToken: 'your-token' });
```

#### `getAppointment(appointmentId, options?)`

Get an appointment by ID

**Example:**
```typescript
const appointment = await getAppointment('appointment-id', { accessToken: 'your-token' });
```

#### `updateAppointment(appointmentId, appointmentData, options?)`

Update an existing appointment

**Example:**
```typescript
const appointment = await updateAppointment('appointment-id', {
  appointmentStatus: 'confirmed',
  notes: 'Client confirmed attendance'
}, { accessToken: 'your-token' });
```

#### `getPipelines(locationId, options?)`

Get all sales pipelines for a location

**Example:**
```typescript
const pipelines = await getPipelines('location-id', { accessToken: 'your-token' });
```

#### `createOpportunity(opportunityData, options?)`

Create a new sales opportunity

**Example:**
```typescript
const opportunity = await createOpportunity({
  name: 'New Enterprise Deal',
  pipelineId: 'pipeline-id',
  pipelineStageId: 'stage-id',
  contactId: 'contact-id',
  monetaryValue: 50000,
  status: 'open'
}, { accessToken: 'your-token', locationId: 'location-id' });
```

#### `getOpportunity(opportunityId, options?)`

Get an opportunity by ID

**Example:**
```typescript
const opportunity = await getOpportunity('opportunity-id', { accessToken: 'your-token' });
```

#### `updateOpportunity(opportunityId, opportunityData, options?)`

Update an existing opportunity

**Example:**
```typescript
const opportunity = await updateOpportunity('opportunity-id', {
  pipelineStageId: 'new-stage-id',
  monetaryValue: 75000,
  status: 'won'
}, { accessToken: 'your-token' });
```

#### `deleteOpportunity(opportunityId, options?)`

Delete an opportunity by ID

**Example:**
```typescript
const result = await deleteOpportunity('opportunity-id', { accessToken: 'your-token' });
```

#### `getTags(locationId, options?)`

Get all tags for a location

**Example:**
```typescript
const tags = await getTags('location-id', { accessToken: 'your-token' });
```

#### `addTagToContact(contactId, tagId, options?)`

Add a tag to a contact

**Example:**
```typescript
const result = await addTagToContact('contact-id', 'tag-id', { accessToken: 'your-token' });
```

#### `removeTagFromContact(contactId, tagId, options?)`

Remove a tag from a contact

**Example:**
```typescript
const result = await removeTagFromContact('contact-id', 'tag-id', { accessToken: 'your-token' });
```

#### `getCustomFields(locationId, options?)`

Get all custom fields for a location

**Example:**
```typescript
const fields = await getCustomFields('location-id', { accessToken: 'your-token' });
```

#### `getLocation(locationId, options?)`

Get location details by ID

**Example:**
```typescript
const location = await getLocation('location-id', { accessToken: 'your-token' });
```


### hellosign

#### `createSignatureRequest(request)`

Execute createSignatureRequest

#### `createSignatureRequestFromTemplate(templateId, signers, options?)`

Create signature request with template

#### `getSignatureRequestStatus(signatureRequestId)`

Get signature request status

#### `listSignatureRequests(options?)`

List signature requests

#### `downloadSignedFiles(signatureRequestId, fileType?)`

Download signed files

#### `cancelSignatureRequest(signatureRequestId)`

Cancel signature request

#### `remindSigner(signatureRequestId, emailAddress)`

Remind signer

#### `getEmbeddedSigningUrl(signatureId)`

Get embedded signing URL

#### `getAccountInfo()`

Get account information


### hubspot

#### `createContact(properties)`

Execute createContact

#### `updateContact(contactId, properties)`

Update contact

#### `getContact(contactId, properties?)`

Get contact by ID

#### `searchContacts(filters, limit?)`

Search contacts

#### `createDeal(properties)`

Create deal

#### `updateDeal(dealId, properties)`

Update deal

#### `getDeal(dealId, properties?)`

Get deal by ID

#### `searchDeals(filters, limit?)`

Search deals

#### `createCompany(properties)`

Create company

#### `updateCompany(companyId, properties)`

Update company

#### `getCompany(companyId, properties?)`

Get company by ID

#### `searchCompanies(filters, limit?)`

Search companies

#### `associateContactWithCompany(contactId, companyId)`

Associate contact with company

#### `associateDealWithContact(dealId, contactId)`

Associate deal with contact


### pipedrive

#### `createDeal(deal)`

Execute createDeal

#### `updateDeal(dealId, updates)`

Update deal

#### `getDeal(dealId)`

Get deal by ID

#### `searchDeals(term, limit?)`

Search deals

#### `createPerson(person)`

Create person (contact)

#### `updatePerson(personId, updates)`

Update person

#### `getPerson(personId)`

Get person by ID

#### `searchPersons(term, limit?)`

Search persons

#### `createOrganization(organization)`

Create organization

#### `updateOrganization(organizationId, updates)`

Update organization

#### `getOrganization(organizationId)`

Get organization by ID

#### `searchOrganizations(term, limit?)`

Search organizations

#### `getPipelines()`

Get all pipelines

#### `getPipelineStages(pipelineId)`

Get pipeline stages

#### `createActivity(activity)`

Create activity


### quickbooks

#### `createCustomer(customer)`

Execute createCustomer

#### `getCustomer(customerId)`

Get customer by ID

#### `queryCustomers(query?)`

Query customers

#### `createInvoice(invoice)`

Create invoice

#### `getInvoice(invoiceId)`

Get invoice by ID

#### `queryInvoices(query?)`

Query invoices

#### `sendInvoice(invoiceId, emailAddress)`

Send invoice via email

#### `createPayment(payment)`

Create payment

#### `getPayment(paymentId)`

Get payment by ID

#### `getProfitAndLoss(options?)`

Get profit and loss report

#### `getBalanceSheet(options?)`

Get balance sheet

#### `createItem(item)`

Create item (product/service)

#### `getCompanyInfo()`

Get company info


### salesforce

#### `executeSOQL(query)`

Execute executeSOQL

#### `createLead(lead)`

Execute createLead

#### `updateLead(leadId, updates)`

Update lead

#### `getLead(leadId)`

Get lead by ID

#### `convertLead(leadId, options?)`

Convert lead to account, contact, and opportunity

#### `createOpportunity(opportunity)`

Create opportunity

#### `updateOpportunity(opportunityId, updates)`

Update opportunity

#### `getOpportunity(opportunityId)`

Get opportunity by ID

#### `createAccount(account)`

Create account

#### `updateAccount(accountId, updates)`

Update account

#### `getAccount(accountId)`

Get account by ID

#### `searchSOSL(searchQuery)`

Search records using SOSL (Salesforce Object Search Language)


### xero

#### `createContact(contact)`

Execute createContact

#### `getContact(contactId)`

Get contact by ID

#### `updateContact(contactId, updates)`

Update contact

#### `listContacts(options?)`

List contacts

#### `createInvoice(invoice)`

Create invoice

#### `getInvoice(invoiceId)`

Get invoice by ID

#### `updateInvoice(invoiceId, updates)`

Update invoice

#### `listInvoices(options?)`

List invoices

#### `createPayment(payment)`

Create payment

#### `getPayment(paymentId)`

Get payment by ID

#### `createBankTransaction(transaction)`

Create bank transaction

#### `getProfitAndLoss(options?)`

Get profit and loss report

#### `getBalanceSheet(options?)`

Get balance sheet

#### `getOrganisation()`

Get organisation details


---

## Communication

**Modules:** 15 | **Total Functions:** 94

### discord

#### `sendMessage(options)`

Execute sendMessage

#### `sendText(channelId, content)`

Send simple text message (convenience)

#### `sendEmbed(channelId, embed)`

Send embed message (convenience)

#### `sendFile(channelId, file, filename, content?)`

Send file attachment

#### `addReaction(channelId, messageId, emoji)`

Add reaction to message


### email

#### `sendEmail(options)`

Execute sendEmail

#### `sendTextEmail(from, to, subject, text)`

Send simple text email (convenience function)

#### `sendHtmlEmail(from, to, subject, html)`

Send HTML email (convenience function)


### firebase

#### `sendNotification(options)`

Execute sendNotification

#### `sendToTopic(options)`

Send notification to topic subscribers

#### `sendToDeviceGroup(options)`

Execute sendToDeviceGroup

#### `subscribeToTopic(options)`

Execute subscribeToTopic

#### `unsubscribeFromTopic(options)`

Execute unsubscribeFromTopic

#### `getTokenInfo(token)`

Execute getTokenInfo

#### `sendDataMessage(options)`

Send data-only message (no notification, handled by app)


### freshdesk

#### `createTicket(options)`

Execute createTicket

#### `updateTicket(options)`

Execute updateTicket

#### `addNote(options)`

Execute addNote

#### `addReply(options)`

Execute addReply

#### `getTicket(options)`

Execute getTicket

#### `listTickets(options?)`

Execute listTickets

#### `createContact(options)`

Execute createContact


### gmail

#### `fetchEmails(params)`

Fetch emails from Gmail with filters

#### `addLabels(params)`

Add labels to an email

#### `removeLabels(params)`

Remove labels from an email

#### `markAsRead(params)`

Mark email as read

#### `markAsUnread(params)`

Mark email as unread

#### `moveToTrash(params)`

Move email to trash

#### `archiveEmail(params)`

Archive email (remove from inbox)

#### `getLabels(params)`

Get all available labels


### intercom

#### `sendMessage(options)`

Execute sendMessage

#### `createContact(options)`

Execute createContact

#### `getContact(contactId)`

Execute getContact

#### `addTag(contactId, tagName)`

Execute addTag

#### `getConversations(userId)`

Execute getConversations


### mailchimp

#### `addSubscriber(options)`

Execute addSubscriber

#### `updateSubscriber(options)`

Execute updateSubscriber

#### `removeSubscriber(options)`

Execute removeSubscriber

#### `createCampaign(options)`

Execute createCampaign

#### `sendCampaign(options)`

Execute sendCampaign

#### `getCampaignStats(campaignId)`

Execute getCampaignStats

#### `addTag(options)`

Execute addTag

#### `createTemplate(options)`

Execute createTemplate


### microsoft-teams

#### `sendMessage(options)`

Execute sendMessage


### onesignal

#### `sendNotification(options)`

Execute sendNotification

#### `createSegment(options)`

Execute createSegment

#### `getNotificationStats(notificationId)`

Execute getNotificationStats

#### `cancelNotification(notificationId)`

Execute cancelNotification

#### `viewDevice(playerId)`

Execute viewDevice

#### `editDevice(options)`

Execute editDevice

#### `getAppStats()`

Execute getAppStats


### outlook

#### `fetchEmails(params)`

Fetch emails from Outlook with filters

#### `updateCategories(params)`

Update categories on an email

#### `addCategories(params)`

Add categories to an email (preserves existing)

#### `moveToFolder(params)`

Move email to a folder

#### `markAsRead(params)`

Mark email as read

#### `markAsUnread(params)`

Mark email as unread

#### `moveToTrash(params)`

Move email to deleted items (trash)

#### `getFolders(params)`

Get all mail folders

#### `getCategories(params)`

Get all Outlook categories


### slack

#### `postMessage(options)`

Execute postMessage

#### `sendText(channel, text)`

Send simple text message (convenience)

#### `uploadFile(channel, file, filename, title?)`

Upload file

#### `addReaction(channel, timestamp, emoji)`

React to message


### telegram

#### `sendMessage(options)`

Execute sendMessage

#### `sendText(chatId, text)`

Send simple text message (convenience)

#### `sendMarkdown(chatId, text)`

Send markdown message (convenience)

#### `sendHtml(chatId, text)`

Send HTML message (convenience)

#### `sendPhoto(chatId, photo, caption?, parseMode?)`

Send photo

#### `sendDocument(chatId, document, filename?, caption?)`

Send document/file

#### `editMessageText(chatId, messageId, text, parseMode?)`

Edit message text

#### `deleteMessage(chatId, messageId)`

Delete message

#### `sendToChannel(channelUsername, text, parseMode?)`

Send to channel (convenience for broadcasting)


### twilio

#### `sendSMS(options)`

Execute sendSMS

#### `makeCall(options)`

Execute makeCall

#### `sendWhatsApp(options)`

Execute sendWhatsApp

#### `getMessageStatus(messageSid)`

Execute getMessageStatus

#### `listMessages(options?)`

Execute listMessages

#### `sendMMS(options)`

Send MMS with media attachments

#### `getCallStatus(callSid)`

Execute getCallStatus


### whatsapp

#### `sendMessage(options)`

Execute sendMessage

#### `sendMedia(options)`

Execute sendMedia

#### `sendTemplate(options)`

Execute sendTemplate

#### `getMessageStatus(messageId)`

Execute getMessageStatus

#### `markAsRead(messageId)`

Execute markAsRead

#### `sendLocation(options)`

Execute sendLocation

#### `sendContact(options)`

Execute sendContact


### zendesk

#### `createTicket(options)`

Execute createTicket

#### `updateTicket(options)`

Execute updateTicket

#### `addComment(options)`

Execute addComment

#### `getTicket(options)`

Execute getTicket

#### `searchTickets(options)`

Execute searchTickets

#### `listTickets(options?)`

Execute listTickets

#### `createUser(options)`

Execute createUser


---

## Content

**Modules:** 8 | **Total Functions:** 62

### bannerbear

#### `generateImage(config, templateUid, modifications, metadata?, webhookUrl?)`

Execute generateImage

#### `getImage(config, imageUid)`

Execute getImage

#### `listTemplates(config, page?, limit?, tag?)`

Execute listTemplates

#### `getTemplate(config, templateUid)`

Execute getTemplate

#### `waitForImage(config, imageUid, maxAttempts?, pollInterval?)`

Execute waitForImage

#### `generateVideo(config, movieUid, input, metadata?, webhookUrl?)`

Execute generateVideo

#### `getVideo(config, videoUid)`

Execute getVideo

#### `waitForVideo(config, videoUid, maxAttempts?, pollInterval?)`

Execute waitForVideo

#### `generateImageAndWait(config, templateUid, modifications, metadata?)`

Execute generateImageAndWait


### canva

#### `createDesignFromTemplate(config, templateId, title?)`

Execute createDesignFromTemplate

#### `getDesign(config, designId)`

Execute getDesign

#### `listDesigns(config, options?)`

Execute listDesigns

#### `exportDesign(config, designId, format?, options?)`

Execute exportDesign

#### `getExportJob(config, jobId)`

Execute getExportJob

#### `waitForExport(config, jobId, maxAttempts?, pollInterval?)`

Execute waitForExport

#### `getBrandTemplates(config, options?)`

Execute getBrandTemplates

#### `createAndExportDesign(config, templateId, format?, title?, exportOptions?)`

Execute createAndExportDesign


### figma

#### `getFile(fileKey)`

Execute getFile

#### `listFiles(teamId)`

Execute listFiles

#### `exportNode(fileKey, nodeIds, options?)`

Execute exportNode

#### `getComments(fileKey)`

Execute getComments


### ghost

#### `createPost(config, postData)`

Execute createPost

#### `updatePost(config, postId, postData, updatedAt)`

Execute updatePost

#### `getPosts(config, options?)`

Execute getPosts

#### `getPostById(config, postId, include?)`

Execute getPostById

#### `deletePost(config, postId)`

Execute deletePost

#### `publishPost(config, postId, updatedAt)`

Execute publishPost

#### `unpublishPost(config, postId, updatedAt)`

Execute unpublishPost

#### `createTag(config, tagData)`

Execute createTag


### medium

#### `getUser(config)`

Execute getUser

#### `getUserPublications(config, userId)`

Execute getUserPublications

#### `createPost(config, userId, postData)`

Execute createPost

#### `createPublicationPost(config, publicationId, postData)`

Execute createPublicationPost

#### `getPublicationContributors(config, publicationId)`

Execute getPublicationContributors

#### `validateToken(config)`

Execute validateToken

#### `createDraft(config, userId, postData)`

Execute createDraft


### pexels

#### `searchPhotos(config, query, options?)`

Execute searchPhotos

#### `getCuratedPhotos(config, options?)`

Execute getCuratedPhotos

#### `getPhotoById(config, photoId)`

Execute getPhotoById

#### `searchVideos(config, query, options?)`

Execute searchVideos

#### `getPopularVideos(config, options?)`

Execute getPopularVideos

#### `getVideoById(config, videoId)`

Execute getVideoById

#### `downloadPhoto(config, photo, size?)`

Execute downloadPhoto

#### `searchAndDownloadPhoto(config, query, size?)`

Execute searchAndDownloadPhoto


### placid

#### `generateImage(config, templateUuid, layers, options?)`

Execute generateImage

#### `getImage(config, imageUuid)`

Execute getImage

#### `listTemplates(config)`

Execute listTemplates

#### `getTemplate(config, templateUuid)`

Execute getTemplate

#### `waitForImage(config, imageUuid, maxAttempts?, pollInterval?)`

Execute waitForImage

#### `generateVideo(config, templateUuid, layers, options?)`

Execute generateVideo

#### `getVideo(config, videoUuid)`

Execute getVideo

#### `waitForVideo(config, videoUuid, maxAttempts?, pollInterval?)`

Execute waitForVideo

#### `generateImageAndWait(config, templateUuid, layers)`

Execute generateImageAndWait

#### `generateVideoAndWait(config, templateUuid, layers, duration?)`

Execute generateVideoAndWait


### unsplash

#### `searchPhotos(config, query, options?)`

Execute searchPhotos

#### `getRandomPhoto(config, options?)`

Execute getRandomPhoto

#### `getPhotoById(config, photoId)`

Execute getPhotoById

#### `trackDownload(config, downloadLocation)`

Execute trackDownload

#### `downloadPhoto(config, photo, size?)`

Execute downloadPhoto

#### `listPhotos(config, options?)`

Execute listPhotos

#### `getPhotoStats(config, photoId)`

Execute getPhotoStats

#### `searchAndDownload(config, query, size?)`

Execute searchAndDownload


---

## Data

**Modules:** 12 | **Total Functions:** 91

### airtable

#### `selectRecords(options)`

Execute selectRecords

#### `createRecord(baseId, tableName, fields)`

Create record

#### `createRecords(baseId, tableName, records)`

Create multiple records (batch)

#### `updateRecord(baseId, tableName, recordId, fields)`

Update record

#### `updateRecords(baseId, tableName, records)`

Update multiple records (batch)

#### `deleteRecord(baseId, tableName, recordId)`

Delete record

#### `deleteRecords(baseId, tableName, recordIds)`

Delete multiple records (batch)

#### `findRecord(baseId, tableName, fieldName, value)`

Find record by field (convenience)


### algolia

#### `search(options)`

Execute search

#### `addObject(object, indexName?)`

Execute addObject

#### `updateObject(objectID, updates, indexName?)`

Execute updateObject

#### `deleteObject(objectID, indexName?)`

Execute deleteObject

#### `batchAddObjects(objects, indexName?)`

Execute batchAddObjects

#### `clearIndex(indexName?)`

Execute clearIndex

#### `setSettings(settings, indexName?)`

Execute setSettings

#### `getSettings(indexName?)`

Execute getSettings


### database

#### `query(params)`

Database Module

#### `queryWhereIn(params)`

Execute queryWhereIn

#### `insert(params)`

Execute insert

#### `update(params)`

Execute update

#### `deleteRecords(params)`

Execute deleteRecords

#### `count(params)`

Execute count

#### `exists(params)`

Execute exists

#### `getOne(params)`

Execute getOne


### drizzle-utils

#### `queryWhereIn(params)`

Query IDs from a table where a column value is in an array

**Example:**
```typescript
// Check which tweet IDs have already been replied to (workflow-scoped)
const repliedIds = await queryWhereIn({
  workflowId: '{{workflowId}}',
  tableName: 'replied_tweets',
  column: 'tweet_id',
  values: ['123', '456', '789']
});
// Returns: ['123', '456'] (if those were found)
// Table used: workflow_storage_{workflowId}_replied_tweets
```

#### `insertRecord(params)`

Insert a single record into a table

**Example:**
```typescript
// Workflow-scoped storage with auto-expiration
await insertRecord({
  workflowId: '{{workflowId}}',
  tableName: 'replied_tweets',
  data: {
    tweet_id: '123456',
    replied_at: new Date(),
    reply_text: 'Great point!'
  },
  expiresInDays: 7
});
// Table: workflow_storage_{workflowId}_replied_tweets
// Auto-deleted after 7 days
```

#### `insertRecords(params)`

Insert multiple records into a table (bulk insert)

#### `updateRecord(params)`

Update a record by ID

#### `deleteRecord(params)`

Delete a record by ID

#### `queryRecords(params)`

Query records with a simple WHERE clause


### gamma

#### `generateGamma(options)`

Generate a new Gamma presentation, document, webpage, or social post

**Example:**
```typescript
const generation = await generateGamma({
  inputText: '# My Presentation

## Slide 1
Content here',
  format: 'presentation',
  numCards: 10,
  textOptions: { amount: 'medium', language: 'en' }
});
console.log('Generation ID:', generation.generationId);
```

#### `getGenerationStatus(options)`

Check the status of a Gamma generation

**Example:**
```typescript
const status = await getGenerationStatus({
  generationId: 'gen_abc123'
});
if (status.status === 'completed') {
  console.log('Gamma URL:', status.gammaUrl);
}
```

#### `waitForCompletion(options)`

Wait for a Gamma generation to complete

**Example:**
```typescript
const generation = await generateGamma({ inputText: '...' });
const completed = await waitForCompletion({
  generationId: generation.generationId,
  maxRetries: 60,  // 5 minutes max
  retryDelayMs: 5000  // Check every 5 seconds
});
console.log('View your gamma:', completed.gammaUrl);
```


### google-analytics

#### `runReport(options)`

Execute runReport

#### `getRealtimeReport(options)`

Execute getRealtimeReport

#### `getMetadata()`

Execute getMetadata

#### `getTopPages(dateRange, limit?)`

Convenience function: Get top pages

#### `getTopEvents(dateRange, limit?)`

Convenience function: Get top events


### google-drive

#### `listFiles(options)`

Execute listFiles

#### `uploadFile(fileName, fileContent, parentId?, mimeType?)`

Execute uploadFile

#### `deleteFile(fileId)`

Execute deleteFile

#### `getFile(fileId)`

Execute getFile


### google-sheets

#### `getRows(spreadsheetId, sheetTitle?, options?)`

Execute getRows

#### `addRow(spreadsheetId, data, sheetTitle?)`

Add row to sheet

#### `addRows(spreadsheetId, rows, sheetTitle?)`

Add multiple rows to sheet

#### `updateRow(spreadsheetId, rowIndex, data, sheetTitle?)`

Update row by index (0-based, excluding header)

#### `deleteRow(spreadsheetId, rowIndex, sheetTitle?)`

Delete row by index (0-based, excluding header)

#### `clearSheet(spreadsheetId, sheetTitle?)`

Clear all rows (keep headers)

#### `getCellValue(spreadsheetId, cellAddress, sheetTitle?)`

Get cell value

#### `setCellValue(spreadsheetId, cellAddress, value, sheetTitle?)`

Set cell value

#### `queryRows(spreadsheetId, filterColumn, filterValue, sheetTitle?)`

Query rows with filter (simple filter on one column)


### mongodb

#### `insertOne(uri, database, collectionName, document)`

Insert one document

#### `insertMany(uri, database, collectionName, documents)`

Insert many documents

#### `find(uri, database, collectionName, filter?, options?)`

Find documents

#### `findOne(uri, database, collectionName, filter)`

Find one document

#### `updateOne(uri, database, collectionName, filter, update)`

Update one document

#### `updateMany(uri, database, collectionName, filter, update)`

Update many documents

#### `deleteOne(uri, database, collectionName, filter)`

Delete one document

#### `deleteMany(uri, database, collectionName, filter)`

Delete many documents

#### `count(uri, database, collectionName, filter?)`

Count documents

#### `aggregate(uri, database, collectionName, pipeline)`

Aggregate documents

#### `createIndex(uri, database, collectionName, keys, options?)`

Create index

#### `dropCollection(uri, database, collectionName)`

Drop collection

#### `closeAll()`

Close all connections


### mysql

#### `query(connection, sql, params?)`

Execute SQL query

#### `select(connection, table, options?)`

Select rows

#### `insert(connection, table, data)`

Insert row

#### `insertMany(connection, table, rows)`

Insert multiple rows

#### `update(connection, table, data, where)`

Update rows

#### `deleteRows(connection, table, where)`

Delete rows

#### `transaction(connection, queries)`

Execute transaction

#### `count(connection, table, where?)`

Count rows

#### `tableExists(connection, table)`

Check if table exists

#### `closeAll()`

Close all pools


### notion

#### `queryDatabase(options)`

Execute queryDatabase

#### `createPage(options)`

Execute createPage

#### `updatePage(pageId, properties)`

Update page properties

#### `retrievePage(pageId)`

Retrieve page

#### `retrievePageContent(pageId)`

Retrieve page content (blocks)

#### `appendToPage(pageId, blocks)`

Append content to page


### postgresql

#### `query(connection, sql, params?)`

Execute SQL query

#### `select(connection, table, options?)`

Select rows

#### `insert(connection, table, data)`

Insert row

#### `insertMany(connection, table, rows)`

Insert multiple rows

#### `update(connection, table, data, where)`

Update rows

#### `deleteRows(connection, table, where)`

Delete rows

#### `transaction(connection, queries)`

Execute transaction

#### `count(connection, table, where?)`

Count rows

#### `tableExists(connection, table)`

Check if table exists

#### `queryJson(connection, table, jsonColumn, jsonPath, value?)`

Execute raw JSON query (for JSONB columns)

#### `closeAll()`

Close all pools


---

## Dataprocessing

**Modules:** 7 | **Total Functions:** 46

### bigquery

#### `runQuery(query, options?, config?)`

Execute runQuery

#### `loadData(datasetId, tableId, sourceUri, sourceFormat?, config?)`

Execute loadData

#### `createDataset(datasetId, location?, config?)`

Execute createDataset

#### `getJobResults(jobId, config?)`

Execute getJobResults

#### `listDatasets(config?)`

Execute listDatasets

#### `listTables(datasetId, config?)`

Execute listTables

#### `insertRows(datasetId, tableId, rows, config?)`

Execute insertRows


### huggingface

#### `runInference(modelId, inputs, options?, config?)`

Execute runInference

#### `listModels(filters?, config?)`

Execute listModels

#### `getModelInfo(modelId, config?)`

Execute getModelInfo

#### `generateText(modelId, prompt, parameters?, config?)`

Execute generateText

#### `classifyText(modelId, text, config?)`

Execute classifyText

#### `answerQuestion(modelId, question, context, config?)`

Execute answerQuestion

#### `classifyImage(modelId, imageUrl, config?)`

Execute classifyImage


### kafka

#### `produceMessage(topic, messages, config?)`

Execute produceMessage

#### `createTopic(topic, topicConfig?, config?)`

Execute createTopic

#### `getTopicInfo(topic, config?)`

Execute getTopicInfo

#### `listTopics(config?)`

Execute listTopics

#### `deleteTopic(topic, config?)`

Execute deleteTopic

#### `listConsumerGroups(config?)`

Execute listConsumerGroups


### rabbitmq

#### `publishMessage(message, options?, config?)`

Execute publishMessage

#### `createQueue(queueName, queueConfig?, config?)`

Execute createQueue

#### `getQueueInfo(queueName, config?)`

Execute getQueueInfo

#### `createExchange(exchangeName, exchangeConfig, config?)`

Execute createExchange

#### `bindQueue(queueName, exchangeName, routingKey?, config?)`

Execute bindQueue

#### `deleteQueue(queueName, config?)`

Execute deleteQueue

#### `purgeQueue(queueName, config?)`

Execute purgeQueue


### redshift

#### `executeQuery(query, parameters?, config?)`

Execute executeQuery

#### `loadData(tableName, s3Path, iamRole, options?, config?)`

Execute loadData

#### `createTable(tableName, definition, config?)`

Execute createTable

#### `getQueryResults(queryId, config?)`

Execute getQueryResults

#### `listTables(schema?, config?)`

Execute listTables

#### `vacuumTable(tableName, options?, config?)`

Execute vacuumTable


### replicate

#### `runPrediction(modelVersion, input, config?)`

Execute runPrediction

#### `getPrediction(predictionId, config?)`

Execute getPrediction

#### `cancelPrediction(predictionId, config?)`

Execute cancelPrediction

#### `listModels(config?)`

Execute listModels

#### `getModelInfo(owner, name, config?)`

Execute getModelInfo

#### `waitForPrediction(predictionId, maxWaitTime?, pollInterval?, config?)`

Execute waitForPrediction

#### `runAndWait(modelVersion, input, maxWaitTime?, config?)`

Run prediction and wait for completion (convenience function)


### snowflake

#### `executeQuery(query, binds?, config?)`

Execute executeQuery

#### `loadData(tableName, stagePath, fileFormat, config?)`

Execute loadData

#### `createTable(tableName, definition, config?)`

Execute createTable

#### `getQueryResults(queryId, config?)`

Execute getQueryResults

#### `listTables(database?, schema?, config?)`

Execute listTables

#### `dropTable(tableName, ifExists?, config?)`

Execute dropTable


---

## Devtools

**Modules:** 9 | **Total Functions:** 85

### circleci

#### `triggerPipeline(projectSlug, options?)`

Execute triggerPipeline

#### `getPipeline(pipelineId)`

Get pipeline

#### `listPipelines(projectSlug, options?)`

List project pipelines

#### `getPipelineWorkflows(pipelineId)`

Get pipeline workflows

#### `getWorkflow(workflowId)`

Get workflow details

#### `cancelWorkflow(workflowId)`

Cancel workflow

#### `rerunWorkflow(workflowId, options?)`

Rerun workflow

#### `listWorkflowJobs(workflowId)`

List workflow jobs

#### `getProject(projectSlug)`

Get project details (requires project slug format: vcs-slug/org-name/repo-name)


### datadog

#### `sendMetrics(metrics)`

Execute sendMetrics

#### `sendMetric(metricName, value, options?)`

Send single metric (convenience function)

#### `createEvent(event)`

Execute createEvent

#### `queryMetrics(query, from, to)`

Query metrics

#### `sendLogs(logs)`

Send logs

#### `sendLog(message, options?)`

Send single log (convenience function)

#### `getSLOs()`

Get service level objectives (SLOs)

#### `getMonitors(options?)`

Get monitors

#### `incrementCounter(metricName, increment?, tags?)`

Increment counter metric (convenience function)

#### `setGauge(metricName, value, tags?)`

Set gauge metric (convenience function)


### github-actions

#### `triggerWorkflow(owner, repo, workflowId, ref, inputs?)`

Execute triggerWorkflow

#### `getWorkflowRun(owner, repo, runId)`

Get workflow run

#### `listWorkflowRuns(owner, repo, workflowId?, options?)`

List workflow runs

#### `listWorkflows(owner, repo, per_page?)`

List workflows

#### `cancelWorkflowRun(owner, repo, runId)`

Cancel workflow run

#### `rerunWorkflow(owner, repo, runId)`

Rerun workflow

#### `listWorkflowArtifacts(owner, repo, runId)`

List workflow run artifacts

#### `getWorkflowRunLogs(owner, repo, runId)`

Get workflow run logs URL


### github

#### `createIssue(options)`

Execute createIssue

#### `updateIssue(owner, repo, issueNumber, options)`

Update issue

#### `listIssues(owner, repo, options?)`

List issues

#### `createPullRequest(owner, repo, options)`

Create pull request

#### `listPullRequests(owner, repo, state?)`

List pull requests

#### `createRelease(owner, repo, options)`

Create release

#### `getRepository(owner, repo)`

Get repository

#### `searchRepositories(query, sort?, per_page?)`

Search repositories

#### `addIssueComment(owner, repo, issueNumber, body)`

Add comment to issue

#### `getTrendingRepositories(options?)`

Get trending repositories


### heroku

#### `createApp(name?, options?)`

Execute createApp

#### `getAppInfo(appName)`

Get app info

#### `listApps()`

List apps

#### `deleteApp(appName)`

Delete app

#### `deployApp(appName, sourceUrl, version?)`

Create build (deploy)

#### `getBuildStatus(appName, buildId)`

Get build status

#### `getLogs(appName, options?)`

Get logs

#### `scaleDynos(appName, dynoType, quantity, size?)`

Scale dynos

#### `listDynos(appName)`

List dynos

#### `getConfigVars(appName)`

Get config vars

#### `updateConfigVars(appName, configVars)`

Update config vars

#### `restartApp(appName)`

Restart app


### jenkins

#### `triggerBuild(jobName, parameters?)`

Execute triggerBuild

#### `getBuildStatus(jobName, buildNumber)`

Get build status

#### `getLastBuild(jobName)`

Get last build

#### `getJobInfo(jobName)`

Get job info

#### `getConsoleOutput(jobName, buildNumber)`

Get console output

#### `stopBuild(jobName, buildNumber)`

Stop build

#### `listJobs()`

List jobs

#### `getQueueItem(queueId)`

Get queue item


### netlify

#### `createDeployment(siteId, options?)`

Execute createDeployment

#### `getSite(siteId)`

Get site

#### `listSites(options?)`

List sites

#### `listDeploys(siteId, options?)`

List deploys

#### `getDeploy(deployId)`

Get deploy

#### `cancelDeploy(deployId)`

Cancel deploy

#### `restoreDeploy(siteId, deployId)`

Restore deploy (roll back to a previous deploy)

#### `getDeployLog(deployId)`

Get deploy log

#### `triggerDeploy(siteId)`

Trigger new deploy (rebuild)


### sentry

#### `listIssues(projectSlug, options?)`

Execute listIssues

#### `getIssue(issueId)`

Get issue

#### `updateIssue(issueId, update)`

Update issue (resolve, ignore, etc.)

#### `resolveIssue(issueId)`

Resolve issue (convenience function)

#### `deleteIssue(issueId)`

Delete issue

#### `listIssueEvents(issueId, limit?)`

List events for an issue

#### `getLatestEvent(issueId)`

Get latest event for issue

#### `listProjects()`

List projects

#### `getProject(projectSlug)`

Get project

#### `getProjectStats(projectSlug, stat?, since?, until?)`

Get project stats

#### `bulkUpdateIssues(issueIds, update)`

Bulk update issues


### vercel

#### `createDeployment(name, files, options?)`

Execute createDeployment

#### `getDeployment(deploymentId)`

Get deployment

#### `listDeployments(options?)`

List deployments

#### `deleteDeployment(deploymentId)`

Delete deployment

#### `getDeploymentLogs(deploymentId, options?)`

Get deployment logs

#### `listProjects(limit?)`

List projects

#### `getProject(projectId)`

Get project

#### `cancelDeployment(deploymentId)`

Cancel deployment


---

## Ecommerce

**Modules:** 7 | **Total Functions:** 70

### amazon-sp

#### `listProducts(params?)`

List products in Amazon catalog

#### `getProduct(asin)`

Get product details by ASIN

#### `updateInventory(sku, quantity)`

Update inventory quantity for a SKU

#### `getOrders(params?)`

Get orders with optional filters

#### `getOrder(orderId)`

Get a single order by ID

#### `getOrderItems(orderId)`

Get items for a specific order

#### `getInventory(params?)`

Get inventory summaries

#### `createReport(reportType)`

Create a report (for analytics, inventory, etc.)

#### `getReport(reportId)`

Get report status and details

#### `getSalesMetrics(params?)`

Get sales metrics and order statistics


### ebay

#### `createInventoryItem(item)`

Create or update an inventory item

#### `createOffer(offer)`

Create an offer for an inventory item

#### `publishOffer(offerId)`

Publish an offer to create a live listing

#### `getInventoryItem(sku)`

Get an inventory item by SKU

#### `listInventoryItems(params?)`

List all inventory items

#### `updateInventory(sku, quantity)`

Update inventory quantity for a SKU

#### `getOrders(params?)`

Get orders with optional filters

#### `getOrder(orderId)`

Get a single order by ID

#### `fulfillOrder(orderId, trackingNumber?)`

Mark an order as fulfilled/shipped

#### `getAnalytics(params?)`

Get sales analytics (revenue, orders, etc.)


### etsy

#### `createListing(listing)`

Create a new listing on Etsy

#### `updateListing(listingId, updates)`

Update an existing Etsy listing

#### `getListing(listingId)`

Get a single listing by ID

#### `listListings(params?)`

List listings with optional filters

#### `deleteListing(listingId)`

Delete a listing by ID

#### `getOrders(params?)`

Get orders/receipts with optional filters

#### `getOrder(receiptId)`

Get a single order by receipt ID

#### `updateInventory(listingId, inventory)`

Update inventory for a listing

#### `getInventory(listingId)`

Get inventory for a listing

#### `getShopStats(params?)`

Get shop statistics (revenue, orders, etc.)


### printful

#### `createProduct(externalId, name, variants)`

Create a new sync product in Printful

#### `submitOrder(recipient, items, externalId?)`

Submit a new order to Printful for fulfillment

#### `getShippingRates(recipient, items)`

Calculate shipping rates for an order

#### `getProduct(productId)`

Get a single sync product by ID

#### `listProducts(params?)`

List sync products with optional pagination

#### `deleteProduct(productId)`

Delete a sync product by ID

#### `getOrder(orderId)`

Get a single order by ID

#### `listOrders(params?)`

List orders with optional filters

#### `getCatalogProduct(productId)`

Get a product from the Printful catalog

#### `getCatalogVariant(variantId)`

Get a product variant from the Printful catalog


### shopify

#### `createProduct(product)`

Create a new product in Shopify

#### `updateProduct(productId, updates)`

Update an existing Shopify product

#### `getProduct(productId)`

Get a single product by ID

#### `listProducts(params?)`

List products with optional filters

#### `deleteProduct(productId)`

Delete a product by ID

#### `getOrder(orderId)`

Get a single order by ID

#### `listOrders(params?)`

List orders with optional filters

#### `createCustomer(customer)`

Create a new customer

#### `updateInventory(inventoryItemId, locationId, availableQuantity)`

Update inventory levels for a product variant

#### `getAnalytics(params?)`

Get store analytics (revenue, orders, average order value)


### square

#### `createProduct(product)`

Create a new product in Square catalog

#### `updateProduct(productId, updates)`

Update an existing Square product

#### `getProduct(productId)`

Get a single product by ID

#### `listProducts(params?)`

List all products in catalog

#### `deleteProduct(productId)`

Delete a product by ID

#### `processPayment(payment)`

Process a payment

#### `getTransactions(params?)`

Get transactions for a location

#### `createCustomer(customer)`

Create a new customer

#### `createOrder(order)`

Create a new order

#### `getRevenueReport(params?)`

Get revenue report with transaction statistics


### woocommerce

#### `createProduct(product)`

Create a new product in WooCommerce

#### `updateProduct(productId, updates)`

Update an existing WooCommerce product

#### `getProduct(productId)`

Get a single product by ID

#### `listProducts(params?)`

List products with optional filters

#### `deleteProduct(productId)`

Delete a product by ID

#### `getOrder(orderId)`

Get a single order by ID

#### `listOrders(params?)`

List orders with optional filters

#### `updateOrderStatus(orderId, status)`

Update order status

#### `createCustomer(customer)`

Create a new customer

#### `getSalesReport(params?)`

Get sales report with revenue and order statistics


---

## External-apis

**Modules:** 3 | **Total Functions:** 15

### hackernews

#### `getTopStories(options)`

Get top stories from HackerNews

#### `getNewStories(options)`

Get new stories from HackerNews

#### `getBestStories(options)`

Get best stories from HackerNews

#### `getAskStories(options)`

Get Ask HN stories

#### `getShowStories(options)`

Get Show HN stories

#### `getJobStories(options)`

Get job postings from HackerNews

#### `getStoryDetails(options)`

Get story details by ID

#### `getUserDetails(options)`

Get user details by username


### rapidapi-newsapi

#### `getTrendingNews(params)`

Get trending news articles

**Example:**
```typescript
const articles = await getTrendingNews({ apiKey: "YOUR_KEY", topic: "technology", limit: 10 });
```

#### `getArticleContent(params)`

Get full article content

**Example:**
```typescript
const article = await getArticleContent({ apiKey: "YOUR_KEY", articleUrl: "https://..." });
```

#### `getSupportedTopics(params)`

Get supported news topics with subtopics

**Example:**
```typescript
const topics = await getSupportedTopics({ apiKey: "YOUR_KEY" });
```

#### `getSupportedLanguages(params)`

Get supported languages for news

**Example:**
```typescript
const languages = await getSupportedLanguages({ apiKey: "YOUR_KEY" });
```

#### `getSupportedCountries(params)`

Get supported countries with their languages

**Example:**
```typescript
const countries = await getSupportedCountries({ apiKey: "YOUR_KEY" });
```

#### `getNewsSummaryForAI(params)`

Get AI-formatted summary of trending news

**Example:**
```typescript
const { summary, selectedArticle } = await getNewsSummaryForAI({ apiKey: "YOUR_KEY", topic: "ai" });
```


### rapidapi-twitter

#### `searchTwitter(params)`

Search Twitter using RapidAPI

**Example:**
```typescript
const results = await searchTwitter({ query: "AI tools", apiKey: "YOUR_KEY", count: 20 });
```


---

## Leads

**Modules:** 8 | **Total Functions:** 61

### apify

#### `runActor(params)`

Execute runActor

#### `getActorRun(params)`

Execute getActorRun

#### `getDatasetItems(params)`

Execute getDatasetItems

#### `listActors(params)`

Execute listActors

#### `waitForRun(params)`

Execute waitForRun

#### `runActorAndWait(params)`

Execute runActorAndWait

#### `getKeyValueStoreItem(params)`

Execute getKeyValueStoreItem

#### `abortActorRun(params)`

Execute abortActorRun


### apollo

#### `searchPeople(params)`

Execute searchPeople

#### `enrichContact(params)`

Execute enrichContact

#### `getCompanyInfo(params)`

Execute getCompanyInfo

#### `createContact(params)`

Execute createContact

#### `searchCompanies(params)`

Execute searchCompanies

#### `getEmail(params)`

Execute getEmail

#### `getJobPostings(params)`

Execute getJobPostings


### clearbit

#### `enrichPerson(params)`

Execute enrichPerson

#### `enrichCompany(params)`

Execute enrichCompany

#### `revealCompany(params)`

Execute revealCompany

#### `getCombinedEnrichment(params)`

Execute getCombinedEnrichment

#### `autocompleteCompany(params)`

Execute autocompleteCompany

#### `findPersonByName(params)`

Execute findPersonByName

#### `getCompanyLogo(domain)`

Get logo URL for a domain

#### `validateDomain(domain)`

Validate domain format


### hunter

#### `findEmail(params)`

Execute findEmail

#### `verifyEmail(params)`

Execute verifyEmail

#### `domainSearch(params)`

Execute domainSearch

#### `getEmailCount(params)`

Execute getEmailCount

#### `bulkVerify(params)`

Execute bulkVerify

#### `getAccountInfo(params)`

Execute getAccountInfo

#### `searchLeads(params)`

Execute searchLeads

#### `validateEmailFormat(email)`

Validate email format (client-side, no API call)


### lusha

#### `enrichContact(params)`

Execute enrichContact

#### `findEmail(params)`

Execute findEmail

#### `findPhone(params)`

Execute findPhone

#### `bulkEnrich(params)`

Execute bulkEnrich

#### `enrichCompany(params)`

Execute enrichCompany

#### `enrichFromLinkedIn(params)`

Execute enrichFromLinkedIn

#### `getCreditBalance(params)`

Execute getCreditBalance


### phantombuster

#### `launchPhantom(params)`

Execute launchPhantom

#### `getPhantomStatus(params)`

Execute getPhantomStatus

#### `getPhantomOutput(params)`

Execute getPhantomOutput

#### `listPhantoms(params)`

Execute listPhantoms

#### `stopPhantom(params)`

Execute stopPhantom

#### `getAgent(params)`

Execute getAgent

#### `launchAndWait(params)`

Execute launchAndWait

#### `getAgentCsvOutput(params)`

Execute getAgentCsvOutput


### proxycurl

#### `getProfile(params)`

Execute getProfile

#### `getCompany(params)`

Execute getCompany

#### `searchPeople(params)`

Execute searchPeople

#### `getPosts(params)`

Execute getPosts

#### `getContactInfo(params)`

Execute getContactInfo

#### `getCompanyEmployees(params)`

Execute getCompanyEmployees

#### `resolveProfileFromEmail(params)`

Execute resolveProfileFromEmail

#### `searchCompanies(params)`

Execute searchCompanies


### zoominfo

#### `searchContacts(params)`

Execute searchContacts

#### `enrichCompany(params)`

Execute enrichCompany

#### `getTechnographics(params)`

Execute getTechnographics

#### `getContactDetails(params)`

Execute getContactDetails

#### `searchCompanies(params)`

Execute searchCompanies

#### `getIntentData(params)`

Execute getIntentData

#### `getScoops(params)`

Execute getScoops


---

## Mcp

**Modules:** 1 | **Total Functions:** 5

### mcp-manager

#### `connectToMCPServers(params)`

Connect to multiple MCP servers

#### `disconnectMCPServers(params)`

Disconnect from MCP servers

#### `listMCPServers()`

List all configured MCP servers

#### `getMCPServersStatus()`

Get status of connected MCP servers

#### `isMCPServerConnected(params)`

Check if an MCP server is connected


---

## Payments

**Modules:** 1 | **Total Functions:** 10

### stripe

#### `createCustomer(email, name?, metadata?)`

Execute createCustomer

#### `getCustomer(customerId)`

Get customer

#### `createPaymentIntent(amount, currency?, customerId?, metadata?)`

Create payment intent

#### `confirmPaymentIntent(paymentIntentId, paymentMethod)`

Confirm payment intent

#### `createRefund(paymentIntentId, amount?, reason?)`

Create refund

#### `createSubscription(customerId, priceId, metadata?)`

Create subscription

#### `cancelSubscription(subscriptionId, cancelAtPeriodEnd?)`

Cancel subscription

#### `listCustomerSubscriptions(customerId)`

List customer subscriptions

#### `createInvoice(customerId, metadata?)`

Create invoice

#### `listPayments(customerId?, limit?)`

List payments (charges)


---

## Productivity

**Modules:** 4 | **Total Functions:** 28

### calendar

#### `createEvent(accessToken, calendarId?, event)`

Execute createEvent

#### `updateEvent(accessToken, calendarId?, eventId, event)`

Execute updateEvent

#### `deleteEvent(accessToken, calendarId?, eventId)`

Execute deleteEvent

#### `getEvent(accessToken, calendarId?, eventId)`

Execute getEvent

#### `listEvents(accessToken, calendarId?, options?)`

Execute listEvents

#### `getUpcomingEvents(accessToken, calendarId?, maxResults?)`

Get upcoming events

#### `searchEvents(accessToken, query, calendarId?, maxResults?)`

Search events by query

#### `getEventsInRange(accessToken, startDate, endDate, calendarId?)`

Get events in date range

#### `createQuickEvent(accessToken, summary, startDate, endDate, options?)`

Create quick event (simpler interface)

#### `parseICalEvent(icalString)`

Parse iCal format to CalendarEvent

#### `convertToICal(event)`

Convert CalendarEvent to iCal format


### calendly

#### `getCurrentUser()`

Execute getCurrentUser

#### `listEventTypes(userUri)`

Execute listEventTypes

#### `listEvents(userUri, options?)`

Execute listEvents

#### `getEvent(eventUri)`

Execute getEvent

#### `cancelEvent(eventUri, reason?)`

Execute cancelEvent


### linear

#### `createIssue(issue)`

Execute createIssue

#### `updateIssue(issueId, update)`

Execute updateIssue

#### `getIssue(issueId)`

Execute getIssue

#### `searchIssues(options?)`

Execute searchIssues

#### `addComment(comment)`

Execute addComment

#### `updateIssueStatus(issueId, stateId)`

Execute updateIssueStatus

#### `assignIssue(issueId, assigneeId)`

Execute assignIssue

#### `createProject(project)`

Execute createProject


### typeform

#### `getForm(formId)`

Execute getForm

#### `listForms()`

Execute listForms

#### `getResponses(formId, options?)`

Execute getResponses

#### `createForm(title, fields)`

Execute createForm


---

## Social

**Modules:** 6 | **Total Functions:** 35

### instagram

#### `replyToInstagramDM(senderId, message)`

Reply to an Instagram DM (Protected)


### linkedin

#### `getProfile()`

Execute getProfile

#### `createPost(text, visibility?)`

Execute createPost

#### `getPost(postId)`

Execute getPost

#### `getComments(postId)`

Execute getComments

#### `addComment(postId, message)`

Execute addComment


### reddit

#### `submitPost(options)`

Execute submitPost

#### `commentOnPost(postId, text)`

Comment on post

#### `replyToComment(commentId, text)`

Reply to comment

#### `getSubredditPosts(subreddit, sort?, limit?)`

Get posts from subreddit (works without authentication using public API)

#### `searchPosts(query, subreddit?, limit?)`

Search posts

#### `upvotePost(postId)`

Upvote post

#### `downvotePost(postId)`

Downvote post


### twitter-oauth

#### `replyToTweet(params)`

Execute replyToTweet

#### `createTweet(params)`

Execute createTweet

#### `createThread(params)`

Execute createThread


### twitter

#### `createTweet(text)`

Execute createTweet

#### `replyToTweet(tweetId, text)`

Execute replyToTweet

#### `getUserTimeline(userId, maxResults?)`

Execute getUserTimeline

#### `searchTweets(query, maxResults?)`

Execute searchTweets

#### `createThread(tweets)`

Execute createThread


### youtube

#### `postComment(videoId, text, channelId)`

Post a top-level comment on a video

#### `deleteComment(commentId)`

Delete a comment

#### `getOurChannelId()`

Get our own channel ID

#### `getVideoDetails(videoId)`

Get video details

#### `searchVideos(query, maxResults?)`

Search for videos

#### `getChannelDetails(channelId?)`

Get channel details

#### `markCommentAsSpam(commentId)`

Mark comment as spam

#### `setCommentModerationStatus(commentId, status)`

Set comment moderation status

#### `getComment(commentId)`

Get comment by ID

#### `getYouTubeAuthUrl()`

Helper to generate OAuth URL for initial setup

#### `getTokensFromCode(code)`

Exchange authorization code for tokens

#### `searchVideosWithApiKey(query, apiKey, maxResults?)`

Search for videos using API key (read-only, no OAuth required)

#### `getVideoDetailsWithApiKey(videoId, apiKey)`

Get video details using API key (read-only, no OAuth required)

#### `getChannelDetailsWithApiKey(channelId, apiKey)`

Get channel details using API key (read-only, no OAuth required)


---

## Utilities

**Modules:** 31 | **Total Functions:** 421

### aggregation

#### `groupAndAggregate(items, groupField, aggregations)`

Execute groupAndAggregate

#### `percentile(numbers, percent)`

Execute percentile

#### `median(numbers)`

Execute median

#### `variance(numbers)`

Execute variance

#### `stdDeviation(numbers)`

Execute stdDeviation

#### `mode(items)`

Execute mode

#### `summarize(items, field)`

Execute summarize


### approval

#### `createApprovalRequest(options)`

Create an approval request

#### `getApprovalRequest(requestId)`

Get approval request by ID

#### `submitApproval(requestId, approver, decision, comment?)`

Submit approval or rejection

#### `waitForApproval(requestId, options?)`

Wait for approval decision with polling

#### `cancelApproval(requestId, reason?)`

Cancel a pending approval request

#### `listApprovalRequests(filters)`

List approval requests with filters

#### `getApprovalStats(workflowId?)`

Get approval statistics

#### `generateApprovalWebhookUrl(requestId, approver, decision, baseUrl)`

Generate approval webhook URL

#### `cleanupExpiredApprovals()`

Cleanup expired approval requests


### array-utils

#### `first(arr, count?)`

Array Utilities Module

#### `last(arr, count?)`

Get last N items from array

#### `unique(arr)`

Get unique values from array

#### `flatten(arr, depth?)`

Flatten nested arrays

#### `chunk(arr, size)`

Chunk array into smaller arrays of specified size

#### `shuffle(arr)`

Shuffle array randomly

#### `random(arr)`

Get random item from array

#### `sample(arr, count)`

Get random N items from array

#### `compact(arr)`

Remove falsy values from array

#### `intersection(...arrays)`

Get intersection of multiple arrays

#### `union(...arrays)`

Get union of multiple arrays (unique values from all)

#### `difference(arr1, arr2)`

Get difference between two arrays (items in first but not in second)

#### `sortNumbers(arr, order?)`

Sort array of numbers

#### `sortStrings(arr, order?)`

Sort array of strings

#### `sortBy(arr, key, order?)`

Sort array of objects by property

#### `groupBy(arr, key)`

Group array of objects by property

#### `countBy(arr)`

Count occurrences of each value

#### `sum(arr)`

Get sum of numbers in array

#### `average(arr)`

Get average of numbers in array

#### `min(arr)`

Get minimum value

#### `max(arr)`

Get maximum value

#### `median(arr)`

Get median value

#### `pluck(arr, key)`

Pluck property values from array of objects

#### `filterBy(arr, key, value)`

Filter array by property value

#### `findBy(arr, key, value)`

Find item by property value

#### `isEmpty(arr)`

Check if array is empty

#### `reverse(arr)`

Reverse array

#### `zip(...arrays)`

Zip multiple arrays together

#### `zipToObjects(fieldArrays)`

Zip multiple arrays into array of objects

**Example:**
```typescript
zipToObjects({
  id: [1, 2, 3],
  name: ['Alice', 'Bob', 'Carol'],
  age: [25, 30, 35]
})
// Returns: [
//   { id: 1, name: 'Alice', age: 25 },
//   { id: 2, name: 'Bob', age: 30 },
//   { id: 3, name: 'Carol', age: 35 }
// ]
```

#### `partition(arr, predicate)`

Partition array into two based on predicate

#### `removeAt(arr, index)`

Remove item at index

#### `insertAt(arr, index, item)`

Insert item at index

#### `replaceAt(arr, index, item)`

Replace item at index

#### `rotate(arr, positions)`

Rotate array by N positions

#### `range(start, end, step?)`

Create range of numbers

#### `fill(length, value)`

Fill array with value

#### `repeat(pattern, times)`

Create array from repeating pattern

#### `forEach(_options)`

Transform array by applying a module to each item

#### `mapWithModule(options)`

Transform array by mapping each item through a module


### batching

#### `paginate(items, pageSize, pageNumber)`

Batching and Pagination Utilities Module

#### `createBatches(items, batchSize)`

Split an array into batches

#### `processBatchesSequentially(batches, delayMs)`

Process batches sequentially with delays

#### `chunkArray(array, size)`

Chunk array into smaller arrays

#### `getAllPages(items, pageSize)`

Get all pages from an array

#### `getPaginationMetadata(items, pageSize, pageNumber)`

Get pagination metadata

#### `paginateWithMetadata(items, pageSize, pageNumber)`

Paginate with metadata


### compression

#### `compressGzip(data)`

Compress string with GZIP

#### `decompressGzip(data)`

Decompress GZIP data

#### `compressDeflate(data)`

Compress with Deflate

#### `decompressDeflate(data)`

Decompress Deflate data

#### `compressBrotli(data)`

Compress with Brotli

#### `decompressBrotli(data)`

Decompress Brotli data

#### `createZip(outputPath, files)`

Create ZIP archive

#### `extractZip(zipPath, outputDir)`

Extract ZIP archive

#### `listZipContents(zipPath)`

List ZIP archive contents

#### `compressFileGzip(inputPath, outputPath)`

Compress file with GZIP

#### `decompressFileGzip(inputPath, outputPath)`

Decompress GZIP file

#### `compressDirectory(directoryPath, outputPath)`

Compress directory to ZIP

#### `getCompressionRatio(originalSize, compressedSize)`

Get compression ratio

#### `compressToBase64(data)`

Compress string to base64 GZIP

#### `decompressFromBase64(base64)`

Decompress base64 GZIP string


### control-flow

#### `coalesce(...values)`

Control Flow Utilities Module

#### `defaultValue(value, defaultVal)`

Return value or default if value is null/undefined

#### `conditional(condition, trueVal, falseVal)`

Ternary conditional helper

#### `switchCase(value, cases, defaultCase)`

Switch/case pattern helper

#### `retry(fn, maxAttempts?, delayMs?)`

Retry a function with exponential backoff

#### `timeout(fn, timeoutMs?)`

Execute timeout

#### `sleep(ms)`

Sleep/delay for specified milliseconds

#### `isTruthy(value)`

Check if value is truthy

#### `isFalsy(value)`

Check if value is falsy

#### `isNullOrUndefined(value)`

Check if value is null or undefined

#### `isDefined(value)`

Check if value is defined (not null or undefined)

#### `ifElse(condition, ifTrue, ifFalse)`

If-else branching with explicit true/false paths

**Example:**
```typescript
ifElse(score > 90, "A", "B")
```

#### `partitionByCondition(items, field, operator, value)`

Filter array and execute different logic based on condition

**Example:**
```typescript
partitionByCondition(items, "score", ">", 80) => {matched: [...], unmatched: [...]}
```

#### `tryCatch(attemptValue, errorValue, errorCheck?)`

Try-catch error handling wrapper

**Example:**
```typescript
tryCatch(result, {error: "Failed"})
```


### csv

#### `parseCsv(csvString, options?)`

Parse CSV string to array of objects

#### `stringifyCsv(data, options?)`

Generate CSV string from array of objects

#### `parseCsvWithTransform(csvString, transform, options?)`

Parse CSV with custom transformations

#### `filterCsv(data, predicate)`

Filter CSV data

#### `mapCsvColumns(data, columnMap)`

Map CSV columns

#### `selectCsvColumns(data, columns)`

Select specific CSV columns

#### `sortCsv(data, sortKey, direction?)`

Sort CSV data

#### `groupCsvBy(data, groupKey)`

Group CSV data by key

#### `csvToJson(csvString, options?)`

Convert CSV to JSON

#### `jsonToCsv(jsonString, options?)`

Convert JSON to CSV


### datetime

#### `formatDate(date, formatString)`

Date/Time Utilities Module

#### `parseDate(dateString, formatString, referenceDate?)`

Parse a date string

#### `addTime(date, duration)`

Add time to a date

#### `subtractTime(date, duration)`

Subtract time from a date

#### `isAfterDate(date, dateToCompare)`

Check if date is after another date

#### `isBeforeDate(date, dateToCompare)`

Check if date is before another date

#### `isEqualDate(date, dateToCompare)`

Check if two dates are equal

#### `getDaysDifference(dateLeft, dateRight)`

Get difference between dates in days

#### `getHoursDifference(dateLeft, dateRight)`

Get difference between dates in hours

#### `getMinutesDifference(dateLeft, dateRight)`

Get difference between dates in minutes

#### `getStartOfDay(date)`

Get start of day (00:00:00)

#### `getEndOfDay(date)`

Get end of day (23:59:59.999)

#### `getStartOfWeek(date)`

Get start of week

#### `getEndOfWeek(date)`

Get end of week

#### `getStartOfMonth(date)`

Get start of month

#### `getEndOfMonth(date)`

Get end of month

#### `addDays(date, days)`

Add days to a date

#### `addHours(date, hours)`

Add hours to a date

#### `addMinutes(date, minutes)`

Add minutes to a date

#### `subDays(date, days)`

Subtract days from a date

#### `subHours(date, hours)`

Subtract hours from a date

#### `subMinutes(date, minutes)`

Subtract minutes from a date

#### `getDistanceInWords(date, baseDate?)`

Format distance between dates in words (e.g., "3 days ago")

#### `getRelativeTime(date, baseDate?)`

Format date relative to now (e.g., "last Friday at 2:26 PM")

#### `isValidDate(date)`

Check if date is valid

#### `fromISO(isoString)`

Parse ISO 8601 string to Date

#### `toISO(date)`

Format Date to ISO 8601 string

#### `now()`

Get current timestamp

#### `unixTimestamp()`

Get current Unix timestamp (seconds since epoch)

#### `timestamp()`

Get current timestamp in milliseconds


### deduplication

#### `deduplicateBy(params)`

Deduplication Module

#### `deduplicateByMultiple(params)`

Execute deduplicateByMultiple

#### `findDuplicates(params)`

Execute findDuplicates

#### `excludeByIds(params)`

Execute excludeByIds

#### `uniqueValues(params)`

Execute uniqueValues


### encryption

#### `generateAESKey(length?)`

Generate AES encryption key

#### `generateIV()`

Generate initialization vector (IV)

#### `encryptAES(data, options)`

Encrypt data with AES

#### `decryptAES(encrypted, iv, options)`

Decrypt data with AES

#### `generateRSAKeyPair(modulusLength?)`

Generate RSA key pair

#### `encryptRSA(data, publicKey)`

Encrypt with RSA public key

#### `decryptRSA(encrypted, privateKey)`

Decrypt with RSA private key

#### `hashSHA256(data)`

Hash data with SHA-256

#### `hashSHA512(data)`

Hash data with SHA-512

#### `hashMD5(data)`

Hash data with MD5 (not secure, for checksums only)

#### `generateHMAC(data, secret, algorithm?)`

Generate HMAC signature

#### `verifyHMAC(data, signature, secret, algorithm?)`

Verify HMAC signature

#### `generateRandomString(length, charset?)`

Generate random string

#### `generateUUID()`

Generate UUID v4

#### `generateToken(bytes?)`

Generate secure random token

#### `hashPassword(password, salt?, iterations?)`

Hash password with PBKDF2

#### `verifyPassword(password, hash, salt, iterations?)`

Verify password hash

#### `generateSalt(bytes?)`

Generate salt for password hashing

#### `secureCompare(a, b)`

Constant-time string comparison (prevent timing attacks)

#### `encodeBase64(data)`

Encode to base64

#### `decodeBase64(data)`

Decode from base64

#### `encodeBase64Url(data)`

Encode to base64url (URL-safe)

#### `decodeBase64Url(data)`

Decode from base64url

#### `generateChecksum(data, algorithm?)`

Generate checksum for data

#### `verifyChecksum(data, checksum, algorithm?)`

Verify checksum

#### `signData(data, privateKey)`

Sign data with private key

#### `verifySignature(data, signature, publicKey)`

Verify signature with public key


### error-recovery

#### `tryCatch(options)`

Try/catch pattern with fallback

#### `retry(options)`

Retry with exponential backoff

#### `addToDeadLetterQueue(operation, data, error, options?)`

Add item to dead letter queue

#### `getDeadLetterQueue(filters?)`

Get dead letter queue items

#### `removeFromDeadLetterQueue(itemId)`

Remove item from dead letter queue

#### `retryDeadLetterItem(itemId, retryFn)`

Retry dead letter queue item

#### `clearDeadLetterQueue(filters?)`

Clear dead letter queue

#### `safeOperation(operation, fn, options?)`

Safe operation wrapper with automatic dead letter queue

#### `catchWhen(fn, conditions, defaultHandler?)`

Conditional error handling

#### `getErrorStats()`

Get error recovery statistics

#### `withTimeout(fn, timeoutMs, timeoutError?)`

Timeout wrapper for operations

#### `ignoreErrors(fn, errorCodesToIgnore, fallback?)`

Ignore specific errors


### filesystem

#### `readFile(filePath, encoding?)`

Read file contents as string

#### `readFileBuffer(filePath)`

Read file contents as Buffer

#### `writeFile(filePath, content, encoding?)`

Write string content to file

#### `writeFileBuffer(filePath, buffer)`

Write Buffer to file

#### `appendFile(filePath, content, encoding?)`

Append content to file

#### `deleteFile(filePath)`

Delete file

#### `fileExists(filePath)`

Check if file exists

#### `getFileStats(filePath)`

Get file stats

#### `copyFile(sourcePath, destPath)`

Copy file

#### `moveFile(sourcePath, destPath)`

Move/rename file

#### `createDirectory(dirPath, recursive?)`

Create directory

#### `listDirectory(dirPath, options?)`

List directory contents

#### `deleteDirectory(dirPath, recursive?)`

Delete directory

#### `copyDirectory(sourcePath, destPath)`

Copy directory

#### `getFileExtension(filePath)`

Get file extension

#### `getFileName(filePath)`

Get file name without extension

#### `getDirectoryName(filePath)`

Get directory name

#### `joinPaths(...paths)`

Join paths

#### `resolvePath(...paths)`

Resolve absolute path

#### `streamCopyFile(sourcePath, destPath)`

Stream copy file (for large files)

#### `readFileLines(filePath)`

Read file line by line

#### `writeFileLines(filePath, lines)`

Write lines to file


### filtering

#### `filterArrayByCondition(items, field, operator, value)`

Execute filterArrayByCondition

#### `findItemByCondition(items, field, operator, value)`

Execute findItemByCondition

#### `containsAll(array, searchValues)`

Execute containsAll

#### `containsAny(array, searchValues)`

Execute containsAny

#### `textMatches(text, pattern, caseSensitive?)`

Execute textMatches

#### `filterByMultiple(items, options)`

Execute filterByMultiple


### http

#### `httpRequest(config)`

Execute httpRequest

#### `httpGet(url, config?)`

Convenience methods for common HTTP verbs

#### `httpPost(url, data?, config?)`

Execute httpPost

#### `httpPut(url, data?, config?)`

Execute httpPut

#### `httpPatch(url, data?, config?)`

Execute httpPatch

#### `httpDelete(url, config?)`

Execute httpDelete


### image

#### `resizeImage(input, options)`

Resize image

#### `convertImageFormat(input, options)`

Convert image format

#### `optimizeImage(input, quality?)`

Optimize image for web

#### `generateThumbnail(input, size?)`

Generate thumbnail

#### `cropImage(input, x, y, width, height)`

Crop image

#### `addWatermark(input, watermark, position?)`

Add watermark to image

#### `getImageMetadata(input)`

Get image metadata

#### `rotateImage(input, angle)`

Rotate image

#### `flipImage(input, direction?)`

Flip image

#### `blurImage(input, sigma?)`

Apply blur to image

#### `sharpenImage(input, sigma?)`

Sharpen image

#### `toGrayscale(input)`

Convert image to grayscale


### javascript

#### `execute(options)`

Execute custom JavaScript code in a sandboxed environment

#### `executeWithPackages(options)`

Execute JavaScript with access to common npm packages

#### `evaluateExpression(options)`

Evaluate a JavaScript expression and return the result

#### `mapArray(options)`

Transform an array using custom JavaScript

#### `filterArray(options)`

Filter an array using custom JavaScript condition

#### `reduceArray(options)`

Reduce an array to a single value using custom JavaScript

#### `executeAsync(options)`

Execute async JavaScript code in a worker thread


### json-transform

#### `queryJson(data, path)`

JSON Transformation Module

#### `queryJsonFirst(data, path)`

Get first match from JSONPath query

#### `deepClone(obj)`

Deep clone an object

#### `deepMerge(target, ...sources)`

Deep merge two objects

#### `get(obj, path, defaultValue?)`

Get value from nested object using dot notation

**Example:**
```typescript
get({ user: { name: 'John' } }, 'user.name') => 'John'
```

#### `set(obj, path, value)`

Set value in nested object using dot notation

**Example:**
```typescript
set({}, 'user.name', 'John') => { user: { name: 'John' } }
```

#### `pick(obj, keys)`

Pick specific keys from object

#### `omit(obj, keys)`

Omit specific keys from object

#### `mapKeys(obj, mapper)`

Map object keys

#### `mapValues(obj, mapper)`

Map object values

#### `filterObject(obj, predicate)`

Filter object by predicate

#### `flatten(obj, separator?, prefix?)`

Flatten nested object to dot notation

**Example:**
```typescript
flatten({ a: { b: { c: 1 } } }) => { 'a.b.c': 1 }
```

#### `unflatten(obj, separator?)`

Unflatten dot notation object to nested

**Example:**
```typescript
unflatten({ 'a.b.c': 1 }) => { a: { b: { c: 1 } } }
```

#### `parseJson(jsonString, fallback?)`

Safe JSON parse with fallback

#### `stringifyJson(data, pretty?)`

Safe JSON stringify

#### `deleteNestedValue(obj, path)`

Delete value from nested object using dot notation

**Example:**
```typescript
deleteNestedValue({ user: { name: 'John', age: 30 } }, 'user.age') => { user: { name: 'John' } }
```


### math

#### `add(a, b)`

Math Utilities Module

#### `subtract(a, b)`

Subtract two numbers

#### `multiply(a, b)`

Multiply two numbers

#### `divide(a, b)`

Divide two numbers

#### `round(value, decimals?)`

Round a number to specified decimal places

#### `floor(value)`

Round a number down to the nearest integer

#### `ceil(value)`

Round a number up to the nearest integer

#### `abs(value)`

Get the absolute value of a number

#### `percentage(value, total)`

Calculate percentage

#### `clamp(value, min, max)`

Clamp a number between min and max values

#### `max(...numbers)`

Get the maximum of two or more numbers

#### `min(...numbers)`

Get the minimum of two or more numbers

#### `power(base, exponent)`

Calculate power (a to the power of b)

#### `sqrt(value)`

Calculate square root

#### `modulo(a, b)`

Calculate modulo (remainder after division)

#### `isEven(value)`

Check if a number is even

#### `isOdd(value)`

Check if a number is odd

#### `degreesToRadians(degrees)`

Convert degrees to radians

#### `radiansToDegrees(radians)`

Convert radians to degrees

#### `randomBetween(min, max)`

Generate a random number between min and max (inclusive)

#### `randomIntBetween(min, max)`

Generate a random integer between min and max (inclusive)


### parallel

#### `parallelAll(tasks, options?)`

Run all tasks in parallel and wait for all to complete

#### `parallelRace(tasks, options?)`

Race multiple tasks - return the first one to complete

#### `parallelAny(tasks, options?)`

Wait for the first N tasks to complete

#### `parallelMap(items, fn, options?)`

Map an array with concurrent processing

#### `parallelBatch(tasks, options?)`

Execute tasks in batches with concurrency control

#### `retryFailedTasks(results, taskMap, options?)`

Retry failed tasks from parallel execution

#### `getParallelStats(results)`

Get summary statistics from parallel results


### pdf

#### `parsePdf(input)`

Parse PDF and extract all text

#### `extractText(input)`

Extract only text from PDF

#### `getMetadata(input)`

Get PDF metadata

#### `getPageCount(input)`

Get page count

#### `searchInPdf(input, searchText, caseSensitive?)`

Search for text in PDF

#### `extractTextByLine(input)`

Extract text by line

#### `extractTextByParagraph(input)`

Extract text by paragraph

#### `extractWords(input)`

Extract words from PDF

#### `getWordCount(input)`

Get word count

#### `getCharacterCount(input)`

Get character count


### rss

#### `parseFeed(url)`

Parse RSS feed from URL

#### `parseFeedString(feedString)`

Parse RSS feed from string

#### `getFeedItems(url)`

Get feed items only

#### `getLatestItems(url, limit?)`

Get latest N items from feed

#### `searchFeedItems(url, keyword, searchIn?)`

Search feed items by keyword

#### `filterItemsByDate(url, afterDate, beforeDate?)`

Filter feed items by date

#### `getFeedMetadata(url)`

Get feed metadata

#### `getFeedCategories(url)`

Extract unique categories from feed

#### `getItemsByCategory(url, category)`

Get items by category

#### `getItemsByAuthor(url, author)`

Get items by author


### scheduling

#### `createSchedule(options)`

Create a scheduled task

#### `scheduleOnce(name, workflowId, executeAt, data?)`

Schedule a one-time execution

#### `scheduleRecurring(name, workflowId, interval, options?)`

Schedule a recurring execution

#### `getSchedule(scheduleId)`

Get scheduled task by ID

#### `updateSchedule(scheduleId, updates)`

Update schedule

#### `cancelSchedule(scheduleId)`

Cancel a scheduled task

#### `pauseSchedule(scheduleId)`

Pause a scheduled task

#### `resumeSchedule(scheduleId)`

Resume a paused schedule

#### `markScheduleExecuted(scheduleId)`

Mark schedule as executed and calculate next execution

#### `listSchedules(filters?)`

List scheduled tasks with filters

#### `getDueSchedules(asOf?)`

Get schedules due for execution

#### `getScheduleStats(workflowId?)`

Get schedule statistics

#### `cleanupSchedules(olderThanDays?)`

Cleanup completed and cancelled schedules


### scoring

#### `rankByWeightedScore(params)`

Rank array of objects by weighted score calculation

**Example:**
```typescript
const rankedTweets = await rankByWeightedScore({
  items: tweets,
  scoreFields: [
    { field: "likes", weight: 1 },
    { field: "retweets", weight: 2 },
    { field: "replies", weight: 1.5 },
    { field: "views", weight: 0.001 }
  ],
  tieBreaker: { field: "created_at", order: "desc" }
});
```

#### `calculateScore(params)`

Calculate weighted score for a single item

**Example:**
```typescript
const score = await calculateScore({
  item: tweet,
  scoreFields: [
    { field: "likes", weight: 1 },
    { field: "retweets", weight: 2 }
  ]
});
```

#### `selectTop(params)`

Select top N items from array

**Example:**
```typescript
const topTweet = await selectTop({ items: rankedTweets, count: 1 });
const top5Tweets = await selectTop({ items: rankedTweets, count: 5 });
```

#### `selectBottom(params)`

Select bottom N items from array

**Example:**
```typescript
const lowestRanked = await selectBottom({ items: rankedTweets, count: 1 });
```

#### `selectRandom(params)`

Select random item(s) from array

**Example:**
```typescript
const randomTweet = await selectRandom({ items: tweets, count: 1 });
const random3Tweets = await selectRandom({ items: tweets, count: 3 });
```

#### `rankByField(params)`

Rank items by single field (convenience function)

**Example:**
```typescript
const tweetsByLikes = await rankByField({ items: tweets, field: "likes", order: "desc" });
```

#### `filterByMinScore(params)`

Filter items above a minimum score threshold

**Example:**
```typescript
const popularTweets = await filterByMinScore({
  items: tweets,
  scoreFields: [{ field: "likes", weight: 1 }],
  minScore: 100
});
```


### scraper

#### `fetchHtml(url)`

Fetch and parse HTML from URL

#### `parseHtml(html)`

Parse HTML string

#### `extractText($, selector)`

Extract text content using CSS selector

#### `extractLinks($, baseUrl?, selector?)`

Extract links from page

#### `extractImages($, baseUrl?, selector?)`

Extract images from page

#### `extractMetaTags($)`

Extract meta tags

#### `extractTable($, selector)`

Extract table data

#### `extractAttributes($, selector, attribute)`

Extract attribute values

#### `elementExists($, selector)`

Check if element exists

#### `countElements($, selector)`

Count elements

#### `extractStructuredData($)`

Extract structured data (JSON-LD)


### state-management

#### `saveState(workflowId, key, value, options?)`

Save workflow state

#### `loadState(workflowId, key)`

Load workflow state

#### `getState(workflowId, key)`

Get full state object (including metadata)

#### `updateState(workflowId, key, updates)`

Update state (merge with existing)

#### `deleteState(workflowId, key)`

Delete workflow state

#### `clearWorkflowState(workflowId)`

Clear all state for a workflow

#### `listStateKeys(workflowId)`

List all state keys for a workflow

#### `getAllState(workflowId)`

Get all state for a workflow

#### `hasState(workflowId, key)`

Check if state exists

#### `getStateOrDefault(workflowId, key, defaultValue)`

Get state with default value

#### `getStateHistory(workflowId, key, limit?)`

Get state history

#### `restoreState(workflowId, key, version)`

Restore state to a previous version

#### `incrementState(workflowId, key, amount?)`

Increment numeric state

#### `appendToState(workflowId, key, item)`

Append to array state

#### `cleanupExpiredState()`

Clean up expired state

#### `getStateStats(workflowId?)`

Get state statistics


### string-utils

#### `toSlug(text, options?)`

String Utilities Module

#### `toCamelCase(str)`

Convert string to camelCase

#### `toPascalCase(str)`

Convert string to PascalCase

#### `toSnakeCase(str)`

Convert string to snake_case

#### `toKebabCase(str)`

Convert string to kebab-case

#### `truncate(str, maxLength, suffix?)`

Truncate string to max length

#### `truncateWords(str, maxWords, suffix?)`

Truncate string to max words

#### `stripHtml(str)`

Remove HTML tags from string

#### `escapeHtml(str)`

Escape HTML special characters

#### `capitalize(str)`

Capitalize first letter of string

#### `capitalizeWords(str)`

Capitalize first letter of each word

#### `reverse(str)`

Reverse a string

#### `isEmail(str)`

Check if string is email

#### `isUrl(str)`

Check if string is URL

#### `extractUrls(str)`

Extract URLs from text

#### `extractEmails(str)`

Extract email addresses from text

#### `normalizeWhitespace(str)`

Remove extra whitespace

#### `wordCount(str)`

Count words in string

#### `charCount(str, includeSpaces?)`

Count characters (excluding whitespace)

#### `template(str, variables)`

Simple template string replacement

**Example:**
```typescript
template('Hello {{name}}!', { name: 'World' }) => 'Hello World!'
```

#### `removeAccents(str)`

Remove accents/diacritics from string

#### `randomString(length, chars?)`

Generate random string

#### `mask(str, visibleChars?, maskChar?)`

Mask sensitive data (e.g., credit cards, emails)

**Example:**
```typescript
mask('john@example.com', 4, '*') => 'john****example.com'
```

#### `concat(strings, separator?)`

Concatenate multiple strings together

**Example:**
```typescript
concat(['Hello', 'World'], ' ') => 'Hello World'
concat(['# Title

', 'Content here']) => '# Title

Content here'
```


### transform

#### `renameFields(items, fieldMap)`

Rename multiple fields at once

**Example:**
```typescript
renameFields([{oldName: "John"}], {oldName: "newName"}) → [{newName: "John"}]
```

#### `selectFields(items, fields)`

Select only specified fields from objects

**Example:**
```typescript
selectFields([{id: 1, name: "John", age: 30}], ["id", "name"]) → [{id: 1, name: "John"}]
```

#### `castTypes(items, typeMap)`

Cast field types (string→number, etc.)

**Example:**
```typescript
castTypes([{age: "30"}], {age: "number"}) → [{age: 30}]
```

#### `mergeFields(items, sourceFields, destField, separator?)`

Merge multiple fields into one

**Example:**
```typescript
mergeFields([{first: "John", last: "Doe"}], ["first", "last"], "fullName", " ") → [{first: "John", last: "Doe", fullName: "John Doe"}]
```

#### `splitField(items, field, delimiter, newFields)`

Split a field into multiple fields

**Example:**
```typescript
splitField([{fullName: "John Doe"}], "fullName", " ", ["first", "last"]) → [{fullName: "John Doe", first: "John", last: "Doe"}]
```

#### `defaultValues(items, defaults)`

Fill in default values for missing fields

**Example:**
```typescript
defaultValues([{name: "John"}], {name: "Unknown", age: 0}) → [{name: "John", age: 0}]
```

#### `removeNulls(items)`

Remove null and undefined values from objects

**Example:**
```typescript
removeNulls([{a: 1, b: null, c: undefined, d: 0}]) → [{a: 1, d: 0}]
```

#### `removeEmptyStrings(items)`

Remove empty strings from objects

**Example:**
```typescript
removeEmptyStrings([{a: "hello", b: "", c: "world"}]) → [{a: "hello", c: "world"}]
```

#### `trimStrings(items)`

Trim whitespace from all string fields

**Example:**
```typescript
trimStrings([{name: "  John  ", age: 30}]) → [{name: "John", age: 30}]
```

#### `flattenObjects(items, maxDepth?)`

Flatten nested objects to dot notation

**Example:**
```typescript
flattenObjects([{user: {name: "John", age: 30}}]) → [{"user.name": "John", "user.age": 30}]
```

#### `unflattenObjects(items)`

Unflatten dot notation to nested objects

**Example:**
```typescript
unflattenObjects([{"user.name": "John", "user.age": 30}]) → [{user: {name: "John", age: 30}}]
```

#### `mapFieldValues(items, field, valueMap)`

Map values based on a mapping object

**Example:**
```typescript
mapFieldValues([{status: "active"}], "status", {active: "enabled", inactive: "disabled"}) → [{status: "enabled"}]
```


### validation

#### `validateRequired(data, fields)`

Execute validateRequired

#### `validateTypes(data, typeMap)`

Execute validateTypes

#### `validateLength(value, min?, max?)`

Execute validateLength

#### `validateRange(value, min?, max?)`

Execute validateRange

#### `validatePattern(value, pattern)`

Execute validatePattern

#### `validateEmail(email)`

Execute validateEmail

#### `validateUrl(url)`

Execute validateUrl

#### `isValid(data, rules)`

Execute isValid


### webhook

#### `sendWebhook(request)`

Send webhook request

#### `sendWebhookWithRetry(request, options?)`

Send webhook with retries

#### `generateSignature(payload, options)`

Generate HMAC signature for webhook payload

#### `verifySignature(payload, signature, options)`

Verify HMAC signature for webhook payload

#### `sendJsonWebhook(url, data, options?)`

Send JSON webhook

#### `sendFormWebhook(url, data, options?)`

Send form data webhook

#### `sendSignedWebhook(url, data, signatureOptions, options?)`

Send signed webhook with HMAC

#### `parseWebhookHeaders(headers)`

Parse webhook headers from request

#### `validateWebhookTimestamp(timestamp, toleranceSeconds?)`

Validate webhook timestamp (prevent replay attacks)

#### `buildWebhookUrl(baseUrl, params)`

Create webhook URL with query parameters

#### `sendBatchWebhooks(requests)`

Send batch webhooks (parallel)

#### `sendSequentialWebhooks(requests, options?)`

Send webhooks sequentially


### webhooks-advanced

#### `sendWebhookWithRetry(options)`

Send webhook with automatic retry

#### `sendAuthenticatedWebhook(url, data, auth, options?)`

Send webhook with authentication

#### `sendBatchWebhooksParallel(requests, options?)`

Send batch webhooks in parallel

#### `sendBatchWebhooksSequential(requests, options?)`

Send batch webhooks sequentially

#### `queueWebhookBatch(requests, options?)`

Queue webhook batch for deferred execution

#### `processWebhookBatch(batchId)`

Process queued webhook batch

#### `getWebhookBatch(batchId)`

Get webhook batch status

#### `listWebhookBatches(filters?)`

List webhook batches

#### `validateWebhookResponse(response, validation)`

Validate webhook response

#### `getWebhookHealth(url)`

Get webhook endpoint health

#### `getAllWebhookHealth()`

Get all webhook health statistics

#### `resetWebhookHealth(url?)`

Reset webhook health tracking

#### `sendValidatedWebhook(request, validation)`

Send webhook with response validation

#### `cleanupWebhookBatches(olderThanDays?)`

Clean up old webhook batches

#### `getWebhookStats()`

Get webhook statistics


### xml

#### `parseXml(xmlString, options?)`

Parse XML string to JSON object (fast-xml-parser)

#### `parseXmlCompat(xmlString, options?)`

Parse XML string to JSON object (xml2js - more compatible)

#### `buildXml(jsonObject, options?)`

Convert JSON object to XML string

#### `buildXmlCompat(jsonObject, options?)`

Convert JSON object to XML string (xml2js)

#### `validateXml(xmlString)`

Validate XML string

#### `extractValue(xmlObject, path)`

Extract values by path (simple dot notation)

#### `parseXmlFromUrl(url)`

Parse XML from URL

#### `prettifyXml(xmlString)`

Convert XML to pretty-printed string

#### `minifyXml(xmlString)`

Convert XML to minified string

#### `findByTagName(xmlObject, tagName)`

Find all elements by tag name

#### `flattenAttributes(xmlObject)`

Convert XML attributes to object properties


---

## Video

**Modules:** 8 | **Total Functions:** 62

### cloudinary

#### `uploadVideo(options)`

Execute uploadVideo

#### `transformVideo(options)`

Execute transformVideo

#### `generateThumbnail(options)`

Execute generateThumbnail

#### `convertFormat(options)`

Execute convertFormat

#### `addTextOverlay(options)`

Execute addTextOverlay

#### `deleteVideo(publicId)`

Execute deleteVideo

#### `getVideoDetails(publicId)`

Execute getVideoDetails

#### `listVideos(options?)`

Execute listVideos


### elevenlabs

#### `generateSpeech(options)`

Execute generateSpeech

#### `generateSpeechStream(options)`

Execute generateSpeechStream

#### `listVoices()`

Execute listVoices

#### `getVoiceDetails(voiceId)`

Execute getVoiceDetails

#### `cloneVoice(options)`

Execute cloneVoice

#### `deleteVoice(voiceId)`

Execute deleteVoice

#### `getSubscriptionInfo()`

Execute getSubscriptionInfo

#### `getModels()`

Execute getModels


### heygen

#### `createAvatarVideo(options)`

Execute createAvatarVideo

#### `createCustomAvatarVideo(options)`

Execute createCustomAvatarVideo

#### `getVideoStatus(videoId)`

Execute getVideoStatus

#### `listAvatars()`

Execute listAvatars

#### `listVoices(options?)`

Execute listVoices

#### `deleteVideo(videoId)`

Execute deleteVideo

#### `listVideos(options?)`

Execute listVideos


### runway

#### `generateVideo(options)`

Generate video from text prompt

#### `getGenerationStatus(generationId)`

Get video generation status

#### `extendVideo(options)`

Extend existing video with additional frames

#### `imageToVideo(options)`

Generate video from image

#### `upscaleVideo(options)`

Upscale video to higher resolution

#### `interpolateFrames(options)`

Interpolate frames between two images

#### `removeBackground(videoUrl)`

Remove background from video

#### `cancelGeneration(generationId)`

Cancel a running generation


### synthesia

#### `createVideo(options)`

Execute createVideo

#### `createMultiSceneVideo(options)`

Execute createMultiSceneVideo

#### `getVideoStatus(videoId)`

Execute getVideoStatus

#### `listAvatars()`

Execute listAvatars

#### `listVoices(options?)`

Execute listVoices

#### `deleteVideo(videoId)`

Execute deleteVideo

#### `listVideos(options?)`

Execute listVideos

#### `getQuota()`

Execute getQuota


### tiktok

#### `initializeUpload(options)`

Execute initializeUpload

#### `uploadVideo(options)`

Execute uploadVideo

#### `getVideoInfo(videoId)`

Execute getVideoInfo

#### `getUserVideos(options?)`

Execute getUserVideos

#### `getVideoComments(options)`

Execute getVideoComments

#### `getUserInfo()`

Execute getUserInfo

#### `deleteVideo(videoId)`

Execute deleteVideo

#### `getVideoAnalytics(options)`

Execute getVideoAnalytics


### vimeo

#### `uploadVideo(options)`

Execute uploadVideo

#### `getVideoInfo(videoId)`

Execute getVideoInfo

#### `updateVideo(options)`

Execute updateVideo

#### `deleteVideo(videoId)`

Execute deleteVideo

#### `listVideos(options?)`

Execute listVideos

#### `getEmbedCode(options)`

Execute getEmbedCode

#### `getThumbnail(options)`

Execute getThumbnail

#### `getVideoStats(videoId)`

Execute getVideoStats


### whisper

#### `transcribeAudio(options)`

Execute transcribeAudio

#### `transcribeAudioFromURL(options)`

Execute transcribeAudioFromURL

#### `translateAudio(options)`

Execute translateAudio

#### `translateAudioFromURL(options)`

Execute translateAudioFromURL

#### `detectLanguage(audioFile)`

Execute detectLanguage

#### `transcribeWithSegments(options)`

Execute transcribeWithSegments

#### `generateSubtitles(options)`

Execute generateSubtitles


---

## Summary

- **Total Categories:** 16
- **Total Modules:** 145
- **Total Functions:** 1304

*Generated automatically from module registry*
