import { siteName } from "@/lib/seo";

const faqs = [
  {
    question: "What does Balaji Sweets sell?",
    answer: `${siteName} offers premium Indian sweets, mithai, namkeen, snacks, and gift boxes. We use traditional recipes with premium nuts, ghee, and spices. All items are packed fresh and delivered with care.`,
  },
  {
    question: "Do you deliver sweets and snacks?",
    answer:
      "Yes. We offer quick dispatch and reliable delivery for sweets, namkeen, and gift boxes. Orders are packed hygienically for maximum freshness.",
  },
  {
    question: "How can I pay for my order?",
    answer:
      "We accept UPI, cards, and net banking via secure Stripe payments. Checkout is safe and straightforward.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function HomeFaq() {
  return (
    <section
      id="faq"
      className="border-t border-[color:var(--border)] bg-[color:var(--bg)]"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 id="faq-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
          Frequently asked questions
        </h2>
        <ul className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <li key={faq.question}>
              <h3 className="text-sm font-semibold text-[color:var(--fg)]">{faq.question}</h3>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
