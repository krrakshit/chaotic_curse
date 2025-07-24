'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Company } from '@/lib/types';
import { COMPANY_LOGOS } from '@/utils/constants';

interface SearchBarProps {
  companies: Company[];
}

export default function SearchBar({ companies }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return companies
      .filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 results
  }, [companies, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleResultClick = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicking on results
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchTerm && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <Link
                key={company.id}
                href={`/company/${company.slug}`}
                onClick={handleResultClick}
                className="block px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {COMPANY_LOGOS[company.slug] && (
                    <img
                      src={COMPANY_LOGOS[company.slug]}
                      alt={`${company.name} logo`}
                      className="w-6 h-6 rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {company.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {company.questionCounts.all || 0} questions
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No companies found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}