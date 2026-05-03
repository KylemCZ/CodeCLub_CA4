import SignupForm from "./signup-form";
import Link from 'next/link';

export default async function Signup() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href={`/technologies`} className="text-blue-400 hover:text-blue-300 underline">
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-white mb-8">Sign Up Form</h1>
        <SignupForm />
      </div>
    </main>
  );
}