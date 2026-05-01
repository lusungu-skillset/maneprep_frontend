/**
 * Cache Management Utilities
 * Provides helper functions for managing service worker caches
 */

/**
 * Notify the service worker to skip waiting and update
 */
export function notifyServiceWorkerToUpdate(): void {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SKIP_WAITING",
    });
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = () => {
      resolve();
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(
        {
          type: "CLEAR_CACHE",
        },
        [channel.port2]
      );
    } else {
      // No active service worker, resolve immediately
      resolve();
    }
  });
}

/**
 * Get cache usage information
 */
export async function getCacheSize(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  if (
    !("storage" in navigator) ||
    !("estimate" in navigator.storage)
  ) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage:
        estimate.quota && estimate.usage
          ? Math.round((estimate.usage / estimate.quota) * 100)
          : 0,
    };
  } catch (error) {
    console.error("Failed to get cache size:", error);
    return null;
  }
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine;
}

/**
 * Get persistent storage status
 */
export async function getPersistentStorageStatus(): Promise<{
  persisted: boolean;
  available: boolean;
} | null> {
  if (!("storage" in navigator) || !("persisted" in navigator.storage)) {
    return null;
  }

  try {
    const persisted = await navigator.storage.persisted();
    return {
      persisted,
      available: true,
    };
  } catch (error) {
    console.error("Failed to check persistent storage:", error);
    return null;
  }
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!("storage" in navigator) || !("persist" in navigator.storage)) {
    return false;
  }

  try {
    return await navigator.storage.persist();
  } catch (error) {
    console.error("Failed to request persistent storage:", error);
    return false;
  }
}
