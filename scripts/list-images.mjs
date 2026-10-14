// Rewrites src/content/builtin-images.ts from the files in public/images and public/tech.
import fs from "node:fs";
const list = (dir) =>
  fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|svg|gif)$/i.test(f)).sort();
const block = (name, dir, prefix) =>
  `export const ${name}: string[] = [\n${list(dir).map((f) => `  "${prefix}/${f}",`).join("\n")}\n];\n`;
fs.writeFileSync(
  "src/content/builtin-images.ts",
  "/* Pictures that ship with the website. Regenerate with `node scripts/list-images.mjs` after adding files to public/images or public/tech. */\n" +
    block("builtinImages", "public/images", "/images") +
    "\n" +
    block("builtinLogos", "public/tech", "/tech"),
);
