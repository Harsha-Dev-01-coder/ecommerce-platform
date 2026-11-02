import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";
import DeleteProductButton from "./DeleteProductButton";

async function deleteProduct(formData: FormData) {
  "use server";

  await requireAdmin();

  const productId = String(formData.get("productId") ?? "");

  if (!productId) {
    throw new Error("Invalid product.");
  }

  const supabase = await createClient();

  const { count, error: referenceError } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (referenceError) {
    throw new Error("Could not verify product order history.");
  }

  if (count && count > 0) {
    redirect(
      `/admin/products?error=${encodeURIComponent(
        "This product belongs to an existing order and cannot be deleted."
      )}`
    );
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(`Could not delete product: ${error.message}`);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");

  redirect("/admin/products?success=deleted");
}

type AdminProductsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, category, stock")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Could not load products.");
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              ShopSphere Administration
            </p>

            <h1 className="mt-3 text-4xl font-bold text-white">
              Manage Products
            </h1>

            <p className="mt-3 text-gray-400">
              View and manage your store inventory.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            + Add Product
          </Link>
        </div>

        {params.error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {params.error}
          </div>
        )}

        {params.success === "deleted" && (
          <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
            Product deleted successfully.
          </div>
        )}

        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              All Products ({products?.length ?? 0})
            </h2>
          </div>

          {!products || products.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-400">
              No products found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/60 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-800/40">
                      <td className="px-6 py-5 font-medium text-white">
                        {product.name}
                      </td>

                      <td className="px-6 py-5">{product.category}</td>

                      <td className="px-6 py-5">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={
                            product.stock > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                          >
                            Edit →
                          </Link>

                          <DeleteProductButton
                            productId={product.id}
                            productName={product.name}
                            action={deleteProduct}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}