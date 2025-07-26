// utils/constants.ts
export const DIFFICULTY_COLORS = {
    Easy: 'text-green-600 bg-green-50 border-green-200',
    Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    Hard: 'text-red-600 bg-red-50 border-red-200'
  } as const;
  
  export const DIFFICULTY_OPTIONS = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ] as const;
  
  export const TIME_PERIODS = {
    underSixMonths: {
      label: 'Under 6 Months',
      description: 'Questions asked in the last 6 months',
      color: 'bg-green-500'
    },
    moreThanSixMonths: {
      label: 'More than 6 Months',
      description: 'Questions asked more than 6 months ago',
      color: 'bg-blue-500'
    },
    threeMonths:{
      label: '3 Months',
      description: 'Questions asked in the last 3 months',
      color: 'bg-yellow-500'
    },
    thirtyDays:{
      label: '30 Days',
      description: 'Questions asked in the last 30 days',
      color: 'bg-red-500'
    },
    all: {
      label: 'All Questions',
      description: 'All available questions',
      color: 'bg-gray-500'
    }
  } as const;
  
  export const SORT_OPTIONS = [
    { value: 'frequency', label: 'Frequency', direction: 'desc' },
    { value: 'acceptanceRate', label: 'Acceptance Rate', direction: 'asc' },
    { value: 'title', label: 'Title', direction: 'asc' },
    { value: 'difficulty', label: 'Difficulty', direction: 'asc' }
  ] as const;
  
  export const CSV_FILE_MAPPING = {
    'underSixMonths': 'six-months.json',
    'moreThanSixMonths': 'more-than-six-months.json',
    'threeMonths': 'three-months.json',
    'thirtyDays': 'thirty-days.json',
    'all': 'all.json'
  } as const;
  
  export const ITEMS_PER_PAGE = 50;
  
  export const COMPANY_LOGOS: Record<string, string> = {
    google: '/logos/google.png',
    microsoft: '/logos/microsoft.png',
    amazon: '/logos/amazon.png',
    meta: '/logos/meta.png',
    apple: '/logos/apple.png',
    netflix: '/logos/netflix.png',
    uber: '/logos/uber.png',
    airbnb: '/logos/airbnb.png',
    // Add more company logos as needed
  };
  
  // components/SearchBar.tsx
