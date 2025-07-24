// src/app/company/[slug]/page.tsx - Company Details Page
import { fetchCompanyQuestions, hasTimePeriod } from '@/lib/data-fetcher';
import QuestionTable from '@/components/QuestionTable';
import FilterTabs from '@/components/FilterTabs';
import { notFound } from 'next/navigation';
import { TimePeriod } from '@/lib/types';

interface PageProps {
  params: { slug: string };
  searchParams: { period?: string };
}

export default async function CompanyPage({ params, searchParams }: PageProps) {
  const companyData = await fetchCompanyQuestions(params.slug);
  
  if (!companyData) {
    notFound();
  }

  // Default to 'all' if available, otherwise use the first available period
  const defaultPeriod = companyData.company.availablePeriods.includes('all') 
    ? 'all' 
    : companyData.company.availablePeriods[0];
    
  const period = (searchParams.period as TimePeriod) || defaultPeriod;
  
  // Ensure the requested period is available for this company
  if (!hasTimePeriod(companyData.company, period)) {
    notFound();
  }
  
  const questions = companyData.questions[period] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">{companyData.company.name}</h1>
        <span className="text-gray-600">
          ({questions.length} questions)
        </span>
      </div>

      <FilterTabs 
        companySlug={params.slug}
        currentPeriod={period}
        availablePeriods={companyData.company.availablePeriods}
        questionCounts={companyData.company.questionCounts}
      />

### Filter Tabs Component

```typescript
// src/components/FilterTabs.tsx
'use client';

import Link from 'next/link';
import { TimePeriod } from '@/lib/types';

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

const PERIOD_LABELS = {
  underSixMonths: 'Under 6 Months',
  moreThanSixMonths: 'More than 6 Months',
  all: 'All Questions'
};

export default function FilterTabs({ 
  companySlug, 
  currentPeriod, 
  availablePeriods, 
  questionCounts 
}: FilterTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {availablePeriods.map((period) => {
          const isActive = currentPeriod === period;
          const count = questionCounts[period as TimePeriod];
          
          return (
            <Link
              key={period}
              href={`/company/${companySlug}?period=${period}`}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${isActive 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {PERIOD_LABELS[period as TimePeriod] || period}
              {count !== undefined && (
                <span className="ml-2 py-0.5 px-2 text-xs bg-gray-100 text-gray-900 rounded-full">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// Generate static params for all companies
export async function generateStaticParams() {
  const companies = await fetchCompanies();
  return companies.map((company) => ({
    slug: company.slug,
  }));
}