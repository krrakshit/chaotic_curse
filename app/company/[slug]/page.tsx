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

export default async function CompanyPage(
  propsPromise: Promise<PageProps>
) {
  const { params, searchParams } = await propsPromise;
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

      <QuestionTable questions={questions} />
    </div>
  );
}

