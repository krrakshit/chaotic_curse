'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TimePeriod } from '@/lib/types';
import { TIME_PERIODS } from '@/utils/constants';

interface FilterTabsProps {
  companySlug: string;
  currentPeriod: TimePeriod;
  availablePeriods: string[];
  questionCounts: {
    underSixMonths?: number;
    moreThanSixMonths?: number;
    threeMonths?:number;
    thirtyDays?:number;
    all?: number;
  };
}

export default function FilterTabs({ 
  companySlug, 
  currentPeriod, 
  availablePeriods, 
  questionCounts 
}: FilterTabsProps) {
  const searchParams = useSearchParams();

  const createQueryString = (period: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('period', period);
    return params.toString();
  };

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <nav className="flex flex-wrap gap-2 mb-4 lg:mb-0">
          {availablePeriods.map((period) => {
            const isActive = currentPeriod === period;
            const count = questionCounts[period as TimePeriod];
            const periodConfig = TIME_PERIODS[period as TimePeriod];
            
            if (!periodConfig) return null;
            
            return (
              <Link
                key={period}
                href={`/company/${companySlug}?${createQueryString(period)}`}
                className={`
                  flex items-center py-3 px-4 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300
                  ${isActive 
                    ? 'glass-card text-white border-white/30' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-transparent'
                  }
                  border backdrop-blur-sm
                `}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${periodConfig.color}`}></div>
                <span>{periodConfig.label}</span>
                {count !== undefined && (
                  <span className={`ml-3 py-1 px-3 text-xs rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="glass rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
              <span className="font-bold text-lg">
                {questionCounts[currentPeriod] || 0}
              </span>
              <span className="text-gray-300">questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Period Description */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/30">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {TIME_PERIODS[currentPeriod]?.description}
          </p>
        </div>
      </div>
    </div>
  );
}