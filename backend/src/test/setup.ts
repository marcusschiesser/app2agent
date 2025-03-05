import { afterEach, vi, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Suppress React act() warnings
beforeAll(() => {
  // Mock console.error to suppress act() warnings
  const originalConsoleError = console.error;
  vi.spyOn(console, "error").mockImplementation((...args) => {
    // Filter out act() warnings
    if (args[0]?.includes?.("not wrapped in act(...)")) {
      return;
    }
    originalConsoleError(...args);
  });
});

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock for navigator.clipboard
if (!window.navigator.clipboard) {
  Object.defineProperty(window.navigator, "clipboard", {
    writable: true,
    value: {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    },
  });
}

// Mock for setTimeout
global.setTimeout = Object.assign(
  vi.fn().mockImplementation(() => {
    return {
      unref: vi.fn(),
    } as unknown as NodeJS.Timeout;
  }),
  { __promisify__: vi.fn() },
) as unknown as typeof setTimeout;

// Mock for useTransition
vi.mock("react", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useTransition: () => [false, (callback: () => void) => callback()],
  };
});
