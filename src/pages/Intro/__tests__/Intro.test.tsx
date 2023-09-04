import { render, fireEvent } from "@testing-library/react";
import Intro from "../Intro";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as router from "react-router";

const navigate = vi.fn();

function removeElementByTestId(element: HTMLElement, testId: string) {
  const target = element.querySelector(`[data-testid="${testId}"]`);
  if (target) {
    target.remove();
  }
}

describe("Intro", () => {
  beforeEach(() => {
    vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    const utils = render(
      <MemoryRouter>
        <Intro />
      </MemoryRouter>
    );
    const score = utils.getByText("Asteroids");
    expect(score).toBeInTheDocument();
  });

  it("navigates to /play when start button is clicked", () => {
    const utils = render(
      <MemoryRouter>
        <Intro />
      </MemoryRouter>
    );
    const startButton = utils.getByTestId("play-button");
    expect(startButton).toBeInTheDocument();
    fireEvent.click(startButton);
    expect(navigate).toHaveBeenCalledWith("/play");
  });

  it("opens info popup", () => {
    const utils = render(
      <MemoryRouter>
        <Intro />
      </MemoryRouter>
    );
    const infoButton = utils.getByTestId("info-button");
    expect(infoButton).toBeInTheDocument();
    fireEvent.click(infoButton);
    expect(navigate).not.toHaveBeenCalled();
    const about = utils.getByText("About");
    expect(about).toBeInTheDocument();
    const qrCode = utils.getByTestId("qr-code");
    expect(qrCode).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <Intro />
      </MemoryRouter>
    );
    removeElementByTestId(container, "version"); // Version is automatically bumped, so remove from snapshot
    expect(container).toMatchSnapshot();
  });
});
