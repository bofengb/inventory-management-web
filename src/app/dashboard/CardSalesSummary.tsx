import { useGetSalesAnalysisQuery } from "@/state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardSalesSummary = () => {
  const [timeframe, setTimeframe] = useState("weekly");
  const { data, isLoading, isError } = useGetSalesAnalysisQuery(timeframe);

  const salesData = data || [];

  // Calculate the total sales sum
  const totalSalesSum = salesData.reduce(
    (acc, curr) => acc + curr.totalSales,
    0
  );

  // Calculate the average percentage change
  const averageChangePercentage =
    salesData.length > 0
      ? salesData.reduce((acc, curr) => acc + curr.percentageChange, 0) /
        salesData.length
      : 0;

  // Find the data point with the highest totalSales
  const highestSalesData =
    salesData.length > 0
      ? salesData.reduce((acc, curr) =>
          acc.totalSales > curr.totalSales ? acc : curr
        )
      : null;

  // Format the highest sales date
  const highestSalesDate = highestSalesData
    ? new Date(highestSalesData.period).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return <div className="m-5">Failed to fetch data</div>;
  }

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Sales Summary
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Value</p>
                <span className="text-2xl font-extrabold">
                  $
                  {(totalSalesSum / 1000).toLocaleString("en", {
                    maximumFractionDigits: 2,
                  })}
                  k
                </span>
                <span
                  className={`${
                    averageChangePercentage > 0
                      ? "text-red-500"
                      : "text-green-500"
                  } text-green-500 text-sm ml-2`}
                >
                  {averageChangePercentage > 0 ? (
                    <TrendingUp className="inline w-4 h-4 mr-1 text-red-500" />
                  ) : (
                    <TrendingDown className="inline w-4 h-4 mr-1 text-green-500" />
                  )}
                  {/* <TrendingUp className="inline w-4 h-4 mr-1" /> */}
                  {averageChangePercentage.toFixed(2)}%
                </span>
              </div>
              <select
                className="shadow-sm border border-gray-300 bg-white p-2 rounded"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={350} className="px-7">
              <ComposedChart
                data={salesData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="period"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en")}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar
                  dataKey="totalSales"
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
                <Line type="monotone" dataKey="totalSales" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div>
            <hr />
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p>{salesData.length} sample(s)</p>
              <p className="text-sm">
                Highest Sales Date:{" "}
                <span className="font-bold">{highestSalesDate}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
