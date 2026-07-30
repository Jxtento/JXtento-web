'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WalletProfile } from '@/components/rbc/WalletProfile';
import { FundingGraph } from '@/components/rbc/FundingGraph';

interface ProfileData {
  address: string;
  fundingParent: string | null;
  fundingTerminus: string | null;
  fundingHops: number;
  smartMoneyScore: number;
  winRate: number;
  realizedPnl: number;
  earlyEntryRate: number;
  label: string | null;
}

export default function RbcWalletPage() {
  const params = useParams();
  const address = params.address as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    
    const fetchProfile = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/v1/rbc/profile/${address}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [address]);

  if (loading) {
    return <div className="p-12 text-center text-white/50 animate-pulse">Loading intelligence...</div>;
  }

  if (!profile) {
    return <div className="p-12 text-center text-red-500">Profile not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6 flex items-center gap-3">
        Entity Profile
        {profile.label && (
          <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-sm rounded-md tracking-wider uppercase font-semibold">
            {profile.label}
          </span>
        )}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <WalletProfile profile={profile} />
        </div>
        <div className="md:col-span-1">
          <FundingGraph profile={profile} />
        </div>
      </div>
    </div>
  );
}
