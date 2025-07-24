// src/components/CompanyCard.tsx
import Link from 'next/link';
import { Company } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/company/${company.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
        <div className="flex items-center gap-4 mb-4">
          {company.logo && (
            <img 
              src={company.logo} 
              alt={`${company.name} logo`}
              className="w-12 h-12 rounded"
            />
          )}
          <h3 className="text-xl font-semibold">{company.name}</h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          {company.questionCounts.underSixMonths !== undefined && (
            <div className="flex justify-between">
              <span>Under 6 months:</span>
              <span className="font-medium">{company.questionCounts.underSixMonths}</span>
            </div>
          )}
          {company.questionCounts.moreThanSixMonths !== undefined && (
            <div className="flex justify-between">
              <span>More than 6 months:</span>
              <span className="font-medium">{company.questionCounts.moreThanSixMonths}</span>
            </div>
          )}
          {company.questionCounts.all !== undefined && (
            <div className="flex justify-between">
              <span>All questions:</span>
              <span className="font-medium">{company.questionCounts.all}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}