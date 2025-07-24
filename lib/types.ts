// lib/types.ts
export interface Question {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    acceptanceRate: number;
    frequency: number;
    url: string;
    tags: string[];
    isPremium: boolean;
  }
  
  export interface Company {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    questionCounts: {
      underSixMonths?: number;
      moreThanSixMonths?: number;
      all?: number;
    };
    availablePeriods: string[]; // Available CSV files for this company
  }
  
  export interface CompanyQuestions {
    company: Company;
    questions: {
      underSixMonths?: Question[];
      moreThanSixMonths?: Question[];
      all?: Question[];
    };
  }
  
  export type TimePeriod = 'underSixMonths' | 'moreThanSixMonths' | 'all';