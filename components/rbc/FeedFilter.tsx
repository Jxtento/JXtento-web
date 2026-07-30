import { FeedFilterType } from '@/hooks/rbc/useRbcFeed';

interface Props {
  currentFilter: FeedFilterType;
  onFilterChange: (f: FeedFilterType) => void;
}

export function FeedFilter({ currentFilter, onFilterChange }: Props) {
  const filters: { value: FeedFilterType; label: string }[] = [
    { value: 'ALL', label: 'All Launches' },
    { value: 'CLEAN_ONLY', label: 'Clean Only' },
    { value: 'HIGH_SCORE', label: 'Score > 70' },
  ];

  return (
    <div className="flex items-center gap-2 bg-[#0A0A0A] border border-white/5 p-1 rounded-lg">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            currentFilter === f.value 
              ? 'bg-white/10 text-white shadow-sm' 
              : 'text-white/40 hover:text-white/70 hover:bg-white/5'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
