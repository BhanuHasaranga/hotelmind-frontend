import "@testing-library/jest-dom";

// Recharts' ResponsiveContainer relies on ResizeObserver, which jsdom doesn't implement.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
  (globalThis as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverMock;
}
