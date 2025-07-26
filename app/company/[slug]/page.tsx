import QuestionTable from '@/components/QuestionTable';
import FilterTabs from '@/components/FilterTabs';
import { notFound } from 'next/navigation';


interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompanyPage({ params, searchParams }: PageProps) {
  // Await the params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Fetch company meta from companies-list.json (filesystem)
  const fs = await import('fs');
  const path = await import('path');
  const companiesPath = path.join(process.cwd(), 'public', 'data', 'companies-list.json');
  const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf-8'));
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

  // Fetch questions from API
  // Build absolute URL for fetch
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    // Try to infer from environment (localhost or production)
    baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
  }
  const apiUrl = `${baseUrl}/api/company?slug=${resolvedParams.slug}&period=${period}`;
  const res = await fetch(apiUrl, { cache: 'no-store' });
  if (!res.ok) {
    notFound();
  }
  const { questions } = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <span className="text-gray-600">
          ({questions.length} questions)
        </span>
      </div>

      <FilterTabs 
        companySlug={resolvedParams.slug}
        currentPeriod={period}
        availablePeriods={company.availablePeriods}
        questionCounts={company.questionCounts}
      />

      <QuestionTable questions={questions} />
    </div>
  );
}