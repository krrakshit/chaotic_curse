"use client";
import { useSession } from "next-auth/react";
import MainPageClient from "./MainPageClient";
import { fetchCompanies } from '@/lib/data-fetcher';
import React, { useEffect, useState } from "react";

export default function AuthGate({ fallback }: { fallback: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const companiesData = await fetchCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to load companies:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadCompanies();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (status === "loading" || loading) return null;

  if (session) {
    return <MainPageClient companies={companies} />;
  }
  return <>{fallback}</>;
}