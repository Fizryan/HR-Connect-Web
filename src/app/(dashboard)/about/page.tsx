import { Info, ShieldCheck, Zap, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Info className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About HR Connect</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Empowering organizations to build, manage, and scale their workforce through intelligent and seamless human resource management.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-48 h-48 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4 relative z-10">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed relative z-10">
            To simplify the complexities of human resource management by providing an all-in-one platform that connects employees, streamlines operations, and fosters a transparent workplace culture. We believe in putting people first and letting technology handle the rest.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-48 h-48 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4 relative z-10">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed relative z-10">
            To become the global standard for enterprise HR solutions, creating work environments where data drives decisions and every employee feels valued, supported, and connected to the company's core goals.
          </p>
        </div>
      </div>
      <div className="space-y-6 pt-8">
        <h2 className="text-3xl font-bold text-center">Core Values</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border bg-card text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">People Centric</h3>
            <p className="text-sm text-muted-foreground">Everything we build is designed to make the lives of employees and managers better.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Integrity & Security</h3>
            <p className="text-sm text-muted-foreground">Your data is yours. We implement enterprise-grade security to protect what matters most.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-card text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Continuous Innovation</h3>
            <p className="text-sm text-muted-foreground">We constantly evolve our platform to meet the dynamic needs of modern workplaces.</p>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>HR Connect Enterprise v1.0.0</p>
        <p>© 2026 HR Connect Inc. All rights reserved.</p>
      </div>

    </div>
  );
}
