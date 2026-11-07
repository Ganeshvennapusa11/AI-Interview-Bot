/**
 * Cross-platform syntax check for every server source file.
 * Run:  npm test
 */
import { readdirSync, statSync } from "fs";
import { execFileSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const collect = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return collect(full);
    return full.endsWith(".js") ? [full] : [];
  });

const files = [...collect(path.join(serverRoot, "src")), ...collect(path.join(serverRoot, "scripts"))];

let failed = 0;

for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${path.relative(serverRoot, file)}`);
    console.error(String(error.stderr || error.message).trim());
  }
}

console.log(`${files.length - failed}/${files.length} files passed the syntax check.`);
process.exit(failed > 0 ? 1 : 0);
