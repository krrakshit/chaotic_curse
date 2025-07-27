// src/components/InfiniteCompanies.tsx
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import CompanyCard from './CompanyCard';
import { Company } from '@/lib/types';

interface InfiniteCompaniesProps {
  companies: Company[];
  batchSize?: number;
}

export default function InfiniteCompanies({ companies, batchSize = 20 }: InfiniteCompaniesProps) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + batchSize, companies.length));
    }
  }, [batchSize, companies.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companies.slice(0, visibleCount).map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      {visibleCount < companies.length && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <span className="px-6 py-2 rounded-xl bg-white/10 text-white/60 text-lg animate-pulse">Loading more...</span>
        </div>
      )}
    </>
  );
}
