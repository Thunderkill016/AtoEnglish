#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredPaths = [
  ".specify/memory/constitution.md",
  ".specify/integration.json",
  "specs/001-spec-kit-brownfield-adoption/spec.md",
  "specs/001-spec-kit-brownfield-adoption/plan.md",
  "specs/001-spec-kit-brownfield-adoption/tasks.md",
  "specs/001-spec-kit-brownfield-adoption/document-inventory.md",
  "docs/README.md",
  "AGENTS.md",
  "README.md",
  "SECURITY.md",
];
const statusPolicies = [
  { directory: "docs/architecture", status: "reference" },
  { directory: "docs/core", status: "reference" },
  { directory: "docs/learning-system", status: "reference" },
  { directory: "docs/nep", status: "reference" },
  { directory: "docs/reference", status: "reference" },
  { directory: "docs/history", status: "historical" },
];

export function detectRetiredAuthority(relativePaths) {
  return relativePaths
    .filter((relativePath) => retiredAuthorityPaths.includes(relativePath))
    .map((relativePath) => `retired-authority-present:${relativePath}`);
}

function collectMarkdownFiles(directory, relativeDirectory = "") {
  const absoluteDirectory = path.join(directory, relativeDirectory);
  if (!existsSync(absoluteDirectory)) return [];
  return statSync(absoluteDirectory).isDirectory()
    ? readFileNames(absoluteDirectory).flatMap((name) =>
        collectMarkdownFiles(directory, path.join(relativeDirectory, name)),
      )
    : relativeDirectory.endsWith(".md")
      ? [relativeDirectory]
      : [];
}

function readFileNames(directory) {
  return readdirSync(directory);
}
const retiredAuthorityPaths = [
  "AGENT_BACKLOG.md",
  "AGENT_PLAN.md",
  "AGENT_REPORT.md",
  "AGENT_ROADMAP.md",
  "docs/product/PRODUCT_TRUTH.md",
  "docs/product/CURRENT_PRIORITY.md",
  "docs/product/DO_NOT_BUILD.md",
];

export function inspectSourceOfTruth(baseDir = root) {
  const problems = [];
  for (const relativePath of requiredPaths) {
    if (!existsSync(path.join(baseDir, relativePath))) problems.push(`missing-required:${relativePath}`);
  }
  problems.push(
    ...detectRetiredAuthority(
      retiredAuthorityPaths.filter((relativePath) => existsSync(path.join(baseDir, relativePath))),
    ),
  );

  const constitutionPath = path.join(baseDir, ".specify/memory/constitution.md");
  if (existsSync(constitutionPath)) {
    const constitution = readFileSync(constitutionPath, "utf8");
    if (!constitution.includes("**Version**: 1.0.0")) problems.push("constitution-version-missing");
    if (!constitution.includes("highest project governance artifact")) {
      problems.push("constitution-precedence-missing");
    }
  }

  for (const { directory, status } of statusPolicies) {
    for (const relativePath of collectMarkdownFiles(baseDir, directory)) {
      const document = readFileSync(path.join(baseDir, relativePath), "utf8");
      const header = document.split("\n").slice(0, 8).join("\n");
      if (!header.includes(`**Document status:** ${status}`)) {
        problems.push(`invalid-document-status:${relativePath}`);
      }
      if (!header.includes("**Governing authority:**")) {
        problems.push(`governing-authority-missing:${relativePath}`);
      }
    }
  }

  const linkedDocuments = [
    "AGENTS.md",
    "AGENT_AUTOPILOT.md",
    "README.md",
    "SECURITY.md",
    ...collectMarkdownFiles(baseDir, "docs"),
    ...collectMarkdownFiles(baseDir, "specs/001-spec-kit-brownfield-adoption"),
  ].filter((relativePath) => existsSync(path.join(baseDir, relativePath)));
  for (const relativePath of linkedDocuments) {
    const absolutePath = path.join(baseDir, relativePath);
    const document = readFileSync(absolutePath, "utf8");
    for (const match of document.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split("#", 1)[0];
      if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
      const resolved = path.resolve(path.dirname(absolutePath), decodeURIComponent(target));
      if (!existsSync(resolved)) problems.push(`broken-markdown-link:${relativePath}->${target}`);
    }
  }
  return problems;
}

export function runSelfTest() {
  const missing = inspectSourceOfTruth(path.join(root, "scripts", "fixtures", "missing-governance"));
  if (!missing.some((problem) => problem.startsWith("missing-required:"))) {
    throw new Error("self-test did not detect missing governance");
  }
  const stale = detectRetiredAuthority(["AGENT_PLAN.md"]);
  if (!stale.includes("retired-authority-present:AGENT_PLAN.md")) {
    throw new Error("self-test did not detect stale authority");
  }
  return true;
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
  console.log("source-of-truth self-test: PASS");
} else {
  const problems = inspectSourceOfTruth();
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("source-of-truth check: PASS");
  }
}
