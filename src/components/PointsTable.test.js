import React from "react";
import { render, screen, act } from "@testing-library/react";
import PointsTable from "./PointsTable";
import { fetchAllTransactions } from "../services/transactionAPI";
import { transactionsDemo } from "../constants/transactionDemo";
import { getMostRecentThreeMonthNames } from "./PointsTable";

jest.mock("../services/transactionAPI", () => ({
  fetchAllTransactions: jest.fn(),
}));

describe("PointsTable component", () => {
  beforeEach(() => {
    fetchAllTransactions.mockResolvedValue(transactionsDemo);
  });

  it("should display the points table", async () => {
    await act(async () => {
      render(<PointsTable />);
    });
    const table = screen.getByTestId("points-table");
    expect(table).toBeInTheDocument();
  });

  it("should display the correct month names", async () => {
    await act(async () => {
      render(<PointsTable />);
    });
    const months = getMostRecentThreeMonthNames();

    months.forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });

  const rewardCustomers = [
    {
      customerId: 101,
      months: { May: 90, September: 10, November: 90 },
      totalPoints: 100,
    },
    {
      customerId: 102,
      months: { September: 30, October: 250 },
      totalPoints: 280,
    },
  ];
  it("should calculate the points correctly", async () => {
    await act(async () => {
      render(<PointsTable />);
    });
    const customerIdCells = await screen.findAllByTestId("customerId-cell");
    const totalPointsCells = await screen.findAllByTestId("totalPoints-cell");

    rewardCustomers.forEach((customer, idx) => {
      expect(customerIdCells[idx]).toHaveTextContent(customer.customerId);
      expect(totalPointsCells[idx]).toHaveTextContent(customer.totalPoints);
    });
  });
});
