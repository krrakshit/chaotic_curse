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
    <div className="border-b border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
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
                  flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${periodConfig.color}`}></div>
                <span>{periodConfig.label}</span>
                {count !== undefined && (
                  <span className={`ml-2 py-0.5 px-2 text-xs rounded-full font-medium ${
                    isActive 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">
                {questionCounts[currentPeriod] || 0}
              </span>
              <span className="ml-1">questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Period Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {TIME_PERIODS[currentPeriod]?.description}
        </p>
      </div>
    </div>
  );
}