"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  folder?: string;
};

export function CloudinaryUpload({ value, onChange, folder = "likitha-sweets" }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlToAdd, setUrlToAdd] = useState("");

  async function upload(file: File) {
    setPending(true);
    setError(null);
    try {
      const sigRes = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const sig = await sigRes.json();
      if (!sigRes.ok) throw new Error(sig?.error ?? "Signature failed");

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      if (sig.folder) form.append("folder", sig.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form },
      );
      const uploaded = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploaded?.error?.message ?? "Upload failed");

      const url = uploaded.secure_url as string | undefined;
      if (url) onChange([...value, url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 py-2 text-sm hover:bg-[color:var(--surface-2)]">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.currentTarget.value = "";
            }}
          />
          {pending ? <Loader2 className="animate-spin" /> : <Upload />}
          Upload image
        </label>
        <div className="text-xs text-[color:var(--muted)]">
          {value.length} image{value.length === 1 ? "" : "s"}
        </div>
      </div>

      {value.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((src) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)]"
            >
              <div className="relative aspect-[4/3]">
                <Image src={src} alt="" fill className="object-cover" sizes="33vw" />
              </div>
              <div className="absolute right-3 top-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => onChange(value.filter((v) => v !== src))}
                  aria-label="Remove image"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6 text-sm text-[color:var(--muted)]">
          Add at least one product image. Use Cloudinary upload, or paste a URL below.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 text-sm outline-none placeholder:text-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          placeholder="Paste image URL (e.g., Cloudinary secure_url)"
          value={urlToAdd}
          onChange={(e) => setUrlToAdd(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const v = urlToAdd.trim();
            if (!v) return;
            onChange([...value, v]);
            setUrlToAdd("");
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const v = urlToAdd.trim();
            if (!v) return;
            onChange([...value, v]);
            setUrlToAdd("");
          }}
        >
          Add URL
        </Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
}

