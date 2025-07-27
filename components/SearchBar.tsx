'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Company } from '@/lib/types';

interface SearchBarProps {
  companies: Company[];
}

export default function SearchBar({ companies }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return companies
      .filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8);
  }, [companies, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlighted(-1);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredCompanies.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlighted(h => Math.min(h + 1, filteredCompanies.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      window.location.href = `/company/${filteredCompanies[highlighted].slug}`;
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="glass-card rounded-2xl p-1 shadow-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="block w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchTerm && (
        <div className="absolute z-20 mt-2 w-full glass-card rounded-xl shadow-xl backdrop-blur-lg border border-white/20">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, idx) => (
              <Link
                key={company.id}
                href={`/company/${company.slug}`}
                className={`block px-6 py-4 text-left cursor-pointer transition-all ${highlighted === idx ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-200'}`}
                onMouseEnter={() => setHighlighted(idx)}
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold truncate">
                      {company.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {company.questionCounts?.all || 0} questions
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-4 text-base text-gray-400">
              No companies found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}