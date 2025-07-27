// src/components/CompanyCard.tsx
import Link from 'next/link';
import { Company } from '@/lib/types';
import Image from 'next/image';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const totalQuestions = company.questionCounts.all || 
    (company.questionCounts.underSixMonths || 0) + (company.questionCounts.moreThanSixMonths || 0);

  return (
    <Link href={`/company/${company.slug}`} className="block group">
      <div className="glass-card rounded-2xl p-6 h-full relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Main content */}
        <div className="relative z-10">
          {/* Header with logo and name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {company.logo ? (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/20">
                  <Image
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300 truncate">
                {company.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">
                  {totalQuestions} questions available
                </span>
              </div>
            </div>
          </div>
          
          {/* Question counts */}
          <div className="space-y-3">
            {company.questionCounts.underSixMonths !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm text-gray-300">Recent (≤6 months)</span>
                </div>
                <span className="text-lg font-bold text-blue-300">
                  {company.questionCounts.underSixMonths}
                </span>
              </div>
            )}
            
            {company.questionCounts.moreThanSixMonths !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-sm text-gray-300">Older (&gt;6 months)</span>
                </div>
                <span className="text-lg font-bold text-purple-300">
                  {company.questionCounts.moreThanSixMonths}
                </span>
              </div>
            )}
            
            {company.questionCounts.all !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
                  <span className="text-sm text-white font-medium">All Questions</span>
                </div>
                <span className="text-xl font-bold text-white">
                  {company.questionCounts.all}
                </span>
              </div>
            )}
          </div>
          
          {/* Hover indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}