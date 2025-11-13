import { SignupForm } from '@/components/auth/SignupForm';

export default function Inscription() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-96px)] flex items-center justify-center">
      <SignupForm />
    </main>
  );
}