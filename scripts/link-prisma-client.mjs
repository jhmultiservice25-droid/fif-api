import { mkdirSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const generated = join(root, "node_modules/.prisma");
const link = join(root, "node_modules/@prisma/client/node_modules/.prisma");

mkdirSync(dirname(link), { recursive: true });
rmSync(link, { recursive: true, force: true });
symlinkSync(relative(dirname(link), generated), link);
