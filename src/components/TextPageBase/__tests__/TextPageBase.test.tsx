import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TextPageBase from "../TextPageBase";
import { MockPage, mockPageText } from "./MockPage";

const title = "Test Title";
const children = <p>Test Children</p>;

describe("TextPageBase", () => {
  it("renders the title and children", () => {
    render(
      <MemoryRouter>
        <TextPageBase title={title}>{children}</TextPageBase>
      </MemoryRouter>
    );
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });

  it("navigates away from the component when the link is clicked", () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/text-page"]} initialIndex={0}>
        <Routes>
          <Route
            path="/text-page"
            element={<TextPageBase title={title}>{children}</TextPageBase>}
          />
          <Route path="/" element={<MockPage />} />
        </Routes>
      </MemoryRouter>
    );
    const backArrow = getByTestId("back-arrow");
    expect(backArrow).toBeInTheDocument();
    fireEvent.click(backArrow);
    expect(screen.getByText(mockPageText)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TextPageBase title={title}>{children}</TextPageBase>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
