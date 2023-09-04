import { render } from "@testing-library/react";
import Scene from "../Scene";
import { expect } from "vitest";

describe("Scene", () => {
  it("matches snapshot", () => {
    const { container } = render(<Scene />);
    expect(container).toMatchSnapshot();
  });
});
