let workerIsReady = false;
let workerStartError: Error | undefined;
let resolveWorkerReady: (() => void) | undefined;
let rejectWorkerReady: ((error: Error) => void) | undefined;
let workerReadyPromise: Promise<void> | undefined;

export function waitForMockWorker() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled" || workerIsReady) {
    return Promise.resolve();
  }
  if (workerStartError) {
    return Promise.reject(workerStartError);
  }
  workerReadyPromise ??= new Promise<void>((resolve, reject) => {
    resolveWorkerReady = resolve;
    rejectWorkerReady = reject;
  });
  return workerReadyPromise;
}

export function markMockWorkerReady() {
  workerIsReady = true;
  resolveWorkerReady?.();
}

export function markMockWorkerFailed(error: Error) {
  workerStartError = error;
  rejectWorkerReady?.(error);
}
