// src/components/MainPageClient.tsx
'use client';
import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import CompanySortFilter from './CompanySortFilter';
import InfiniteCompanies from './InfiniteCompanies';
import TimeComplexityAnalyzer from '../app/analyze/page';

export default function MainPageClient({ companies }: { companies: any[] }) {
  const [sort, setSort] = useState('az');
  const [period, setPeriod] = useState('all');
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  // Sorting and filtering logic
  const sortedCompanies = useMemo(() => {
    const arr = [...companies];
    if (sort === 'az') {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'za') {
      arr.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'most') {
      arr.sort((a, b) => {
        const aCount = a.questionCounts?.[period] || 0;
        const bCount = b.questionCounts?.[period] || 0;
        return bCount - aCount;
      });
    }
    return arr;
  }, [companies, sort, period]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="w-full bg-black/40 backdrop-blur sticky top-0 z-30 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold gradient-text">CompQCode</h1>
        <button
          className="text-white font-semibold hover:text-blue-400 transition px-4 py-2 rounded"
          onClick={() => setShowAnalyzer((prev) => !prev)}
        >
          {showAnalyzer ? 'Back to Companies' : 'Time Complexity'}
        </button>
      </nav>

      {/* Conditional rendering for Time Complexity Analyzer */}
      {showAnalyzer ? (
        <TimeComplexityAnalyzer />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar companies={companies} />
          </div>
          
          <CompanySortFilter
            sort={sort}
            period={period}
            onChange={(s, p) => { setSort(s); setPeriod(p); }}
          />
          
          <InfiniteCompanies companies={sortedCompanies} batchSize={20} />
        </div>
      )}
    </div>
  );
}
