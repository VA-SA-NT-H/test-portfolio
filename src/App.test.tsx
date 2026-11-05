import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the app shell with a main landmark", () => {
  render(<App />);
  expect(screen.getByRole("main")).toBeInTheDocument();
});
