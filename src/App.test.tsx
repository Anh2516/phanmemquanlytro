import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders TroHom header", () => {
  render(<App />);
  expect(screen.getByRole("banner")).toHaveTextContent(/TroHom/i);
});
