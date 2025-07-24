// src/lib/data-fetcher.ts
import { Company, CompanyQuestions, Question, TimePeriod } from './types';
import { parseCSV } from './csv-parser';

const CSV_FILE_MAPPING = {
  'underSixMonths': 'under-six-months.csv',
  'moreThanSixMonths': 'more-than-six-months.csv',
  'all': 'all.csv'
};

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const response = await fetch('/data/companies-list.json');
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

    const questions: Partial<CompanyQuestions['questions']> = {};

    // Only fetch files that are available for this company
    for (const period of company.availablePeriods) {
      try {
        const fileName = CSV_FILE_MAPPING[period as TimePeriod];
        const response = await fetch(`/data/companies/${companySlug}/${fileName}`);
        
        if (response.ok) {
          const csvContent = await response.text();
          questions[period as TimePeriod] = await parseCSV(csvContent);
        } else {
          console.warn(`File not found: ${fileName} for ${companySlug}`);
          questions[period as TimePeriod] = [];
        }
      } catch (error) {
        console.error(`Error fetching ${period} data for ${companySlug}:`, error);
        questions[period as TimePeriod] = [];
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