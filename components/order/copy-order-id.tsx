"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyOrderIdButton({ orderId }: { orderId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-xl"
      onClick={() => {
        void navigator.clipboard.writeText(orderId).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      <Copy className="size-4 mr-1" />
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
