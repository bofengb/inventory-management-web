// Import createApi and fetchBaseQuery from Redux Toolkit's RTK Query module.
// - createApi: A function to define an "API slice" that manages data fetching and caching.
// - fetchBaseQuery: A lightweight function that acts as a base query for HTTP requests.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TopProduct {
  productId: number;
  name: string;
  basePrice: number;
  rating?: number;
  stockQuantity: number;
}

export interface SalesAnalysis {
  period: string;
  totalSales: number;
  percentageChange: number;
}

export interface PurchaseAnalysis {
  date: string;
  totalPurchaseCost: number;
}

export interface OrderAnalysis {
  orderId: number;
  orderCreatedAt: string;
  orderTotalAmount: number;
  totalDiscount: number;
}

export interface OrderSummary {
  totalOrders: number;
  totalDiscount: number;
  averageDiscount: number;
}

export interface ExpenseAnalysis {
  category: string;
  total: number;
}

export interface StatisticAnalysis {
  totalSales: number;
  salesChangePercentage: number;
  totalPurchases: number;
  purchasesChangePercentage: number;
  totalExpenses: number;
  expensesChangePercentage: number;
  customerGrowth: number;
  customerGrowthChangePercentage: number;
  totalPendingAmount: number;
  pendingAmountChangePercentage: number;
}

export interface OrderDetails {
  orderId: number;
  totalAmount: number;
  status: string;
  productName: string;
  customerName: string;
  paymentMethod: string;
  createdAt: string;
}

// export interface Product {
//   productId: string;
//   name: string;
//   price: number;
//   rating?: number;
//   stockQuantity: number;
// }

export interface Product {
  productId: string;
  name: string;
  basePrice: number;
  rating?: number;
}

export interface ProductCreate {
  name: string;
  basePrice: number;
  rating?: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

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

export interface Notification {
  id: number;
  message: string;
  productId: number;
  createdAt: string;
  read: boolean;
}

// #################################

export interface SalesSummary {
  salesSumamryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummaryId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

// Create an API slice using RTK Query. This centralizes how your app communicates with external APIs.
export const api = createApi({
  // baseQuery is the default function used to fetch data.
  // It is configured with a base URL taken from an environment variable.
  // This base URL is prepended to all relative URL endpoints defined in your API endpoints.
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),

  // reducerPath is the key under which the generated reducer will be stored in the Redux store.
  // Here, it's set to "api" so the API slice state will be available at state.api.
  reducerPath: "api",

  // tagTypes can be used to define tags for managing cache invalidation.
  // Although empty here, you can add tag names that represent types of data your API fetches.
  tagTypes: [
    "DashboardMetrics",
    "TopProducts",
    "SalesAnalysis",
    "PurchaseAnalysis",
    "OrderAnalysis",
    "OrderSummary",
    "ExpenseAnalysis",
    "StatisticAnalysis",
    "Products",
    "ProductsSearch",
    "OrderDetails",
    "Customers",
    "OrderByStatus",
    "PaymentByMethod",
    "TransactionByType",
    "Notification",
  ],

  // endpoints is a function where you define different endpoints for your API.
  // Each endpoint can be a query (for fetching data) or a mutation (for modifying data).
  // In this example, no endpoints are defined yet, so it returns an empty object.
  endpoints: (build) => ({
    getTopProduct: build.query<TopProduct[], void>({
      query: () => "/rest/products/top",
      providesTags: ["TopProducts"],
    }),
    getSalesAnalysis: build.query<SalesAnalysis[], string>({
      query: (groupBy) => `/rest/sales/analysis?groupBy=${groupBy}`,
      providesTags: ["SalesAnalysis"],
    }),
    getPurchaseAnalysis: build.query<PurchaseAnalysis[], void>({
      query: () => "/rest/purchase/analysis",
      providesTags: ["PurchaseAnalysis"],
    }),
    getOrderAnalysis: build.query<OrderAnalysis[], void>({
      query: () => "/rest/order/order-discount-trends",
      providesTags: ["OrderAnalysis"],
    }),
    getOrderSummary: build.query<OrderSummary, void>({
      query: () => "/rest/order/order-discount-summary",
      providesTags: ["OrderSummary"],
    }),
    getExpenseAnalysis: build.query<ExpenseAnalysis[], void>({
      query: () => "/rest/expense/breakdown",
      providesTags: ["ExpenseAnalysis"],
    }),
    getStatisticAnalysis: build.query<StatisticAnalysis, void>({
      query: () => "/rest/statistic",
      providesTags: ["StatisticAnalysis"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: () => "/rest/products",
      providesTags: ["Products"],
    }),
    getProductsSearch: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/rest/products/search",
        params: { name: search },
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, ProductCreate>({
      query: (newProduct) => ({
        url: "/rest/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products", "Notification"],
    }),
    getOrderDetails: build.query<OrderDetails[], void>({
      query: () => "/rest/order/details",
      providesTags: ["OrderDetails"],
    }),
    getCustomers: build.query<Customer[], void>({
      query: () => "/rest/customers",
      providesTags: ["Customers"],
    }),
    getOrderByStatus: build.query<OrderByStatus[], void>({
      query: () => "/rest/charts/orders",
      providesTags: ["OrderByStatus"],
    }),
    getPaymentByMethod: build.query<PaymentByMethod[], void>({
      query: () => "/rest/charts/payments",
      providesTags: ["PaymentByMethod"],
    }),
    getTransactionByType: build.query<TransactionByType[], void>({
      query: () => "/rest/charts/transactions",
      providesTags: ["TransactionByType"],
    }),
    getNotification: build.query<Notification[], void>({
      query: () => "/rest/notification",
      providesTags: ["Notification"],
    }),
    toggleNotification: build.mutation<Notification, number>({
      query: (id) => ({
        url: `/rest/notification/${id}/read`,
        method: "PUT", // Adjust to POST or PATCH if needed by your backend
      }),
      // Invalidate notifications so the list and unread count are refreshed
      invalidatesTags: ["Notification"],
    }),
  }),
});

// This line is exporting nothing additional from the api object,
// but typically you might export auto-generated hooks for each endpoint defined in the endpoints function.
// For example, if you had an endpoint "getUser", you might export { useGetUserQuery } = api.
export const {
  useGetTopProductQuery,
  useGetSalesAnalysisQuery,
  useGetPurchaseAnalysisQuery,
  useGetOrderAnalysisQuery,
  useGetOrderSummaryQuery,
  useGetExpenseAnalysisQuery,
  useGetStatisticAnalysisQuery,
  useGetProductsQuery,
  useGetProductsSearchQuery,
  useCreateProductMutation,
  useGetOrderDetailsQuery,
  useGetCustomersQuery,
  useGetOrderByStatusQuery,
  useGetPaymentByMethodQuery,
  useGetTransactionByTypeQuery,
  useGetNotificationQuery,
  useToggleNotificationMutation,
} = api;
