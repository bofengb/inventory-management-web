import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useGetExpenseAnalysisQuery } from "@/state/api";
import { TrendingUp } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }:{
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CardExpenseSummary = () => {
  const { data: dashboardMetrics, isLoading } = useGetExpenseAnalysisQuery();

  const expenseSummary = dashboardMetrics;
  const expenseByCategorySummary = dashboardMetrics || [];

  const expenseCategories = expenseByCategorySummary.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  const totalExpenses = expenseCategories.reduce((acc, category) => acc + category.value, 0);
  const formattedTotalExpenses = totalExpenses.toFixed(2);

  return (
    <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">Expense Summary</h2>
            <hr />
          </div>
          <div className="xl:flex justify-between pr-7">
            <div className="relative basis-3/5">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                <span className="font-bold text-xl">${formattedTotalExpenses}</span>
              </div> */}
            </div>
            <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
              {expenseCategories.map((entry, index) => (
                <li key={`legend-${index}`} className="flex items-center text-xs">
                  <span className="mr-2 w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <hr />
            {expenseSummary && (
              <div className="mt-3 flex justify-between items-center px-7 mb-4">
                <div className="pt-2">
                  <p className="text-sm">
                    Total Expenses: <span className="font-semibold">
                      {/* ${expenseSummary.totalExpenses.toFixed(2)} */}
                      ${formattedTotalExpenses}
                      </span>
                  </p>
                </div>
                {/* <span className="flex items-center mt-2">
                  <TrendingUp className="mr-2 text-green-500" />
                  30%
                </span> */}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardExpenseSummary;
