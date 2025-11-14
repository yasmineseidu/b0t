import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as autobound from '../autobound';

/**
 * Tests for ai/autobound
 *
 * Tests the Autobound API client module for generating
 * hyper-personalized sales content and insights.
 */

// Mock the global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as typeof fetch;

describe('autobound module', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  it('should export required functions', () => {
    expect(autobound.generateContent).toBeDefined();
    expect(autobound.generateInsights).toBeDefined();
    expect(typeof autobound.generateContent).toBe('function');
    expect(typeof autobound.generateInsights).toBe('function');
  });

  describe('generateContent', () => {
    it('should require either contactEmail or contactLinkedinUrl', async () => {
      // Test with missing contact identifier
      await expect(
        autobound.generateContent({
          userEmail: '[email protected]',
          contentType: 'email',
        })
      ).rejects.toThrow('Either contactEmail or contactLinkedinUrl is required');
    });

    it('should require either userEmail or userLinkedinUrl', async () => {
      // Test with missing user identifier
      await expect(
        autobound.generateContent({
          contactEmail: '[email protected]',
          contentType: 'email',
        })
      ).rejects.toThrow('Either userEmail or userLinkedinUrl is required');
    });

    it('should accept valid email-based request', async () => {
      const mockResponse = {
        contentList: [
          {
            subject: 'Test Subject',
            content: 'Test email content',
            modelUsed: 'fine_tuned',
            contentItemId: 'test-123',
          },
        ],
        contactEmail: '[email protected]',
        userEmail: '[email protected]',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await autobound.generateContent({
        apiKey: 'test-key',
        contactEmail: '[email protected]',
        userEmail: '[email protected]',
        contentType: 'email',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should accept LinkedIn URL-based request', async () => {
      const mockResponse = {
        contentList: [
          {
            content: 'Test opener content',
            modelUsed: 'opus',
            contentItemId: 'test-456',
          },
        ],
        contactLinkedinUrl: 'https://linkedin.com/in/prospect',
        userLinkedinUrl: 'https://linkedin.com/in/user',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await autobound.generateContent({
        apiKey: 'test-key',
        contactLinkedinUrl: 'https://linkedin.com/in/prospect',
        userLinkedinUrl: 'https://linkedin.com/in/user',
        contentType: 'opener',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      await expect(
        autobound.generateContent({
          apiKey: 'invalid-key',
          contactEmail: '[email protected]',
          userEmail: '[email protected]',
          contentType: 'email',
        })
      ).rejects.toThrow('Authentication failed');
    });

    it('should handle rate limit errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Too many requests',
      });

      await expect(
        autobound.generateContent({
          apiKey: 'test-key-2',
          contactEmail: '[email protected]',
          userEmail: '[email protected]',
          contentType: 'email',
        })
      ).rejects.toThrow(/Rate limit exceeded|Breaker is open/);
    });
  });

  describe('generateInsights', () => {
    it('should require at least one contact identifier', async () => {
      await expect(
        autobound.generateInsights({
          apiKey: 'test-key',
        })
      ).rejects.toThrow('At least one of contactEmail, contactLinkedinUrl, or contactCompanyUrl is required');
    });

    it('should accept contactEmail', async () => {
      const mockResponse = {
        success: true,
        insights: [
          {
            insightId: 'ins-1',
            name: 'Recent job change',
            type: 'contact',
            subType: 'jobChange',
            variables: { previousCompany: 'OldCo', newCompany: 'NewCo' },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await autobound.generateInsights({
        apiKey: 'test-key-insights-1',
        contactEmail: '[email protected]',
      });

      expect(result.success).toBe(true);
      expect(result.insights).toHaveLength(1);
      expect(result.insights[0].insightId).toBe('ins-1');
    });

    it('should accept contactLinkedinUrl', async () => {
      const mockResponse = {
        success: true,
        insights: [
          {
            insightId: 'ins-2',
            name: 'Podcast appearance',
            type: 'contact',
            subType: 'podcast',
            variables: { podcastName: 'Tech Talks', episodeDate: '2025-11-01' },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await autobound.generateInsights({
        apiKey: 'test-key-insights-2',
        contactLinkedinUrl: 'https://linkedin.com/in/prospect',
      });

      expect(result.success).toBe(true);
      expect(result.insights[0].subType).toBe('podcast');
    });

    it('should accept contactCompanyUrl', async () => {
      const mockResponse = {
        success: true,
        insights: [
          {
            insightId: 'ins-3',
            name: 'Hiring trends',
            type: 'company',
            subType: 'hiringTrends',
            variables: { openRoles: 25, topDepartment: 'Engineering' },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await autobound.generateInsights({
        apiKey: 'test-key-insights-3',
        contactCompanyUrl: 'https://company.com',
      });

      expect(result.success).toBe(true);
      expect(result.insights[0].type).toBe('company');
    });

    it('should support insightSubtype filtering', async () => {
      const mockResponse = {
        success: true,
        insights: [
          {
            insightId: 'ins-4',
            name: 'Podcast: Sales Leadership',
            type: 'contact',
            subType: 'podcast',
            variables: { podcastName: 'Sales Weekly' },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await autobound.generateInsights({
        apiKey: 'test-key-insights-4',
        contactEmail: '[email protected]',
        insightSubtype: 'podcast',
      });

      expect(result.success).toBe(true);
      expect(result.insights[0].subType).toBe('podcast');
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid parameters',
      });

      await expect(
        autobound.generateInsights({
          apiKey: 'test-key-insights-error',
          contactEmail: 'invalid-email',
        })
      ).rejects.toThrow(/Invalid parameters|Breaker is open/);
    });
  });

  describe('type definitions', () => {
    it('should accept all content types', () => {
      const contentTypes: autobound.AutoboundContentType[] = [
        'email',
        'opener',
        'sms',
        'connectionRequest',
        'callScript',
        'sequence',
        'custom',
      ];

      expect(contentTypes).toHaveLength(7);
    });

    it('should accept all model types', () => {
      const models: autobound.AutoboundModel[] = [
        'opus',
        'sonnet_3.5',
        'gpt4o',
        'fine_tuned',
      ];

      expect(models).toHaveLength(4);
    });

    it('should accept all writing styles', () => {
      const styles: autobound.AutoboundWritingStyle[] = [
        'challenger_sale',
        'clever_poet',
        'cxo_pitch',
        'data_driven',
        'basho',
        'why_you_why_now',
        'custom',
      ];

      expect(styles).toHaveLength(7);
    });
  });
});
