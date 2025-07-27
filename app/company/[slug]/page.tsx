import QuestionTable from '@/components/QuestionTable';
import FilterTabs from '@/components/FilterTabs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompanyPage({ params, searchParams }: PageProps) {
  // Await the params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Fetch company meta from backend API
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  const companiesRes = await fetch(`${backendBaseUrl}/api/companies-list`);
  const companies = await companiesRes.json();
  const company = companies.find((c: any) => c.slug === resolvedParams.slug);
  if (!company) {
    notFound();
  }

  // Determine period
  const defaultPeriod = company.availablePeriods.includes('all') 
    ? 'all' 
    : company.availablePeriods[0];
  const period = (resolvedSearchParams?.period as string) || defaultPeriod;
  if (!company.availablePeriods.includes(period)) {
    notFound();
  }

  // Fetch all questions for the company from backend API
  const questionsRes = await fetch(`${backendBaseUrl}/api/company/${resolvedParams.slug}`);
  if (!questionsRes.ok) {
    notFound();
  }
  const allQuestions = await questionsRes.json();
  const questions = allQuestions.questions[period] || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass rounded-b-3xl mb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Companies</span>
            </Link>
          </div>

          {/* Company Info */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              {company.logo ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                  <span className="text-white font-bold text-3xl">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{company.name}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                  <span>{questions.length} questions available</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                <span>Period: {period === 'all' ? 'All Time' : period}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        <FilterTabs 
          companySlug={resolvedParams.slug}
          currentPeriod={period}
          availablePeriods={company.availablePeriods}
          questionCounts={company.questionCounts}
        />

        <div className="mt-8">
          <QuestionTable questions={questions} />
        </div>
      </div>
    </div>
  );
}