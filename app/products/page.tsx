import Image from "next/image";
import { Suspense } from "react";
import { getProducts } from "@/lib/services/productService";

function ProductsLoading() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-gray-600">Loading products...</p>
    </section>
  );
}

async function ProductsContent() {
  const products = await getProducts();

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Our Collection
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Explore Products
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          Discover products for your everyday needs. Find your next favorite
          with ShopSphere.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No products found
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Our collection is being updated. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                unoptimized
                loading={index === 0 ? "eager" : "lazy"}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                  {product.category}
                </p>

                <h2 className="mt-2 text-lg font-semibold text-gray-900">
                  {product.name}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  <span className="text-sm text-gray-600">
                    ⭐ {product.rating}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
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