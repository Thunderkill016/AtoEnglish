/**
 * Web Push Notifications utility
 * Handles SW registration, push subscription, and VAPID key conversion
 */

const SW_URL = "/sw.js";

// Convert VAPID public key (base64url) to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
}

/**
 * Register Service Worker and return registration
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register(SW_URL, { scope: "/" });
    return reg;
  } catch (err) {
    console.error("[SW] Registration failed:", err);
    return null;
  }
}

/**
 * Request push permission and subscribe
 * Returns the PushSubscription object or null if denied/unsupported
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  if (!("PushManager" in window)) return null;

  const reg = await registerServiceWorker();
  if (!reg) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    // Check for existing subscription
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    // Create new subscription
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      // Cast needed: Uint8Array is BufferSource but TS lib.dom differs across versions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as any,
    });
    return subscription;
  } catch (err) {
    console.error("[Push] Subscription failed:", err);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Check current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}
