import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`/login?next=/account/orders/${id}`);
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, subtotal, status, shipping_address, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) {
    throw new Error("Could not load this order.");
  }

  if (!order) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_name, quantity, unit_price")
    .eq("order_id", order.id);

  if (itemsError) {
    throw new Error("Could not load order items.");
  }

  const address = order.shipping_address as {
    full_name?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string | null;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account/orders"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Back to My Orders
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            ShopSphere
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            Order Details
          </h1>
          <p className="mt-3 break-all text-sm text-gray-400">
            Order ID: {order.id}
          </p>
        </div>

        <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">Order Date</p>
              <p className="mt-1 font-medium text-white">
                {new Date(order.created_at).toLocaleString("en-IN")}
              </p>
            </div>

            <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold capitalize text-yellow-400">
              {order.status}
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Shipping Address
          </h2>

          <div className="mt-5 space-y-2 text-sm text-gray-300">
            <p className="font-semibold text-white">{address.full_name}</p>
            <p>{address.phone}</p>
            <p>{address.address_line1}</p>
            {address.address_line2 && <p>{address.address_line2}</p>}
            <p>
              {address.city}, {address.state} - {address.postal_code}
            </p>
            <p>{address.country}</p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Ordered Products
          </h2>

          <div className="mt-5 divide-y divide-gray-800">
            {items?.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 py-5"
              >
                <div>
                  <p className="font-medium text-white">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-white">
                  {formatPrice(Number(item.unit_price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between border-t border-gray-700 pt-5">
            <span className="text-lg font-semibold text-white">
              Order Total
            </span>
            <span className="text-xl font-bold text-indigo-400">
              {formatPrice(Number(order.subtotal))}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}