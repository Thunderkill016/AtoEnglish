import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(__dirname, "../..");
const missionDomainRoot = resolve(repositoryRoot, "src/lib/missions");

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) return collectTypeScriptFiles(path);
    if (!entry.isFile() || !entry.name.endsWith(".ts")) return [];

    return [path];
  });
}

const forbiddenDependencies = [
  { name: "React", pattern: /(?:from\s+|import\s*)["']react(?:\/[^"']*)?["']/ },
  { name: "Next.js", pattern: /(?:from\s+|import\s*)["']next(?:\/[^"']*)?["']/ },
  { name: "Supabase packages", pattern: /(?:from\s+|import\s*)["']@supabase\// },
  { name: "Supabase adapters", pattern: /(?:from\s+|import\s*)["']@\/lib\/supabase(?:\/[^"']*)?["']/ },
  { name: "App Router files", pattern: /(?:from\s+|import\s*)["']@\/app\// },
  { name: "UI components", pattern: /(?:from\s+|import\s*)["']@\/components\// },
];

describe("architecture boundaries", () => {
  const missionDomainFiles = collectTypeScriptFiles(missionDomainRoot);

  it("finds Mission Engine domain files", () => {
    expect(missionDomainFiles.length).toBeGreaterThan(0);
  });

  it.each(missionDomainFiles)(
    "%s remains framework- and infrastructure-independent",
    (file) => {
      const source = readFileSync(file, "utf8");
      const fileName = relative(repositoryRoot, file);

      expect(source, `${fileName} must not be a client module`).not.toMatch(
        /^\s*["']use client["'];?/m,
      );
      expect(source, `${fileName} must not be a server-action module`).not.toMatch(
        /^\s*["']use server["'];?/m,
      );

      for (const dependency of forbiddenDependencies) {
        expect(
          source,
          `${fileName} must not import ${dependency.name}`,
        ).not.toMatch(dependency.pattern);
      }
    },
  );
});
