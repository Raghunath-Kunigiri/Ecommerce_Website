"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ProductRowActions({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <>
      <Button
        size="xs"
        variant="outline"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          try {
            await fetch(`/api/admin/products/${productId}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ isActive: !isActive }),
            });
            router.refresh();
          } finally {
            setPending(false);
          }
        }}
      >
        {isActive ? "Hide" : "Show"}
      </Button>
      <Button
        size="xs"
        variant="outline"
        disabled={pending}
        onClick={async () => {
          const ok = window.confirm("Delete this product?");
          if (!ok) return;
          setPending(true);
          try {
            await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
            router.refresh();
          } finally {
            setPending(false);
          }
        }}
      >
        <Trash2 />
        Delete
      </Button>
    </>
  );
}

