import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

run("npx", ["prisma", "generate"]);

const migrationsDir = "prisma/migrations";
const hasMigrations =
  existsSync(migrationsDir) && readdirSync(migrationsDir).length > 0;

if (hasMigrations) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  run("npx", ["prisma", "db", "push"]);
}

run("npx", ["next", "build"]);

