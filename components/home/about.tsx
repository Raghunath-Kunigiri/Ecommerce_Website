import { HeartHandshake, ShieldCheck, Truck } from "lucide-react";

const items = [
  {
    icon: HeartHandshake,
    title: "Authentic taste",
    desc: "Traditional recipes made with premium nuts, ghee, and spices.",
  },
  {
    icon: ShieldCheck,
    title: "Quality first",
    desc: "Carefully packed, hygienic handling, and consistent freshness.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    desc: "Quick dispatch and reliable shipping for gifts and cravings.",
  },
];

export function About() {
  return (
    <section id="about" className="border-y border-[color:var(--border)] bg-[color:var(--surface-1)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Crafted for celebrations. Made for everyday joy.
            </h2>
            <p className="text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              From festive mithai boxes to tea-time namkeen, we focus on quality,
              freshness, and packaging that’s perfect for gifting.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {items.map((it) => (
              <div
                key={it.title}
                className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg)] p-5"
              >
                <it.icon className="size-5 text-[color:var(--brand-strong)]" />
                <div className="pt-3 text-sm font-semibold">{it.title}</div>
                <div className="pt-1 text-sm text-[color:var(--muted)]">
                  {it.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

