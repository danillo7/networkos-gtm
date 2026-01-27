/**
 * Custom hooks for API calls
 */

import { useState, useCallback } from 'react';

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    url: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Request failed');
      }

      setState({ data: result.data, loading: false, error: null });
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// Specific API hooks
export function useResearchCompany() {
  const api = useApi<{
    company: Record<string, unknown>;
    signals: Array<unknown>;
    voiceAIOpportunities: Array<unknown>;
  }>();

  const research = useCallback(async (domain: string, depth: 'basic' | 'standard' | 'deep' = 'standard') => {
    return api.execute('/api/ai/research', {
      method: 'POST',
      body: JSON.stringify({ domain, depth }),
    });
  }, [api]);

  return { ...api, research };
}

export function useScoreOpportunity() {
  const api = useApi<{
    score: {
      overall: number;
      companyFit: number;
      voiceAIOpportunity: number;
      timingSignals: number;
      budgetIndicators: number;
    };
    breakdown: Record<string, unknown>;
    recommendations: string[];
    nextBestActions: string[];
  }>();

  const score = useCallback(async (company: unknown, options?: { contacts?: unknown[]; signals?: unknown[] }) => {
    return api.execute('/api/ai/score', {
      method: 'POST',
      body: JSON.stringify({ company, ...options }),
    });
  }, [api]);

  return { ...api, score };
}

export function useFindContacts() {
  const api = useApi<{
    contacts: Array<{
      firstName: string;
      lastName: string;
      fullName: string;
      email?: string;
      title: string;
      authorityScore: number;
      decisionMaker: boolean;
    }>;
    totalFound: number;
  }>();

  const find = useCallback(async (params: {
    companyId: string;
    companyName: string;
    domain: string;
    industry?: string;
    targetRoles?: string[];
    maxContacts?: number;
  }) => {
    return api.execute('/api/ai/contacts', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }, [api]);

  return { ...api, find };
}

export function useGeneratePitch() {
  const api = useApi<{
    pitch: {
      id: string;
      type: string;
      subject?: string;
      body: string;
      hooks: string[];
      elevenlabsProducts: Array<{ name: string; relevance: number }>;
    };
  }>();

  const generate = useCallback(async (params: {
    company: unknown;
    contact?: unknown;
    type?: 'email' | 'linkedin' | 'call_script';
    tone?: string;
    length?: 'short' | 'medium' | 'long';
    focusProducts?: string[];
  }) => {
    return api.execute('/api/ai/pitch', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }, [api]);

  return { ...api, generate };
}

export function useOrchestrate() {
  const api = useApi<{
    company?: unknown;
    contacts?: unknown[];
    score?: { overall: number };
    pitches?: unknown[];
    recommendations: string[];
    nextSteps: string[];
    summary: string;
  }>();

  const orchestrate = useCallback(async (params: {
    type: 'quick' | 'full' | 'full_qualification' | 'find_champions' | 'create_campaign';
    domain?: string;
    options?: Record<string, unknown>;
  }) => {
    return api.execute('/api/ai/orchestrate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }, [api]);

  return { ...api, orchestrate };
}

export function useDashboardMetrics() {
  const api = useApi<{
    totalCompanies: number;
    totalContacts: number;
    activeSequences: number;
    pipelineValue: number;
    averageAIScore: number;
    urgentActions: Array<{
      type: string;
      message: string;
      priority: string;
    }>;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
    }>;
  }>();

  const fetch = useCallback(async () => {
    return api.execute('/api/analytics/summary', {
      method: 'GET',
    });
  }, [api]);

  return { ...api, fetch };
}
