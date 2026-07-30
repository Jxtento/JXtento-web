import { useState, useEffect } from 'react';

export interface RbcToken {
  id: string;
  address: string;
  deployer: string;
  source: string;
  name: string | null;
  symbol: string | null;
  score: number;
  bundleSeverity: string;
  createdAt: string;
}

export type FeedFilterType = 'ALL' | 'CLEAN_ONLY' | 'HIGH_SCORE';

export function useRbcFeed() {
  const [tokens, setTokens] = useState<RbcToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FeedFilterType>('ALL');

  useEffect(() => {
    // Initial fetch
    const fetchFeed = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/v1/rbc/feed`);
        if (!res.ok) throw new Error('API Error');
        const json = await res.json();
        if (json.success) {
          setTokens(json.data);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();

    // Setup WS later
    // const ws = new WebSocket('ws://localhost:3001/v1/rbc/ws/feed');
    // ws.onmessage = ...

  }, []);

  const filteredTokens = tokens.filter(t => {
    if (filter === 'CLEAN_ONLY') return t.bundleSeverity === 'CLEAN';
    if (filter === 'HIGH_SCORE') return t.score >= 70;
    return true;
  });

  return {
    tokens: filteredTokens,
    loading,
    error,
    filter,
    setFilter
  };
}
