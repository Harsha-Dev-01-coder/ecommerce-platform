import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  await requireAdmin();

  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, description, price, category, image, rating, stock")
    .eq("id", id)
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-950 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Product Not Found</h1>
          <p className="mt-3 text-gray-400">
            This product could not be found.
          </p>
          <Link
            href="/admin/products"
            className="mt-6 inline-block text-indigo-400 hover:text-indigo-300"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  async function updateProduct(formData: FormData) {
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

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        category,
        image,
        price,
        rating,
        stock,
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Could not update product: ${error.message}`);
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath("/admin");
    revalidatePath("/products");

    redirect("/admin/products");
  }

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
            Edit Product
          </h1>

          <p className="mt-3 text-gray-400">
            Update the details of this product.
          </p>
        </div>

        <form
          action={updateProduct}
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
              defaultValue={product.name}
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
              defaultValue={product.description}
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
                defaultValue={product.price}
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
                defaultValue={product.category}
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
              defaultValue={product.image}
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
                defaultValue={product.rating}
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
                defaultValue={product.stock}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Save Changes
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