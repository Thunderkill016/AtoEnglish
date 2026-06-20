#!/usr/bin/env node
/**
 * mcp-memory-server.mjs
 * MCP server để Antigravity IDE dùng memory system của AtoEnglish
 *
 * Tools:
 *   - store_memory  : Lưu quyết định / context / bug vào Supabase vector DB
 *   - search_memory : Tìm kiếm semantic trong memory
 */

import { createInterface } from "node:readline";

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  "https://vhpfskkredizeazlyzsh.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${SUPABASE_KEY}`,
  apikey: SUPABASE_KEY,
};

// ─── Edge Function Callers ──────────────────────────────────────────────────
async function storeMemory({ content, category = "context", project = "atoenglish", metadata = {} }) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/store-memory`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ content, category, project, metadata }),
  });
  if (!res.ok) throw new Error(`store-memory HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function searchMemory({ query, threshold = 0.70, limit = 8, project = "atoenglish", category }) {
  const body = { query, threshold, limit, project };
  if (category) body.category = category;
  const res = await fetch(`${SUPABASE_URL}/functions/v1/search-memories`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`search-memories HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

// ─── Tool Definitions ──────────────────────────────────────────────────────
const TOOLS = [
  {
    name: "store_memory",
    description:
      "Lưu một memory mới vào AtoEnglish vector DB. Dùng để ghi lại quyết định, bug fix, context quan trọng giữa các conversation.",
    inputSchema: {
      type: "object",
      required: ["content"],
      properties: {
        content: {
          type: "string",
          description: "Nội dung cần nhớ (tiếng Việt hoặc tiếng Anh đều được)",
        },
        category: {
          type: "string",
          enum: ["decision", "architecture", "context", "bug", "feature", "rule", "task"],
          description: "Loại memory. Default: context",
        },
        project: {
          type: "string",
          description: "Tên project. Default: atoenglish",
        },
        metadata: {
          type: "object",
          description: "Metadata tùy chọn, ví dụ {importance: 8}",
        },
      },
    },
  },
  {
    name: "search_memory",
    description:
      "Tìm kiếm semantic trong memory của AtoEnglish. Dùng khi cần nhớ lại quyết định cũ, context, hoặc bug đã fix.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: {
          type: "string",
          description: "Câu hỏi hoặc từ khóa tìm kiếm",
        },
        threshold: {
          type: "number",
          description: "Ngưỡng similarity (0-1). Default: 0.70",
        },
        limit: {
          type: "number",
          description: "Số kết quả tối đa. Default: 8",
        },
        category: {
          type: "string",
          enum: ["decision", "architecture", "context", "bug", "feature", "rule", "task"],
          description: "Filter theo category (optional)",
        },
      },
    },
  },
];

// ─── MCP Protocol Helpers ──────────────────────────────────────────────────
function send(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

function sendResult(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

// ─── Request Handler ───────────────────────────────────────────────────────
async function handleRequest(msg) {
  const { id, method, params } = msg;

  // Notifications have no id — respond only to requests (id !== undefined)
  const isNotification = id === undefined || id === null;

  try {
    switch (method) {
      case "initialize":
        sendResult(id, {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "atoenglish-memory", version: "1.0.0" },
        });
        break;

      case "tools/list":
        sendResult(id, { tools: TOOLS });
        break;

      case "tools/call": {
        const { name, arguments: args } = params ?? {};
        let data;
        if (name === "store_memory") {
          data = await storeMemory(args ?? {});
        } else if (name === "search_memory") {
          data = await searchMemory(args ?? {});
        } else {
          if (!isNotification) sendError(id, -32601, `Unknown tool: ${name}`);
          break;
        }
        sendResult(id, {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        });
        break;
      }

      case "ping":
        if (!isNotification) sendResult(id, {});
        break;

      // Notifications — no response needed
      case "notifications/initialized":
      case "notifications/cancelled":
      case "$/cancelRequest":
        break;

      default:
        if (!isNotification) {
          sendError(id, -32601, `Method not found: ${method}`);
        }
    }
  } catch (err) {
    process.stderr.write(`[mcp-memory] ERROR in ${method}: ${err.message}\n`);
    if (!isNotification) {
      sendError(id, -32000, err.message);
    }
  }
}

// ─── stdio loop — keep alive ───────────────────────────────────────────────
process.stdin.resume(); // prevent exit on stdin EOF

const rl = createInterface({ input: process.stdin, terminal: false, crlfDelay: Infinity });

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    process.stderr.write(`[mcp-memory] JSON parse error: ${trimmed.slice(0, 80)}\n`);
    return;
  }
  handleRequest(msg).catch((err) => {
    process.stderr.write(`[mcp-memory] Unhandled error: ${err.message}\n`);
  });
});

rl.on("close", () => {
  process.stderr.write("[mcp-memory] stdin closed, server staying alive\n");
  // Do NOT exit — let the IDE reconnect if needed
});

process.on("uncaughtException", (err) => {
  process.stderr.write(`[mcp-memory] uncaughtException: ${err.message}\n`);
});

process.on("unhandledRejection", (reason) => {
  process.stderr.write(`[mcp-memory] unhandledRejection: ${reason}\n`);
});

process.stderr.write("[mcp-memory] AtoEnglish Memory MCP server started ✓\n");
