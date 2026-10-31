import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=/account/orders");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, subtotal, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load your orders.");
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Account
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            ShopSphere
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            My Orders
          </h1>
          <p className="mt-3 text-gray-400">
            View your order history and track your purchases.
          </p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center">
            <h2 className="text-xl font-semibold text-white">
              No orders yet
            </h2>
            <p className="mt-3 text-gray-400">
              Your completed purchases will appear here.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-5 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="mt-1 break-all font-medium text-white">
                    {order.id}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(Number(order.subtotal))}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium capitalize text-yellow-400">
                    {order.status}
                  </span>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}