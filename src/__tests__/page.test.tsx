import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Home from "@/app/page";

test("Home Page", () => {
  render(<Home />);

  // Check if the Next.js logo is rendered
  expect(screen.getByAltText("Next.js logo")).toBeDefined();

  // Check if the "Get started by editing" text is present
  expect(screen.getByText(/Get started by editing/i)).toBeDefined();

  // Check if the "Deploy now" button is rendered
  expect(screen.getByRole("link", { name: /Deploy now/i })).toBeDefined();

  // Check if the "Read our docs" button is rendered
  expect(screen.getByRole("link", { name: /Read our docs/i })).toBeDefined();

  // Check if the footer links are rendered
  expect(screen.getByRole("link", { name: /Learn/i })).toBeDefined();
  expect(screen.getByRole("link", { name: /Examples/i })).toBeDefined();
  expect(screen.getByRole("link", { name: /Go to nextjs.org/i })).toBeDefined();
});
