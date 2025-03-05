import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { ThemeSelector } from "../ThemeSelector";

describe("ThemeSelector", () => {
  it("renders with the correct initial theme selected", () => {
    const onThemeChangeMock = vi.fn();
    render(<ThemeSelector theme="support" onThemeChange={onThemeChangeMock} />);

    expect(screen.getByText("Theme:")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("IT-Support");
  });

  it("applies the provided className", () => {
    const customClassName = "custom-class";
    const onThemeChangeMock = vi.fn();

    const { container } = render(
      <ThemeSelector
        theme="support"
        onThemeChange={onThemeChangeMock}
        className={customClassName}
      />,
    );

    const themeContainer = container.firstChild;
    expect(themeContainer).toHaveClass(customClassName);
  });

  it("calls onThemeChange when a different theme is selected", async () => {
    const onThemeChangeMock = vi.fn();
    const { user } = render(
      <ThemeSelector theme="support" onThemeChange={onThemeChangeMock} />,
    );

    // Open the dropdown
    const selectButton = screen.getByRole("combobox");
    await user.click(selectButton);

    // Select the "AI-Tutor" option
    const tutorOption = screen.getByRole("option", { name: "AI-Tutor" });
    await user.click(tutorOption);

    // Check that onThemeChange was called with the correct theme
    expect(onThemeChangeMock).toHaveBeenCalledWith("tutor");
  });

  it('renders with "tutor" theme selected', () => {
    const onThemeChangeMock = vi.fn();
    render(<ThemeSelector theme="tutor" onThemeChange={onThemeChangeMock} />);

    expect(screen.getByRole("combobox")).toHaveTextContent("AI-Tutor");
  });

  it("contains both theme options in the dropdown", async () => {
    const onThemeChangeMock = vi.fn();
    const { user } = render(
      <ThemeSelector theme="support" onThemeChange={onThemeChangeMock} />,
    );

    // Open the dropdown
    const selectButton = screen.getByRole("combobox");
    await user.click(selectButton);

    // Check that both options are available
    expect(
      screen.getByRole("option", { name: "IT-Support" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "AI-Tutor" }),
    ).toBeInTheDocument();
  });
});
