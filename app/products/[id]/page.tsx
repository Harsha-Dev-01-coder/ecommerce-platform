import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import AddToCartButton from "./AddToCartButton";
import WishListButton from "./WishListButton";
import { getProductById } from "@/lib/services/productService";

export const instant = false;

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function ProductDetailsLoading() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-gray-600">Loading product details...</p>
    </section>
  );
}

async function ProductDetails({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Back to Products
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            unoptimized
            priority
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="mt-4 text-base leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>⭐ {product.rating} / 5</span>
            <span>
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </div>

          <AddToCartButton product={product} />

          <WishListButton product={product} />

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              Product ID: {product.id}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}