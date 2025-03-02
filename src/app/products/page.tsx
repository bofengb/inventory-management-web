"use client";

import {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductsSearchQuery,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const [createProduct] = useCreateProductMutation();
  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);

    toast.success(
      `Product created successfully for product ${productData.name}`
    );
  };

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
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
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
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
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
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
