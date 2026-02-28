import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma";
import { categories, products } from "../lib/sample-data";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@likithasweets.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: adminEmail,
      name: "Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  const categoryIdBySlug = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { id: c.id, name: c.name, slug: c.slug },
    });
    categoryIdBySlug.set(c.slug, cat.id);
  }

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.category);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
        categoryId,
        isActive: true,
      },
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        categoryId,
        isActive: true,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

