/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { AdBanner, MiniAdBanner } from "@/components/AdBanner";

describe("AdBanner", () => {
  it("should render ad placeholder and upgrade button", () => {
    const onUpgradeMock = jest.fn();
    render(<AdBanner onUpgrade={onUpgradeMock} />);

    expect(screen.getByText("Advertisement")).toBeInTheDocument();
    expect(screen.getByText("Go Pro")).toBeInTheDocument();
  });

  it("should call onUpgrade when upgrade button is clicked", () => {
    const onUpgradeMock = jest.fn();
    render(<AdBanner onUpgrade={onUpgradeMock} />);

    fireEvent.click(screen.getByText("Go Pro"));
    expect(onUpgradeMock).toHaveBeenCalledTimes(1);
  });

  it("should have fixed positioning at bottom of screen", () => {
    const { container } = render(<AdBanner onUpgrade={() => {}} />);
    const banner = container.firstChild as HTMLElement;

    expect(banner.className).toContain("fixed");
    expect(banner.className).toContain("bottom-0");
    expect(banner.className).toContain("left-0");
    expect(banner.className).toContain("right-0");
  });
});

describe("MiniAdBanner", () => {
  it("should render ad-supported message and upgrade link", () => {
    const onUpgradeMock = jest.fn();
    render(<MiniAdBanner onUpgrade={onUpgradeMock} />);

    expect(screen.getByText("Ad-supported free tier")).toBeInTheDocument();
    expect(screen.getByText("Remove ads — $2.99")).toBeInTheDocument();
  });

  it("should call onUpgrade when upgrade link is clicked", () => {
    const onUpgradeMock = jest.fn();
    render(<MiniAdBanner onUpgrade={onUpgradeMock} />);

    fireEvent.click(screen.getByText("Remove ads — $2.99"));
    expect(onUpgradeMock).toHaveBeenCalledTimes(1);
  });

  it("should have minimal styling for less intrusive experience", () => {
    const { container } = render(<MiniAdBanner onUpgrade={() => {}} />);
    const banner = container.firstChild as HTMLElement;

    expect(banner.className).toContain("bg-track/50");
    expect(banner.className).toContain("border-t");
  });
});
