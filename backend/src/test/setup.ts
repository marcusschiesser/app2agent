import { expect, afterEach, vi, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom";

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

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
global.setTimeout = vi.fn().mockImplementation((callback, timeout) => {
  return {
    unref: vi.fn(),
  } as unknown as NodeJS.Timeout;
});

// Mock for useTransition
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTransition: () => [false, (callback: () => void) => callback()],
  };
});
