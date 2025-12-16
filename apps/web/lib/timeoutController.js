/**
 * timeoutController.js
 *
 * This utility handles heavy data processing without blocking the main thread.
 * It uses chunking and yields control to the event loop to maintain UI responsiveness (INP).
 */

/**
 * Processes a large array of data in chunks to avoid blocking the main thread.
 *
 * @param {Array} items - The large array to process.
 * @param {Function} processItemFn - The function to process each item.
 * @param {number} [chunkSize=50] - Number of items to process before yielding.
 * @returns {Promise<Array>} - A promise that resolves with the processed results.
 */
export async function processLargeArrayAsync(items, processItemFn) {
  const results = [];
  const TIME_BUDGET_MS = 5; // Target 5ms to keep frame budget for 120fps/60fps devices

  let i = 0;
  while (i < items.length) {
    const start = performance.now();

    // Process items until time budget is exhausted
    // We check time after every item to ensure we don't block
    while (i < items.length) {
      results.push(processItemFn(items[i]));
      i++;

      if (performance.now() - start > TIME_BUDGET_MS) {
        break;
      }
    }

    // Yield to the main thread to allow UI updates/interactions
    if (i < items.length) {
      if (globalThis.scheduler?.yield) {
        await globalThis.scheduler.yield();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  return results;
}

/**
 * Example of a heavy computation function that might have been blocking.
 * @param {number} value
 * @returns {number}
 */
export function heavyComputation(value) {
  let result = 0;
  // Simulate heavy work
  for (let i = 0; i < 1000; i++) {
    result += Math.sqrt(value * i);
  }
  return result;
}
