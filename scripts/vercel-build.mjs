import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

run("npx", ["prisma", "generate"]);

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

if (hasDatabaseUrl) {
  const migrationsDir = "prisma/migrations";
  const hasMigrations =
    existsSync(migrationsDir) && readdirSync(migrationsDir).length > 0;

  if (hasMigrations) {
    run("npx", ["prisma", "migrate", "deploy"]);
  } else {
    run("npx", ["prisma", "db", "push"]);
  }
} else {
  console.log(
    "[vercel-build] DATABASE_URL not set; skipping prisma migrate/db push (demo mode build).",
  );
}

run("npx", ["next", "build"]);

