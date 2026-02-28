"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";
import { slugify } from "@/components/admin/slug";

export type AdminCategory = { id: string; name: string; slug: string };

export type AdminProduct = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  tags: string[];
  categoryId: string;
  isActive: boolean;
};

export function ProductForm({
  mode,
  categories,
  initial,
}: {
  mode: "create" | "edit";
  categories: AdminCategory[];
  initial?: Partial<AdminProduct>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<number>(initial?.price ?? 19900);
  const [currency, setCurrency] = useState(initial?.currency ?? "INR");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [tags, setTags] = useState<string[]>((initial?.tags as string[]) ?? []);
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? "",
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const tagsText = useMemo(() => tags.join(", "), [tags]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        try {
          const payload = {
            name,
            slug: slug || slugify(name),
            description,
            price: Number(price),
            currency,
            images,
            tags: tags.filter(Boolean),
            categoryId,
            isActive,
          };

          const url =
            mode === "create"
              ? "/api/admin/products"
              : `/api/admin/products/${initial?.id}`;

          const res = await fetch(url, {
            method: mode === "create" ? "POST" : "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(data?.error ?? "Failed to save product");
            return;
          }
          router.push("/admin/products");
          router.refresh();
        } catch {
          setError("Failed to save product");
        } finally {
          setPending(false);
        }
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g., Motichoor Laddu"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="motichoor-laddu"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-28 w-full rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 py-3 text-sm outline-none placeholder:text-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          placeholder="Short, appetizing description…"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (paise)</label>
          <Input
            value={String(price)}
            onChange={(e) => setPrice(Number(e.target.value))}
            inputMode="numeric"
            required
          />
          <div className="text-xs text-[color:var(--muted)]">
            Example: ₹199.00 → <code>19900</code>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Currency</label>
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <Input
            value={tagsText}
            onChange={(e) =>
              setTags(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
            placeholder="Best Seller, Festive, Gift Box"
          />
          <div className="text-xs text-[color:var(--muted)]">
            Comma-separated.
          </div>
        </div>
        <div className="flex items-end gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <CloudinaryUpload value={images} onChange={setImages} />
      </div>

      {error ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={pending} type="submit">
          {mode === "create" ? "Create product" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            router.push("/admin/products");
            router.refresh();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

