// src/app/page.tsx - Homepage
import { fetchCompanies } from '@/lib/data-fetcher';
import CompanyCard from '@/components/CompanyCard';
import SearchBar from '@/components/SearchBar';

export default async function HomePage() {
  const companies = await fetchCompanies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        LeetCode Company-wise Interview Questions
      </h1>
      
      <SearchBar companies={companies} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}