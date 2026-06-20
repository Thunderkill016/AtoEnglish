// AtoEnglish Service Worker — Web Push + offline caching
const CACHE_NAME = "atoenglish-v1";
const STATIC_ASSETS = ["/", "/manifest.webmanifest", "/favicon.ico"];

// ── Install ────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Push Notification ──────────────────────────────────
self.addEventListener("push", (event) => {
  let data = { title: "AtoEnglish", body: "Đừng quên học tiếng Anh hôm nay! 🔥", icon: "/icon-192.png" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/icon-192.png",
      badge: "/icon-192.png",
      tag: "streak-reminder",
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: "/dashboard" },
      actions: [
        { action: "learn", title: "🎯 Học ngay" },
        { action: "dismiss", title: "Để sau" },
      ],
    })
  );
});

// ── Notification Click ─────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.action === "learn"
    ? "/learn"
    : (event.notification.data?.url || "/dashboard");

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const existing = clientList.find((c) => c.url.includes(self.location.origin) && "focus" in c);
      if (existing) {
        existing.focus();
        existing.navigate(targetUrl);
      } else {
        clients.openWindow(targetUrl);
      }
    })
  );
});
