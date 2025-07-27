// src/lib/data-fetcher.ts
import { Company, CompanyQuestions, Question, TimePeriod } from './types';

const CSV_FILE_MAPPING = {
  'underSixMonths': 'under-six-months.csv',
  'moreThanSixMonths': 'more-than-six-months.csv',
  'all': 'all.csv'
};

export async function fetchCompanies(): Promise<Company[]> {
  // Always fetch from backend API
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  try {
    const response = await fetch(`${backendBaseUrl}/api/companies-list`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export async function fetchCompanyQuestions(companySlug: string): Promise<CompanyQuestions | null> {
  try {
    const companies = await fetchCompanies();
    const company = companies.find(c => c.slug === companySlug);
    
    if (!company) return null;

    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${backendBaseUrl}/api/company/${companySlug}`);
    if (!response.ok) return null;
    const data = await response.json();
    // data.questions is an object with period keys
    return {
      company,
      questions: data.questions as CompanyQuestions['questions']
    };
  } catch (error) {
    console.error('Error fetching company questions:', error);
    return null;
  }
}

// Helper function to check if a company has a specific period
export function hasTimePeriod(company: Company, period: TimePeriod): boolean {
  return company.availablePeriods.includes(period);
}