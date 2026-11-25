/**
 * Text editing menus the main process handed to a renderer to draw, keyed by request. A renderer
 * shows one menu at a time, so opening another drops whatever it left unanswered.
 */
const pending = new Map<
  string,
  { readonly senderId: number; readonly actions: ReadonlyMap<string, () => void> }
>();

let lastRequestId = 0;

export function register(senderId: number, actions: ReadonlyMap<string, () => void>): string {
  for (const [requestId, entry] of pending) {
    if (entry.senderId === senderId) pending.delete(requestId);
  }
  const requestId = String(++lastRequestId);
  pending.set(requestId, { senderId, actions });
  return requestId;
}

export function resolve(senderId: number, requestId: string, itemId: string | null): void {
  const entry = pending.get(requestId);
  if (entry === undefined || entry.senderId !== senderId) return;
  pending.delete(requestId);
  if (itemId !== null) entry.actions.get(itemId)?.();
}
