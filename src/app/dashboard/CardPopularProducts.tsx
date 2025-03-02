import { useGetTopProductQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "../(components)/Rating";
import Image from "next/image";

const CardPopularProducts = () => {
  const { data: topProduct, isLoading } = useGetTopProductQuery();

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

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
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {topProduct?.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      product && validSlugs.has(generateSlug(product.name))
                        ? `https://deploy-app-ims.s3.us-east-1.amazonaws.com/${generateSlug(
                            product.name
                          )}.png`
                        : `https://deploy-app-ims.s3.us-east-1.amazonaws.com/to-be-determined.png`
                    }
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-lg w-14 h-14"
                  />
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">
                      {" "}
                      {product.name}{" "}
                    </div>
                    <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        ${product.basePrice}
                      </span>
                      <span className="mx-2">|</span>
                      <Rating rating={product.rating || 0} />
                    </div>
                  </div>
                </div>

                <div className="text-xs flex items-center">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  {/* {Math.round(product.stockQuantity / 1000)}k Sold */}
                  {Math.round(product.stockQuantity)} Sold
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;
