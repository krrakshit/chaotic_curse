import MainPageClient from '@/components/MainPageClient';
import { fetchCompanies } from '@/lib/data-fetcher';
export default async function HomePage() {
  const companies = await fetchCompanies();
  return (
    <MainPageClient companies={companies} />
  );
}

