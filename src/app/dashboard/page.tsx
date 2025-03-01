"use client";

import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";
import CardOrderSummary from "./CardOrderSummary";
import { useGetStatisticAnalysisQuery } from "@/state/api";

const Dashboard = () => {

  const { data, isLoading } = useGetStatisticAnalysisQuery();
  
  if (isLoading) {
    return <div className="m-5">Loading...</div>;
  }


  const currentDate = new Date();

// Get the first day of the current month (set day to 1)
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// Get the last day of the current month (set day to 1 of the next month, then subtract 1 day)
const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

// Function to format dates to "dd MMMM yyyy"
const formatDateStart = (date: Date) => {
  const options = { day: '2-digit', month: '2-digit' } as const;
  return date.toLocaleDateString('en-US', options);
};
const formatDateEnd = (date: Date) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
  return date.toLocaleDateString('en-US', options);
};

const formattedStartDate = formatDateStart(firstDayOfMonth);
const formattedEndDate = formatDateEnd(lastDayOfMonth);

const dateRange = `${formattedStartDate} - ${formattedEndDate}`;




  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardSalesSummary />
      {/* <CardPurchaseSummary /> */}
      <CardOrderSummary />
      <CardExpenseSummary />
      <StatCard
        // title="Customer & Expenses"
        title="Sales & Purchases"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        // dateRange="22 - 29 October 2023"
        dateRange={dateRange}
        details={[
          {
            title: "Sales",
            amount: `${data!.totalSales}`,
            changePercentage: data!.salesChangePercentage,
            IconComponent: data!.salesChangePercentage > 0 ? TrendingUp : TrendingDown,
          },
          {
            title: "Purchases",
            amount: `${data!.totalPurchases}`,
            changePercentage: data!.purchasesChangePercentage,
            IconComponent: data!.purchasesChangePercentage > 0 ? TrendingUp : TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Expenses & Customer"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange={dateRange}
        details={[
          {
            title: "Expenses",
            amount: `${data!.totalExpenses}`,
            changePercentage: data!.expensesChangePercentage,
            IconComponent: data!.expensesChangePercentage > 0 ? TrendingUp : TrendingDown,
          },
          {
            title: "Customer Growth",
            amount: `${data!.customerGrowth}`,
            changePercentage: data!.customerGrowthChangePercentage,
            IconComponent: data!.customerGrowthChangePercentage > 0 ? TrendingUp : TrendingDown,
          },
        ]}
      />

      <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange={dateRange}
        details={[
          {
            title: "Dues",
            amount: `${data!.totalSales - data!.totalPendingAmount}`,
            changePercentage: ((data!.totalSales / data!.salesChangePercentage) - (data!.totalPendingAmount / data!.pendingAmountChangePercentage)),
            IconComponent: ((data!.totalSales / data!.salesChangePercentage) - (data!.totalPendingAmount / data!.pendingAmountChangePercentage)) > 0 ? TrendingUp : TrendingDown,
          },
          {
            title: "Pending Orders",
            amount: `${data!.totalPendingAmount}`,
            changePercentage:data!.pendingAmountChangePercentage,
            IconComponent: data!.pendingAmountChangePercentage > 0 ? TrendingUp : TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
