import { Suspense } from "react";
import { getProducts } from "@/lib/services/productService";
import ProductSearch from "./ProductSearch";

function ProductsLoading() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-gray-300">Loading products...</p>
    </section>
  );
}

async function ProductsContent() {
  const products = await getProducts();

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
          Our Collection
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Explore Products
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-300">
          Discover products for your everyday needs. Find your next favorite
          with ShopSphere.
        </p>
      </div>

      <div className="mt-10">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-600 bg-gray-900 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">
              No products found
            </h2>

            <p className="mt-3 text-sm text-gray-300">
              Our collection is being updated. Please check back soon.
            </p>
          </div>
        ) : (
          <ProductSearch products={products} />
        )}
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}