import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, user_id, subtotal, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load orders.");
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

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            ShopSphere Administration
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Manage Orders
          </h1>

          <p className="mt-3 text-gray-400">
            View and monitor customer orders.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              All Orders ({orders?.length ?? 0})
            </h2>
          </div>

          {!orders || orders.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-400">
              No orders found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/60 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Customer ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/40">
                      <td className="px-6 py-5 font-medium text-white">
                        {order.id.slice(0, 8)}...
                      </td>

                      <td className="px-6 py-5">
                        {order.user_id.slice(0, 8)}...
                      </td>

                      <td className="px-6 py-5">
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-6 py-5 font-medium text-white">
                        ₹{Number(order.subtotal).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-5">
                        <span className="capitalize text-yellow-400">
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                        >
                          View Details →
                        </Link>
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