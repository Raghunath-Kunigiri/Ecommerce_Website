"use client";

import { useState } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/components/admin/slug";
import { Badge } from "@/components/ui/badge";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  productsCount: number;
};

export function CategoryManager({ initial }: { initial: CategoryRow[] }) {
  const [items, setItems] = useState<CategoryRow[]>(initial);
  const [creating, setCreating] = useState({ name: "", slug: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; slug: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div className="text-sm font-semibold">Add category</div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input
            value={creating.name}
            onChange={(e) =>
              setCreating((s) => ({
                ...s,
                name: e.target.value,
                slug: s.slug ? s.slug : slugify(e.target.value),
              }))
            }
            placeholder="e.g., Dry Fruits"
          />
          <Input
            value={creating.slug}
            onChange={(e) => setCreating((s) => ({ ...s, slug: e.target.value }))}
            placeholder="dry-fruits"
          />
          <Button
            disabled={pending || !creating.name || !creating.slug}
            onClick={async () => {
              setPending(true);
              setError(null);
              try {
                const res = await fetch("/api/admin/categories", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(creating),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                  setError(data?.error ?? "Failed to create category");
                  return;
                }
                setItems((prev) => [
                  { ...data.item, productsCount: 0 },
                  ...prev,
                ]);
                setCreating({ name: "", slug: "" });
              } finally {
                setPending(false);
              }
            }}
          >
            Create
          </Button>
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
            {error}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
        <div className="grid grid-cols-[1fr_1fr_.8fr_.8fr] gap-3 border-b border-[color:var(--border)] px-5 py-3 text-xs font-semibold text-[color:var(--muted)]">
          <div>Name</div>
          <div>Slug</div>
          <div>Products</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-[color:var(--border)]">
          {items.map((c) => {
            const isEditing = editingId === c.id;
            const draft = isEditing ? editDraft : null;
            return (
              <div
                key={c.id}
                className="grid grid-cols-[1fr_1fr_.8fr_.8fr] items-center gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  {isEditing && draft ? (
                    <Input
                      value={draft.name}
                      onChange={(e) =>
                        setEditDraft((d) =>
                          d
                            ? {
                                ...d,
                                name: e.target.value,
                                slug: d.slug ? d.slug : slugify(e.target.value),
                              }
                            : d,
                        )
                      }
                    />
                  ) : (
                    <div className="truncate text-sm font-semibold">{c.name}</div>
                  )}
                </div>
                <div className="min-w-0">
                  {isEditing && draft ? (
                    <Input
                      value={draft.slug}
                      onChange={(e) =>
                        setEditDraft((d) => (d ? { ...d, slug: e.target.value } : d))
                      }
                    />
                  ) : (
                    <div className="truncate text-sm text-[color:var(--muted)]">
                      {c.slug}
                    </div>
                  )}
                </div>
                <div>
                  <Badge variant="outline">{c.productsCount}</Badge>
                </div>
                <div className="flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="xs"
                        variant="secondary"
                        disabled={pending || !draft?.name || !draft?.slug}
                        onClick={async () => {
                          if (!draft) return;
                          setPending(true);
                          setError(null);
                          try {
                            const res = await fetch(`/api/admin/categories/${c.id}`, {
                              method: "PATCH",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify(draft),
                            });
                            const data = await res.json().catch(() => ({}));
                            if (!res.ok) {
                              setError(data?.error ?? "Failed to save category");
                              return;
                            }
                            setItems((prev) =>
                              prev.map((x) =>
                                x.id === c.id ? { ...x, ...data.item } : x,
                              ),
                            );
                            setEditingId(null);
                            setEditDraft(null);
                          } finally {
                            setPending(false);
                          }
                        }}
                      >
                        <Save />
                        Save
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        disabled={pending}
                        onClick={() => {
                          setEditingId(null);
                          setEditDraft(null);
                        }}
                      >
                        <X />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setEditingId(c.id);
                          setEditDraft({ name: c.name, slug: c.slug });
                        }}
                      >
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        disabled={pending || c.productsCount > 0}
                        onClick={async () => {
                          if (c.productsCount > 0) return;
                          setPending(true);
                          setError(null);
                          try {
                            const res = await fetch(`/api/admin/categories/${c.id}`, {
                              method: "DELETE",
                            });
                            const data = await res.json().catch(() => ({}));
                            if (!res.ok) {
                              setError(data?.error ?? "Failed to delete category");
                              return;
                            }
                            setItems((prev) => prev.filter((x) => x.id !== c.id));
                          } finally {
                            setPending(false);
                          }
                        }}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {items.length === 0 ? (
            <div className="p-10 text-center text-sm text-[color:var(--muted)]">
              No categories found.
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
}

