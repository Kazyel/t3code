// A synchronous IPC round trip to the main process, which relaunches the app to change it:
// read it once per bridge rather than on every render that asks.
const disabledByBridge = new WeakMap<object, boolean>();

export function isLocalEnvironmentDisabled(): boolean {
  const bridge = typeof window === "undefined" ? undefined : window.desktopBridge;
  if (!bridge) return false;
  let disabled = disabledByBridge.get(bridge);
  if (disabled === undefined) {
    disabled = bridge.getLocalEnvironmentEnabled() === false;
    disabledByBridge.set(bridge, disabled);
  }
  return disabled;
}
