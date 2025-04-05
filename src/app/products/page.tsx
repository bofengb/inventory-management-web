"use client";

import {
  useGetProductDetailInfoQuery,
  // useCreateProductMutation,
  useGetProductsQuery,
  useGetProductsSearchQuery,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, X } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "../(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import { Toaster, toast } from "sonner";
import Image from "next/image";

type ProductFormData = {
  name: string;
  basePrice: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // When there's no search term, fetch all products.
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useGetProductsQuery(undefined, {
    skip: !!searchTerm, // Skip if searchTerm is not empty.
  });

  // When there's a search term, fetch search results.
  const {
    data: productSearch,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useGetProductsSearchQuery(searchTerm, {
    skip: !searchTerm, // Skip if searchTerm is empty.
  });

  // Determine which data to display.
  const displayedProducts = searchTerm ? productSearch : products;
  const isLoading = searchTerm ? isLoadingSearch : isLoadingProducts;
  const isError = searchTerm ? isErrorSearch : isErrorProducts;

  // Get product details
  const { data: detailData } = useGetProductDetailInfoQuery(
    selectedProductId!,
    {
      skip: selectedProductId === null,
    }
  );

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProductId(null);
  };

  // const [createProduct] = useCreateProductMutation();
  // const handleCreateProduct = async (productData: ProductFormData) => {
  //   await createProduct(productData);

  //   toast.success(
  //     `Product created successfully for product ${productData.name}`
  //   );
  // };

  // Search bar defocusing issue
  // if (isLoading) {
  //   return <div className="py-4">Loading...</div>;
  // }

  // if (isError || !displayedProducts) {
  //   return (
  //     <div className="text-center text-red-500 py-4">
  //       Failed to fetch products
  //     </div>
  //   );
  // }

  // Utility function to generate a slug from a product name
  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  // Define the valid product slugs
  const validSlugs = new Set([
    "football",
    "basketball",
    "tennis-racket",
    "soccer-jersey",
    "running-shoes",
    "baseball-glove",
    "golf-clubs",
    "yoga-mat",
    "cycling-helmet",
    "skateboard",
    "cricket-bat",
    "swimming-goggles",
    "boxing-gloves",
    "hockey-stick",
    "ski-boots",
    "snowboard",
    "martial-arts-uniform",
    "badminton-racket",
    "volleyball",
    "rowing-oar",
  ]);

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Render the Toaster component for Sonner toast notifications */}
      <Toaster richColors closeButton position="bottom-center" />
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        {/* <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button> */}
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <div className="py-4">Loading...</div>
        ) : isError || !displayedProducts ? (
          <div className="text-center text-red-500 py-4">
            Failed to fetch products
          </div>
        ) : (
          displayedProducts?.map((product, index) => (
            <div
              key={index}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto bg-white cursor-pointer active:shadow-2xl"
              onClick={() => handleProductClick(index + 1)}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={
                    product && validSlugs.has(generateSlug(product.name))
                      ? `https://deploy-app-ims.s3.us-east-1.amazonaws.com/${generateSlug(
                          product.name
                        )}.png`
                      : `https://deploy-app-ims.s3.us-east-1.amazonaws.com/to-be-determined.png`
                  }
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36"
                />
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">${product.basePrice.toFixed(2)}</p>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {/* <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      /> */}

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <span>Product Details</span>
            <IconButton onClick={handleCloseDialog}>
              <X />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {detailData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image and Basic Info */}
              <div className="flex flex-col items-center">
                <Image
                  src={
                    validSlugs.has(generateSlug(detailData.productName))
                      ? `https://deploy-app-ims.s3.us-east-1.amazonaws.com/${generateSlug(
                          detailData.productName
                        )}.png`
                      : `https://deploy-app-ims.s3.us-east-1.amazonaws.com/to-be-determined.png`
                  }
                  alt={detailData.productName}
                  width={200}
                  height={200}
                  className="rounded-2xl mb-4 w-48 h-48"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {detailData.productName}
                </h2>
                <p className="text-gray-600 text-lg mb-1">
                  Base Price: ${detailData.basePrice.toFixed(2)}
                </p>
                {/* {detailData.rating !== undefined && (
            <Rating rating={detailData.rating} />
          )} */}
                {detailData.rating !== undefined && (
                  <div className="flex flex-row items-center mt-1">
                    <Rating rating={detailData.rating} />
                  </div>
                )}
              </div>

              {/* Detailed Stats */}
              <div className="space-y-3 text-gray-800">
                <p>
                  <strong>Units Sold:</strong> {detailData.totalUnitsSold}
                </p>
                <p>
                  <strong>Total Revenue:</strong> $
                  {(detailData.totalUnitsSold * detailData.basePrice).toFixed(
                    2
                  )}
                </p>
                <p>
                  <strong>Total Customers:</strong> {detailData.totalCustomers}
                </p>
                {/* <p><strong>Estimated Profit:</strong> ${detailData.estimatedProfit.toFixed(2)}</p> */}
                <p>
                  <strong>Inventory Movement Rate:</strong>{" "}
                  {detailData.inventoryMovementRate.toFixed(2)}%
                </p>

                {/* Inventory Level Indicator */}
                <div className="space-y-2">
                  <p>
                    <strong>Inventory Status:</strong>
                  </p>

                  {(() => {
                    const maxInventory = 150;
                    const percentage = Math.min(
                      (-detailData.inventoryLeft / maxInventory) * 100,
                      100
                    );

                    const colorClass =
                      -detailData.inventoryLeft <= 40
                        ? "bg-red-500 text-white"
                        : -detailData.inventoryLeft <= 80
                        ? "bg-yellow-400 text-gray-800"
                        : "bg-green-500 text-white";

                    return (
                      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full flex items-center justify-center text-xs font-semibold transition-all duration-700 ease-out ${colorClass}`}
                          style={{ width: `${percentage}%` }}
                        >
                          {-detailData.inventoryLeft} units
                        </div>
                      </div>
                    );
                  })()}

                  {/* Low Stock Alert */}
                  {-detailData.inventoryLeft <= 40 && (
                    <div className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      ⚠ Low Stock
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-10">
              <CircularProgress />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
