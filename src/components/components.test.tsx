import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { SourceBadge, RiskBadge } from "./ui/Badges";
import { FlagsChart } from "./dashboard/FlagsChart";
import { ConnectionStatusCard } from "./dashboard/ConnectionStatusCard";

describe("SourceBadge", () => {
  it("shows a demo label for demo data", () => {
    render(<SourceBadge source="demo" />);
    expect(screen.getByText("Demo data")).toBeInTheDocument();
  });

  it("shows nothing for live data", () => {
    const { container } = render(<SourceBadge source="live" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("RiskBadge", () => {
  it("states the level in text, not only colour", () => {
    render(<RiskBadge score={88} />);
    expect(screen.getByText(/High · 88/)).toBeInTheDocument();
  });
});

describe("FlagsChart", () => {
  const data = [
    { date: "2026-11-01", count: 3 },
    { date: "2026-11-02", count: 0 },
    { date: "2026-11-03", count: 7 },
  ];

  it("summarises the chart for screen readers", () => {
    render(<FlagsChart data={data} />);
    expect(
      screen.getByRole("img", { name: /1 Nov to 3 Nov\. 10 in total/ }),
    ).toBeInTheDocument();
  });

  it("offers a table containing every value", () => {
    render(<FlagsChart data={data} />);
    const rows = within(screen.getByRole("table", { hidden: true })).getAllByRole(
      "row",
      { hidden: true },
    );
    expect(rows.slice(1).map((r) => r.textContent)).toEqual([
      "1 Nov3",
      "2 Nov0",
      "3 Nov7",
    ]);
  });

  it("draws one bar per non-zero day", () => {
    const { container } = render(<FlagsChart data={data} />);
    expect(container.querySelectorAll("svg path")).toHaveLength(2);
  });

  it("shows a tooltip for the hovered day", () => {
    const { container } = render(<FlagsChart data={data} />);
    const hitTargets = container.querySelectorAll("svg rect");
    fireEvent.mouseEnter(hitTargets[2]);
    expect(screen.getByText("7 flagged")).toBeInTheDocument();
  });

  it("uses whole-number axis labels", () => {
    const { container } = render(
      <FlagsChart data={[{ date: "2026-11-01", count: 11 }]} />,
    );
    const labels = [...container.querySelectorAll("svg text")]
      .map((t) => t.textContent)
      .slice(0, 3);
    expect(labels).toEqual(["0", "6", "12"]);
  });

  it("shows an empty state instead of a blank chart", () => {
    render(<FlagsChart data={[]} />);
    expect(screen.getByText(/No flagged accounts/)).toBeInTheDocument();
  });
});

describe("ConnectionStatusCard", () => {
  it("tells the user they are not connected", () => {
    render(<ConnectionStatusCard status={{ state: "not_connected" }} />);
    expect(screen.getByText("Not connected")).toBeInTheDocument();
  });
});
