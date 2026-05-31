import { Background } from "@/features/auth/components/Background";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Background />
      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-center px-20">
          <div className="max-w-xl">
            <h1 className="text-6xl font-bold tracking-tight">
              Manage Your Workforce Smarter
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Streamline recruitment, employee records, attendance, payroll, and
              performance management in a single platform.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center p-8">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
