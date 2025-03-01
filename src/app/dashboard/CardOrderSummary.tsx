import { useGetOrderAnalysisQuery, useGetOrderSummaryQuery } from "@/state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardOrderSummary = () => {
  const { data, isLoading } = useGetOrderAnalysisQuery();
  const { data: orderSummaryData, isLoading: isLoadingSummary } =
    useGetOrderSummaryQuery();
  const orderData = data || [];

  const transformedData = orderData.map((order) => ({
    date: new Date(order.orderCreatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    totalAmount: order.orderTotalAmount,
    discount: order.totalDiscount,
  }));

  const lastDatePoint = transformedData[transformedData.length - 1] || null;

  const customTooltipFormatter = (value: number, name: string) => {
    const customNames: Record<string, string> = {
      totalAmount: "Order Total",
      discount: "Discount Applied",
    };
    return [`${customNames[name] || name}: $${value.toLocaleString("en")}`];
  };

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Order & Discount Summary
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="mb-4 mt-7 px-7">
              <p className="text-xs text-gray-400">
                Total Order Amount / Total Discount Applied
              </p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {orderSummaryData
                    ? numeral(orderSummaryData.totalOrders).format("$0.00a")
                    : "0"}
                </p>
                <p className="px-2">/</p>

                <p className="text-[1rem] font-semibold">
                  {orderSummaryData
                    ? numeral(orderSummaryData.totalDiscount).format("$0.00a")
                    : "0"}
                </p>
              </div>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={200} className="p-2">
              <BarChart
                data={transformedData}
                margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
              >
                <XAxis dataKey="date" tick={false} axisLine={false} />
                <YAxis tick={false} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={customTooltipFormatter}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="totalAmount" stackId="a" fill="#4F46E5" />
                <Bar dataKey="discount" stackId="a" fill="#F87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default CardOrderSummary;
