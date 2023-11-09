import { useEffect, useState } from "react";
import { fetchAllTransactions } from "../services/transactionAPI";
import { monthNames } from "../constants/monthNames";
import "./PointsTable.css";

export const getMostRecentThreeMonthNames = () => {
  const monthToday = new Date().getMonth();
  const recentThreeMonths = [];
  for (let i = 0; i < 3; i++) {
    const monthDiff = monthToday - i;
    if (monthDiff >= 0) {
      recentThreeMonths.push(monthNames[monthDiff]);
    } else {
      recentThreeMonths.push(monthNames[monthNames.length + monthDiff]);
    }
  }
  return recentThreeMonths.reverse();
};

const calculatePointsPerTransaction = (amount) => {
  let points = 0;
  if (amount > 100) {
    points = 2 * (amount - 100) + 50;
  } else if (amount > 50) {
    points = amount - 50;
  }
  return points;
};

const formatRewardsByCustomer = (transactions) => {
  const rewardCustomersObj = {};

  transactions.forEach((transaction) => {
    const { customerId, amount, date } = transaction;
    const points = calculatePointsPerTransaction(amount);
    const transactionDate = new Date(date);
    const monthName = monthNames[transactionDate.getMonth()];

    const customer = rewardCustomersObj[customerId];

    if (!customer) {
      rewardCustomersObj[customerId] = {
        customerId,
        [monthName]: 0,
        totalPoints: 0,
      };
    }

    if (rewardCustomersObj[customerId][monthName]) {
      rewardCustomersObj[customerId][monthName] =
        rewardCustomersObj[customerId][monthName] + points;
    } else {
      rewardCustomersObj[customerId][monthName] = points;
    }

    const today = new Date();
    const threeMonthsAgo = today.setMonth(today.getMonth() - 2);
    if (transactionDate >= threeMonthsAgo) {
      rewardCustomersObj[customerId].totalPoints =
        rewardCustomersObj[customerId].totalPoints + points;
    }
  });

  const rewardCustomersArr = Object.values(rewardCustomersObj);
  return rewardCustomersArr;
};

const PointsTable = () => {
  const [displayedRewards, setDisplayedRewards] = useState([]);

  useEffect(() => {
    fetchAllTransactions().then((transactions) => {
      const rewards = formatRewardsByCustomer(transactions);
      setDisplayedRewards(rewards);
    });
  }, []);

  return (
    <table data-testid="points-table" className="points__table">
      <thead>
        <tr>
          <th>Customer ID</th>
          {getMostRecentThreeMonthNames().map((month) => (
            <th key={month} data-testid={`${month}-heading`}>
              {month}
            </th>
          ))}
          <th>Total Points</th>
        </tr>
      </thead>
      <tbody>
        {displayedRewards.map((customer) => {
          return (
            <tr key={customer.customerId}>
              <td data-testid="customerId-cell">{customer.customerId}</td>
              {getMostRecentThreeMonthNames().map((month) => (
                <td key={`${month}-${customer.customerId}`}>
                  {customer[month] ?? 0}
                </td>
              ))}
              <td data-testid="totalPoints-cell">{customer.totalPoints}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PointsTable;
