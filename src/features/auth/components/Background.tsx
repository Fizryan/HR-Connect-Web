export function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] w-[600px] h-[500px]" />
      <div className="absolute bottom-0 right-0 -z-10 rounded-full bg-accent/20 blur-[100px] w-[500px] h-[400px]" />
      <div className="absolute inset-0 hidden lg:block">
        <div className="absolute left-1/2 top-[18%] -translate-x-[115%] rotate-[-6deg] rounded-3xl border border-border/80 bg-background/80 p-6 backdrop-blur-2xl shadow-2xl">
          <div className="space-y-4">
            <div className="h-3 w-28 rounded-full bg-primary/80" />
            <div className="h-2 w-48 rounded-full bg-muted-foreground/60" />
            <div className="h-24 w-64 rounded-2xl bg-primary/10 border border-primary/20" />
          </div>
        </div>
        <div className="absolute left-1/2 top-[62%] -translate-x-[40%] rotate-[4deg] rounded-3xl border border-border/80 bg-background/80 p-5 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary/30" />
            <div>
              <div className="h-3 w-28 rounded-full bg-primary/80" />
              <div className="mt-2.5 h-2 w-20 rounded-full bg-muted-foreground/60" />
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-[32%] translate-x-[15%] rotate-[-2deg] rounded-3xl border border-border/80 bg-background/80 p-6 backdrop-blur-2xl shadow-xl">
          <div className="space-y-4">
            <div className="h-3 w-36 rounded-full bg-primary/80" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 w-14 rounded-xl bg-primary/10 border border-primary/20" />
              <div className="h-20 w-14 rounded-xl bg-primary/10 border border-primary/20" />
              <div className="h-20 w-14 rounded-xl bg-primary/10 border border-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
