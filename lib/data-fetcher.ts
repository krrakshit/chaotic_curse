// src/lib/data-fetcher.ts
import { Company, CompanyQuestions, Question, TimePeriod } from './types';

const CSV_FILE_MAPPING = {
  'underSixMonths': 'under-six-months.csv',
  'moreThanSixMonths': 'more-than-six-months.csv',
  'all': 'all.csv'
};

export async function fetchCompanies(): Promise<Company[]> {
  // Try to use fs if available (server-side)
  try {
    // Only import fs on the server
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'companies-list.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // Fallback to fetch for client-side (should rarely happen)
    try {
      const response = await fetch('/data/companies-list.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  }
}

export async function fetchCompanyQuestions(companySlug: string): Promise<CompanyQuestions | null> {
  try {
    const companies = await fetchCompanies();
    const company = companies.find(c => c.slug === companySlug);
    
    if (!company) return null;

    const questions: Partial<CompanyQuestions['questions']> = {};

    // Only fetch files that are available for this company
    for (const period of company.availablePeriods) {
      try {
        // Try to use fs if available (server-side)
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public', 'data', 'companies', companySlug, `${period}.json`);
        const data = fs.readFileSync(filePath, 'utf-8');
        questions[period as TimePeriod] = JSON.parse(data);
      } catch (error) {
        // Fallback to fetch for client-side (should rarely happen)
        try {
          const response = await fetch(`/data/companies/${companySlug}/${period}.json`);
          if (response.ok) {
            questions[period as TimePeriod] = await response.json();
          } else {
            questions[period as TimePeriod] = [];
          }
        } catch (err) {
          questions[period as TimePeriod] = [];
        }
      }
    }

    return {
      company,
      questions: questions as CompanyQuestions['questions']
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