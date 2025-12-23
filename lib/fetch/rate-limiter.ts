// ============================================
// FILE: lib/rate-limiter.ts
// ============================================
export class RateLimiter {
  private queue: (() => Promise<void>)[] = [];
  private running = 0;

  constructor(
    private maxConcurrent: number = 5,
    private delayMs: number = 1000
  ) {}

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const fn = this.queue.shift()!;

    await fn();
    await new Promise((resolve) => setTimeout(resolve, this.delayMs));

    this.running--;
    this.process();
  }
}
