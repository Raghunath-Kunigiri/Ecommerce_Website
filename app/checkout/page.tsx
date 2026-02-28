import { CheckoutStart } from "@/components/checkout/checkout-start";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <CheckoutStart />
    </div>
  );
}

