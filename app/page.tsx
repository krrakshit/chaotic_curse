// src/app/page.tsx - Homepage
import { fetchCompanies } from '@/lib/data-fetcher';
import CompanyCard from '@/components/CompanyCard';
import InfiniteCompanies from '@/components/InfiniteCompanies';
import SearchBar from '@/components/SearchBar';

export default async function HomePage() {
  const companies = await fetchCompanies();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="glass rounded-b-3xl mb-12">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              LeetCode Company Questions
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

      {/* Companies Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Browse Companies</h2>
          <p className="text-gray-400">Select a company to view their interview questions</p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar companies={companies} />
        </div>

        <InfiniteCompanies companies={companies} batchSize={20} />

        {/* Footer note */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              💡 Tip: Questions are categorized by recency to help you focus on the most relevant content for your interviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}