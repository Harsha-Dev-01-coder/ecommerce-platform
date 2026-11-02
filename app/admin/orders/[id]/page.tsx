import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

type ShippingAddress = {
  full_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string | null;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

export default async function AdminOrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  await requireAdmin();

  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, shipping_address, subtotal, status, created_at")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_id, product_name, quantity, unit_price")
    .eq("order_id", id);

  if (itemsError) {
    throw new Error("Could not load order items.");
  }

  async function updateOrderStatus(formData: FormData) {
    "use server";

    await requireAdmin();

    const status = String(formData.get("status") ?? "");

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid order status.");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      throw new Error(`Could not update order status: ${error.message}`);
    }

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  }

  const address = order.shipping_address as ShippingAddress;

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Orders
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            ShopSphere Administration
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Order Details
          </h1>

          <p className="mt-3 break-all text-sm text-gray-400">
            Order ID: {order.id}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white">
              Order Information
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Customer ID</p>
                <p className="mt-1 break-all text-white">
                  {order.user_id}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Order Date</p>
                <p className="mt-1 text-white">
                  {new Date(order.created_at).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Current Status</p>
                <p className="mt-1 capitalize text-yellow-400">
                  {order.status}
                </p>
              </div>

              <form action={updateOrderStatus} className="pt-2">
                <label
                  htmlFor="status"
                  className="block text-sm text-gray-400"
                >
                  Update Order Status
                </label>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <select
                    key={order.status}
                    id="status"
                    name="status"
                    defaultValue={order.status}
                    className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>

                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Update Status
                  </button>
                </div>
              </form>

              <div className="border-t border-gray-800 pt-4">
                <p className="text-gray-400">Order Total</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  ₹{Number(order.subtotal).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white">
              Shipping Address
            </h2>

            <div className="mt-5 space-y-2 text-sm text-gray-300">
              <p className="font-semibold text-white">
                {address.full_name ?? "N/A"}
              </p>

              <p>{address.phone ?? "N/A"}</p>
              <p>{address.address_line1 ?? "N/A"}</p>

              {address.address_line2 && (
                <p>{address.address_line2}</p>
              )}

              <p>
                {[address.city, address.state, address.postal_code]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <p>{address.country ?? "N/A"}</p>
            </div>
          </section>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              Ordered Products ({items?.length ?? 0})
            </h2>
          </div>

          {!items || items.length === 0 ? (
            <p className="px-6 py-10 text-center text-gray-400">
              No products found for this order.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/60 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Quantity</th>
                    <th className="px-6 py-4 font-medium">Unit Price</th>
                    <th className="px-6 py-4 font-medium">Subtotal</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-5 font-medium text-white">
                        {item.product_name}
                      </td>

                      <td className="px-6 py-5">
                        {item.quantity}
                      </td>

                      <td className="px-6 py-5">
                        ₹{Number(item.unit_price).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-5 font-semibold text-white">
                        ₹
                        {(
                          Number(item.unit_price) * item.quantity
                        ).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}