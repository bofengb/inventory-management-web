// import { useGetDashboardMetricsQuery } from "@/state/api";
// import { TrendingDown, TrendingUp } from "lucide-react";
// import numeral from "numeral";
// import React from "react";
// import {
//   Area,
//   AreaChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// const CardPurchaseSummary = () => {
//   const { data, isLoading } = useGetDashboardMetricsQuery();
//   const purchaseData = data?.purchaseSummary || [];

//   const lastDatePoint = purchaseData[purchaseData.length - 1] || null;

//   return (
//     <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
//       {isLoading ? (
//         <div className="m-5">Loading...</div>
//       ) : (
//         <>
//           {/* HEADER */}
//           <div>
//             <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
//               Purchase Summary
//             </h2>
//             <hr />
//           </div>

//           {/* BODY */}
//           <div>
//             {/* BODY HEADER */}
//             <div className="mb-4 mt-7 px-7">
//               <p className="text-xs text-gray-400">Purchased</p>
//               <div className="flex items-center">
//                 <p className="text-2xl font-bold">
//                   {lastDatePoint
//                     ? numeral(lastDatePoint.totalPurchased).format("$0.00a")
//                     : "0"}
//                 </p>
//                 {lastDatePoint && (
//                   <p
//                     className={`text-sm ${
//                       lastDatePoint.changePercentage! >= 0
//                         ? "text-green-500"
//                         : "text-red-500"
//                     } flex ml-3`}
//                   >
//                     {lastDatePoint.changePercentage! >= 0 ? (
//                       <TrendingUp className="w-5 h-5 mr-1" />
//                     ) : (
//                       <TrendingDown className="w-5 h-5 mr-1" />
//                     )}
//                     {Math.abs(lastDatePoint.changePercentage!)}%
//                   </p>
//                 )}
//               </div>
//             </div>
//             {/* CHART */}
//             <ResponsiveContainer width="100%" height={200} className="p-2">
//               <AreaChart
//                 data={purchaseData}
//                 margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
//               >
//                 <XAxis dataKey="date" tick={false} axisLine={false} />
//                 <YAxis tick={false} tickLine={false} axisLine={false} />
//                 <Tooltip
//                   formatter={(value: number) => [
//                     `$${value.toLocaleString("en")}`,
//                   ]}
//                   labelFormatter={(label) => {
//                     const date = new Date(label);
//                     return date.toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     });
//                   }}
//                 />
//                 <Area
//                   type="linear"
//                   dataKey="totalPurchased"
//                   stroke="#8884d8"
//                   fill="#8884d8"
//                   dot={true}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CardPurchaseSummary;


import { useGetDashboardMetricsQuery, useGetPurchaseAnalysisQuery } from "@/state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardPurchaseSummary = () => {
  const { data, isLoading } = useGetPurchaseAnalysisQuery();
  const purchaseData = data || [];

  const lastDatePoint = purchaseData[purchaseData.length - 1] || null;
  let changePercentage = 0;
  if (purchaseData.length > 1) {
    const secondLast = purchaseData[purchaseData.length - 2];
    changePercentage =
      ((lastDatePoint.totalPurchaseCost - secondLast.totalPurchaseCost) /
        secondLast.totalPurchaseCost) *
      100;
  }

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Purchase Summary
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="mb-4 mt-7 px-7">
              <p className="text-xs text-gray-400">Purchased</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {lastDatePoint
                    ? numeral(lastDatePoint.totalPurchaseCost).format("$0.00a")
                    : "0"}
                </p>
                {lastDatePoint && purchaseData.length > 1 && (
                  <p
                    className={`text-sm ${
                      changePercentage >= 0
                        ? "text-red-500"
                        : "text-green-500"
                    } flex ml-3`}
                  >
                    {changePercentage >= 0 ? (
                      <TrendingUp className="w-5 h-5 mr-1" />
                    ) : (
                      <TrendingDown className="w-5 h-5 mr-1" />
                    )}
                    {/* {Math.abs(changePercentage.toFixed(2))}% */}
                    {changePercentage.toFixed(2)}%
                  </p>
                )}
              </div>
            </div>
            {/* CHART */}
            <ResponsiveContainer width="100%" height={200} className="p-2">
              <AreaChart
                data={purchaseData}
                margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
              >
                <XAxis dataKey="date" tick={false} axisLine={false} />
                <YAxis tick={false} tickLine={false} axisLine={false} />
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
                <Area
                  type="linear"
                  dataKey="totalPurchaseCost"
                  stroke="#8884d8"
                  fill="#8884d8"
                  dot={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPurchaseSummary;
