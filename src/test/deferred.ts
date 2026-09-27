// A promise the test resolves whenever it wants, to decide in which order requests finish. Same as
// Promise.withResolvers(), which Node 18 doesn't have
export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}
