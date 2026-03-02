import { readdirSync } from "node:fs";
import path from "node:path";

import { products } from "@/lib/sample-data";

const root = process.cwd();
const itemsDir = path.join(root, "public", "Items_Images");

const itemFiles = new Set<string>();
try {
  for (const f of readdirSync(itemsDir)) itemFiles.add(f);
} catch {
  // ignore
}

function guessFilenames(name: string) {
  const base = name.trim();
  return [
    `${base}.png`,
    `${base}.jpg`,
    `${base}.jpeg`,
    // sometimes we use hyphen or remove spaces
    `${base.replace(/\s+/g, " ")}.png`,
  ];
}

const rows = products
  .map((p) => {
    const img = p.images[0] ?? "";
    const usesItems = img.startsWith("/Items_Images/");
    const guesses = guessFilenames(p.name);
    const match = guesses.find((g) => itemFiles.has(g));
    return {
      slug: p.slug,
      name: p.name,
      img,
      usesItems,
      hasLikelyMatch: Boolean(match),
      likelyFile: match ?? "",
    };
  })
  .filter((r) => !r.usesItems);

console.log("Items_Images files:", itemFiles.size);
console.log("Products not using Items_Images:", rows.length);

for (const r of rows.slice(0, 80)) {
  console.log(
    [
      r.slug,
      "|",
      r.name,
      "|",
      r.img || "(no image)",
      r.hasLikelyMatch ? `| MATCH: ${r.likelyFile}` : "",
    ].join(" "),
  );
}

