// Quick Upstash connection test — run with: node --env-file=.env.local scripts/test-upstash.mjs
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

try {
  const testKey = "atoenglish:connection-test";
  await redis.set(testKey, "ok", { ex: 10 }); // expire in 10s
  const val = await redis.get(testKey);
  if (val === "ok") {
    console.log("✅ Upstash Redis connected successfully!");
  } else {
    console.error("❌ Unexpected value:", val);
  }
} catch (err) {
  console.error("❌ Upstash connection failed:", err.message);
}
