// src/components/MainPageClient.tsx
'use client';
import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import CompanySortFilter from './CompanySortFilter';
import InfiniteCompanies from './InfiniteCompanies';
import Squares from './Squares/Squares';
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
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="w-full bg-black/40 backdrop-blur sticky top-0 z-30 px-4 py-3 flex justify-end">
        <button
          className="text-white font-semibold hover:text-blue-400 transition px-4 py-2 rounded"
          onClick={() => setShowAnalyzer((prev) => !prev)}
        >
          {showAnalyzer ? 'Back to Companies' : 'Time Complexity'}
        </button>
      </nav>
      {/* Hero Section with Squares Background */}
      <div className="relative rounded-b-3xl mb-12 overflow-hidden">
        {/* Squares background */}
        <div className="absolute inset-0 w-full h-full">
          <Squares 
            speed={0.3} 
            squareSize={30}
            direction="diagonal"
            borderColor="rgba(255, 255, 255, 0.15)"
            hoverFillColor="rgba(255, 255, 255, 0.1)"
          />
        </div>
        {/* Glass overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        {/* Hero content above squares */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
                CompQCode Testing Platform with docker 
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Master your technical interviews with company-specific LeetCode questions.
                Practice with real interview questions from top tech companies.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                  <span>{companies.length} Companies</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span>Updated Daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Conditional rendering for Time Complexity Analyzer */}
      {showAnalyzer ? (
        <TimeComplexityAnalyzer />
      ) : (
        <div className="container mx-auto px-4 pb-16">
          {/* Search Bar */}
          <div className="mb-10">
            <SearchBar companies={companies} />
          </div>
          <CompanySortFilter
            sort={sort}
            period={period}
            onChange={(s, p) => { setSort(s); setPeriod(p); }}
          />
          <InfiniteCompanies companies={sortedCompanies} batchSize={20} />
          {/* Footer note */}
          <div className="text-center mt-16">
            <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-gray-400 text-sm">
                💡 Tip: Questions are categorized by recency to help you focus on the most relevant content for your interviews.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
