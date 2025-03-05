import React, { ReactElement } from "react";
import { render as rtlRender, RenderOptions } from "@testing-library/react";

// Add any providers that components need here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  const rendered = rtlRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

  return {
    ...rendered,
    // Create a simple user object with methods we need
    user: {
      click: async (element: HTMLElement) => {
        element.click();
      },
    },
  };
};

// Re-export everything
export * from "@testing-library/react";

// Override render method
export { customRender as render };
