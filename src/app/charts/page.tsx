"use client";

import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  useGetOrderByStatusQuery,
  useGetPaymentByMethodQuery,
  useGetTransactionByTypeQuery,
} from "@/state/api";

export interface OrderByStatus {
  orderId: number;
  status: string;
  createdAt: string;
}

export interface PaymentByMethod {
  paymentId: number;
  method: string;
  timestamp: string;
}

export interface TransactionByType {
  transactionId: number;
  type: string;
  timestamp: string;
}

// Utility function to parse dates to YYYY-MM-DD format.
const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const Page = () => {
  /*** Orders Section ***/
  const [orderActiveIndex, setOrderActiveIndex] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [orderStartDate, setOrderStartDate] = useState("");
  const [orderEndDate, setOrderEndDate] = useState("");

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetOrderByStatusQuery();
  const orders = useMemo(() => ordersData ?? [], [ordersData]);

  const aggregatedOrders = useMemo(() => {
    const filtered = orders
      .filter((order: OrderByStatus) => {
        const matchesStatus =
          selectedStatus === "All" || order.status === selectedStatus;
        const orderDate = parseDate(order.createdAt);
        const matchesDate =
          !orderStartDate ||
          !orderEndDate ||
          (orderDate >= orderStartDate && orderDate <= orderEndDate);
        return matchesStatus && matchesDate;
      })
      .reduce(
        (
          acc: Record<string, { name: string; amount: number; color: string }>,
          order: OrderByStatus
        ) => {
          if (!acc[order.status]) {
            acc[order.status] = {
              // name: order.status,
              name: order.status.replace(/_/g, " "),
              amount: 0,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          }
          acc[order.status].amount += 1;
          return acc;
        },
        {}
      );
    return Object.values(filtered);
  }, [orders, selectedStatus, orderStartDate, orderEndDate]);

  /*** Payments Section ***/
  const [paymentActiveIndex, setPaymentActiveIndex] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All");
  const [paymentStartDate, setPaymentStartDate] = useState("");
  const [paymentEndDate, setPaymentEndDate] = useState("");

  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetPaymentByMethodQuery();
  const payments = useMemo(() => paymentsData ?? [], [paymentsData]);

  const aggregatedPayments = useMemo(() => {
    const filtered = payments
      .filter((payment: PaymentByMethod) => {
        const matchesMethod =
          selectedPaymentMethod === "All" ||
          payment.method === selectedPaymentMethod;
        const paymentDate = parseDate(payment.timestamp);
        const matchesDate =
          !paymentStartDate ||
          !paymentEndDate ||
          (paymentDate >= paymentStartDate && paymentDate <= paymentEndDate);
        return matchesMethod && matchesDate;
      })
      .reduce(
        (
          acc: Record<string, { name: string; amount: number; color: string }>,
          payment: PaymentByMethod
        ) => {
          if (!acc[payment.method]) {
            acc[payment.method] = {
              // name: payment.method,
              name: payment.method.replace(/_/g, " "),
              amount: 0,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          }
          acc[payment.method].amount += 1;
          return acc;
        },
        {}
      );
    return Object.values(filtered);
  }, [payments, selectedPaymentMethod, paymentStartDate, paymentEndDate]);

  /*** Transactions Section ***/
  const [transactionActiveIndex, setTransactionActiveIndex] = useState(0);
  const [selectedTransactionType, setSelectedTransactionType] = useState("All");
  const [transactionStartDate, setTransactionStartDate] = useState("");
  const [transactionEndDate, setTransactionEndDate] = useState("");

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useGetTransactionByTypeQuery();
  const transactions = useMemo(
    () => transactionsData ?? [],
    [transactionsData]
  );

  const aggregatedTransactions = useMemo(() => {
    const filtered = transactions
      .filter((transaction: TransactionByType) => {
        const matchesType =
          selectedTransactionType === "All" ||
          transaction.type === selectedTransactionType;
        const transactionDate = parseDate(transaction.timestamp);
        const matchesDate =
          !transactionStartDate ||
          !transactionEndDate ||
          (transactionDate >= transactionStartDate &&
            transactionDate <= transactionEndDate);
        return matchesType && matchesDate;
      })
      .reduce(
        (
          acc: Record<string, { name: string; amount: number; color: string }>,
          transaction: TransactionByType
        ) => {
          if (!acc[transaction.type]) {
            acc[transaction.type] = {
              // name: transaction.type,
              name: transaction.type.replace(/_/g, " "),
              amount: 0,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          }
          acc[transaction.type].amount += 1;
          return acc;
        },
        {}
      );
    return Object.values(filtered);
  }, [
    transactions,
    selectedTransactionType,
    transactionStartDate,
    transactionEndDate,
  ]);

  const classNames = {
    label: "block text-sm font-medium text-foreground",
    selectInput:
      "mt-1 block w-full pl-3 pr-10 py-2 text-base bg-background text-foreground border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
  };

  return (
    <div>
      {/* Orders Section */}
      <div className="mb-10">
        <Header name="Orders" />
        <p className="text-sm text-gray-500">
          A visual representation of orders over time.
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
          {/* Control Panel */}
          <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Filter by Status and Date
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className={classNames.label}>
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className={classNames.selectInput}
                  defaultValue="All"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {/* <option>All</option>
                  <option>COMPLETED</option>
                  <option>PENDING</option>
                  <option>CANCELED</option> */}
                  <option value="All">All</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELED">Canceled</option>
                </select>
              </div>
              <div>
                <label htmlFor="order-start-date" className={classNames.label}>
                  Start Date
                </label>
                <input
                  type="date"
                  id="order-start-date"
                  name="order-start-date"
                  className={classNames.selectInput}
                  onChange={(e) => setOrderStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="order-end-date" className={classNames.label}>
                  End Date
                </label>
                <input
                  type="date"
                  id="order-end-date"
                  name="order-end-date"
                  className={classNames.selectInput}
                  onChange={(e) => setOrderEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Pie Chart */}
          <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
            {isOrdersLoading ? (
              <div className="py-4">Loading...</div>
            ) : isOrdersError || !ordersData ? (
              <div className="text-center text-red-500 py-4">
                Failed to fetch orders
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={aggregatedOrders}
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="amount"
                    onMouseEnter={(_, index) => setOrderActiveIndex(index)}
                  >
                    {aggregatedOrders.map((entry, index) => (
                      <Cell
                        key={`order-cell-${index}`}
                        fill={
                          index === orderActiveIndex
                            ? "rgb(29, 78, 216)"
                            : entry.color
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Payments Section */}
      <div className="mb-10">
        <Header name="Payments" />
        <p className="text-sm text-gray-500">
          A visual representation of payments over time.
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
          {/* Control Panel */}
          <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Filter by Payment Method and Date
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="payment-method" className={classNames.label}>
                  Payment Method
                </label>
                <select
                  id="payment-method"
                  name="payment-method"
                  className={classNames.selectInput}
                  defaultValue="All"
                  // onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  onChange={(e) => {
                    const formattedValue = e.target.value.replace(/\s/g, "_");
                    setSelectedPaymentMethod(formattedValue);
                  }}
                >
                  {/* <option>All</option>
                  <option>CASH</option>
                  <option>CREDIT_CARDS</option>
                  <option>DEBIT_CARDS</option>
                  <option>CHECKS</option>
                  <option>BANK_TRANSFERS</option>
                  <option>APPLE_PAY</option>
                  <option>PAYPAL</option>
                  <option>MASTER_CARD</option> */}
                  <option value="All">All</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARDS">Credit Cards</option>
                  <option value="DEBIT_CARDS">Debit Cards</option>
                  <option value="CHECKS">Checks</option>
                  <option value="BANK_TRANSFERS">Bank Transfers</option>
                  <option value="APPLE_PAY">Apple Pay</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="MASTER_CARD">Master Card</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="payment-start-date"
                  className={classNames.label}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="payment-start-date"
                  name="payment-start-date"
                  className={classNames.selectInput}
                  onChange={(e) => setPaymentStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="payment-end-date" className={classNames.label}>
                  End Date
                </label>
                <input
                  type="date"
                  id="payment-end-date"
                  name="payment-end-date"
                  className={classNames.selectInput}
                  onChange={(e) => setPaymentEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Pie Chart */}
          <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
            {isPaymentsLoading ? (
              <div className="py-4">Loading...</div>
            ) : isPaymentsError || !paymentsData ? (
              <div className="text-center text-red-500 py-4">
                Failed to fetch payments
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={aggregatedPayments}
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={150}
                    fill="#82ca9d"
                    dataKey="amount"
                    onMouseEnter={(_, index) => setPaymentActiveIndex(index)}
                  >
                    {aggregatedPayments.map((entry, index) => (
                      <Cell
                        key={`payment-cell-${index}`}
                        fill={
                          index === paymentActiveIndex
                            ? "rgb(29, 78, 216)"
                            : entry.color
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div>
        <Header name="Transactions" />
        <p className="text-sm text-gray-500">
          A visual representation of transactions over time.
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
          {/* Control Panel */}
          <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Filter by Transaction Type and Date
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="transaction-type" className={classNames.label}>
                  Transaction Type
                </label>
                <select
                  id="transaction-type"
                  name="transaction-type"
                  className={classNames.selectInput}
                  defaultValue="All"
                  onChange={(e) => setSelectedTransactionType(e.target.value)}
                >
                  {/* <option>All</option>
                  <option>PURCHASE</option>
                  <option>SALE</option> */}
                  <option value="All">All</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="SALE">Sale</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="transaction-start-date"
                  className={classNames.label}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="transaction-start-date"
                  name="transaction-start-date"
                  className={classNames.selectInput}
                  onChange={(e) => setTransactionStartDate(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="transaction-end-date"
                  className={classNames.label}
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="transaction-end-date"
                  name="transaction-end-date"
                  className={classNames.selectInput}
                  onChange={(e) => setTransactionEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Pie Chart */}
          <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
            {isTransactionsLoading ? (
              <div className="py-4">Loading...</div>
            ) : isTransactionsError || !transactionsData ? (
              <div className="text-center text-red-500 py-4">
                Failed to fetch transactions
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={aggregatedTransactions}
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={150}
                    fill="#ffc658"
                    dataKey="amount"
                    onMouseEnter={(_, index) =>
                      setTransactionActiveIndex(index)
                    }
                  >
                    {aggregatedTransactions.map((entry, index) => (
                      <Cell
                        key={`transaction-cell-${index}`}
                        fill={
                          index === transactionActiveIndex
                            ? "rgb(29, 78, 216)"
                            : entry.color
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
