import { Suspense } from "react";
import { TrackOrderView } from "./track-order-view";

export const metadata = {
  title: "Track order",
  description: "Track your Balaji Sweets order by Order ID.",
};

export default function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Suspense fallback={<div className="text-center text-[color:var(--muted)]">Loading…</div>}>
        <TrackOrderView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
