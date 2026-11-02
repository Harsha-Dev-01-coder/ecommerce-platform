import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  await requireAdmin();

  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, subtotal, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          ShopSphere Administration
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-gray-400">
          Manage your store, products, customers and orders.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Total Products", value: productCount },
            { label: "Total Orders", value: orderCount },
            { label: "Total Customers", value: customerCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
            >
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {stat.value ?? 0}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Recent Orders
          </h2>

          {!recentOrders || recentOrders.length === 0 ? (
            <p className="mt-6 text-gray-400">No orders found.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4"
                >
                  <div>
                    <p className="break-all font-medium text-white">
                      {order.id}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-white">
                      ₹{Number(order.subtotal).toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-sm capitalize text-yellow-400">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}