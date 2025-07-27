// src/components/CompanySortFilter.tsx
'use client';
import { useState } from 'react';
import { Company } from '@/lib/types';

interface CompanySortFilterProps {
  onChange: (sort: string, period: string) => void;
  sort: string;
  period: string;
}

const SORT_OPTIONS = [
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
  { value: 'most', label: 'Most Questions' },
];


export default function CompanySortFilter({ onChange, sort, period }: CompanySortFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
      <div className="flex gap-2">
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border backdrop-blur-sm ${sort === opt.value ? 'bg-white/20 text-white border-white/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-transparent'}`}
            onClick={() => onChange(opt.value, period)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
