import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

async function createProduct(formData: FormData) {
  "use server";

  await requireAdmin();

  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  const price = Number(formData.get("price"));
  const rating = Number(formData.get("rating"));
  const stock = Number(formData.get("stock"));

  if (!name || !description || !category || !image) {
    throw new Error("All product fields are required.");
  }

  if (
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    throw new Error("Please enter valid product values.");
  }

  try {
    const imageUrl = new URL(image);

    if (!["http:", "https:"].includes(imageUrl.protocol)) {
      throw new Error("Invalid image URL.");
    }
  } catch {
    throw new Error("Please enter a valid image URL.");
  }

  const { error } = await supabase.from("products").insert({
    name,
    description,
    category,
    image,
    price,
    rating,
    stock,
  });

  if (error) {
    throw new Error(`Could not create product: ${error.message}`);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");

  redirect("/admin/products");
}

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/products"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Products
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            ShopSphere Administration
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Add New Product
          </h1>

          <p className="mt-3 text-gray-400">
            Enter the details below to add a product to your store.
          </p>
        </div>

        <form
          action={createProduct}
          className="mt-10 space-y-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Product Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={150}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={4}
              maxLength={2000}
              placeholder="Describe your product"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Price (₹)
              </label>

              <input
                id="price"
                name="price"
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="1999"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                required
                maxLength={100}
                placeholder="Electronics"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Product Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              required
              placeholder="https://example.com/product.jpg"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Rating (0–5)
              </label>

              <input
                id="rating"
                name="rating"
                type="number"
                required
                min="0"
                max="5"
                step="0.1"
                defaultValue="0"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Available Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                required
                min="0"
                step="1"
                defaultValue="0"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Create Product
            </button>

            <Link
              href="/admin/products"
              className="rounded-lg border border-gray-700 px-6 py-3 text-center font-semibold text-gray-300 transition hover:bg-gray-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}