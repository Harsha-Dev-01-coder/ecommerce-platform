import { Suspense } from "react";

type ProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function ProductDetails({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
        Product Details
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
        Product ID: {id}
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
        This page will display the product image, description, price, stock
        availability, and add-to-cart functionality.
      </p>
    </section>
  );
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 text-white">
          Loading product details...
        </div>
      }
    >
      <ProductDetails params={params} />
    </Suspense>
  );
}