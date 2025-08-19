import AuthGate from "@/components/AuthGate";
import LandingPage from "@/components/landingpage"

export default function Home() {
  return <AuthGate fallback={<LandingPage />} />;
}