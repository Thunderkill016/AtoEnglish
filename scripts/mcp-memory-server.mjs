#!/usr/bin/env node
/**
 * mcp-memory-server.mjs  v2.0
 * MCP server để Antigravity IDE dùng memory system của AtoEnglish
 *
 * Tools:
 *   - store_memory   : Lưu memory mới vào Supabase vector DB
 *   - search_memory  : Tìm kiếm semantic trong memory
 *   - list_memories  : Duyệt tất cả memories (có filter category)
 *   - delete_memory  : Xoá memory theo ID
 *   - update_memory  : Sửa nội dung memory (re-embed tự động)
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
async function storeMemory({ content, category = "context", project = "atoenglish", importance, tags, metadata = {} }) {
  const meta = { ...metadata };
  if (importance) meta.importance = importance;
  if (tags) meta.tags = tags;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/store-memory`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ content, category, project, metadata: meta }),
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

async function listMemories({ category, project = "atoenglish", limit = 20, offset = 0 }) {
  const body = { project, limit, offset };
  if (category) body.category = category;
  const res = await fetch(`${SUPABASE_URL}/functions/v1/list-memories`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`list-memories HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function deleteMemory({ id }) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/manage-memory`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ action: "delete", id }),
  });
  if (!res.ok) throw new Error(`manage-memory HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function updateMemory({ id, content, category, metadata }) {
  const body = { action: "update", id, content };
  if (category) body.category = category;
  if (metadata) body.metadata = metadata;
  const res = await fetch(`${SUPABASE_URL}/functions/v1/manage-memory`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`manage-memory HTTP ${res.status}: ${await res.text()}`);
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
        importance: {
          type: "number",
          description: "Độ quan trọng 1-10. Default: 5",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags để filter sau này, ví dụ ['supabase', 'auth']",
        },
        project: {
          type: "string",
          description: "Tên project. Default: atoenglish",
        },
      },
    },
  },
  {
    name: "search_memory",
    description:
      "Tìm kiếm semantic trong memory DB — tìm bằng nghĩa, không cần đúng keyword. Dùng trước khi bắt đầu task để lấy context.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: {
          type: "string",
          description: "Câu hỏi hoặc từ khóa cần tìm",
        },
        limit: {
          type: "number",
          description: "Số kết quả tối đa. Default: 8",
        },
        threshold: {
          type: "number",
          description: "Ngưỡng similarity 0-1. Default: 0.70",
        },
        category: {
          type: "string",
          enum: ["decision", "architecture", "context", "bug", "feature", "rule", "task"],
          description: "Filter theo category (optional)",
        },
      },
    },
  },
  {
    name: "list_memories",
    description:
      "Liệt kê tất cả memories (có thể filter theo category). Dùng để xem tổng quan hoặc tìm ID để delete/update.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["decision", "architecture", "context", "bug", "feature", "rule", "task"],
          description: "Filter theo category (optional — bỏ trống để xem tất cả)",
        },
        limit: {
          type: "number",
          description: "Số memories tối đa. Default: 20",
        },
        offset: {
          type: "number",
          description: "Bỏ qua N memories đầu (pagination). Default: 0",
        },
      },
    },
  },
  {
    name: "delete_memory",
    description:
      "Xoá một memory theo ID. Dùng khi memory đã lỗi thời hoặc sai. Lấy ID từ list_memories hoặc search_memory.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "number",
          description: "ID của memory cần xoá",
        },
      },
    },
  },
  {
    name: "update_memory",
    description:
      "Sửa nội dung một memory theo ID. Tự động re-embed nội dung mới. Dùng khi thông tin thay đổi (bug đã fix, quyết định đã đổi).",
    inputSchema: {
      type: "object",
      required: ["id", "content"],
      properties: {
        id: {
          type: "number",
          description: "ID của memory cần sửa",
        },
        content: {
          type: "string",
          description: "Nội dung mới (sẽ re-embed tự động)",
        },
        category: {
          type: "string",
          enum: ["decision", "architecture", "context", "bug", "feature", "rule", "task"],
          description: "Đổi category (optional)",
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
  const isNotification = id === undefined || id === null;

  try {
    switch (method) {
      case "initialize":
        sendResult(id, {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "atoenglish-memory", version: "2.0.0" },
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
        } else if (name === "list_memories") {
          data = await listMemories(args ?? {});
        } else if (name === "delete_memory") {
          data = await deleteMemory(args ?? {});
        } else if (name === "update_memory") {
          data = await updateMemory(args ?? {});
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

// ─── stdio loop ────────────────────────────────────────────────────────────
process.stdin.resume();

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
});

process.on("uncaughtException", (err) => {
  process.stderr.write(`[mcp-memory] uncaughtException: ${err.message}\n`);
});

process.on("unhandledRejection", (reason) => {
  process.stderr.write(`[mcp-memory] unhandledRejection: ${reason}\n`);
});

process.stderr.write("[mcp-memory] AtoEnglish Memory MCP server v2.0 started ✓\n");
