import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

function LoginPageContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginPageContent />
    </Suspense>
  );
}