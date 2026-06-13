import Link from "next/link";
import ClearCartOnSuccess from "@/components/ClearCartOnSuccess";

type SessionData = {
  status?: string;
  paymentStatus?: string;
  amountTotal?: number;
  currency?: string;
  customerEmail?: string;
  lineItems?: { description?: string | null; quantity?: number | null; amountTotal?: number | null }[];
  error?: string;
};

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return <div>No session id found!</div>;
  }

  let data: SessionData = {};
  try {
    const res = await fetch(
      `${process.env.PAYMENT_SERVICE_INTERNAL_URL || "http://localhost:8002"}/sessions/${session_id}`,
      { cache: "no-store" }
    );
    data = await res.json();
  } catch (err) {
    console.error("[return] Failed to fetch session status:", err);
  }

  if (data.error) {
    return <div>Could not load payment status. Please check your orders.</div>;
  }

  const isSuccess = data.paymentStatus === "paid";
  const formattedTotal =
    data.amountTotal != null && data.currency
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: data.currency.toUpperCase(),
        }).format(data.amountTotal / 100)
      : null;

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 rounded-xl border border-zinc-800 bg-zinc-900 space-y-6">
      <div className="text-center space-y-2">
        {isSuccess && <ClearCartOnSuccess />}
        <div className="text-4xl mb-2">{isSuccess ? "⚡" : "⚠️"}</div>
        <h1 className="text-2xl font-bold text-white">
          {isSuccess ? "Payment successful!" : `Payment ${data.status ?? "unknown"}`}
        </h1>
        {data.customerEmail && (
          <p className="text-sm text-zinc-500">
            Confirmation sent to <span className="text-zinc-300">{data.customerEmail}</span>
          </p>
        )}
      </div>

      {data.lineItems && data.lineItems.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-volt uppercase tracking-widest">Order Summary</h2>
          <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
            {data.lineItems.map((item, i) => (
              <li key={i} className="flex justify-between items-center px-4 py-3 text-sm">
                <span className="text-zinc-300">
                  {item.description ?? "Item"}{" "}
                  {item.quantity && item.quantity > 1 && (
                    <span className="text-zinc-500">× {item.quantity}</span>
                  )}
                </span>
                <span className="font-medium text-white">
                  {item.amountTotal != null && data.currency
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: data.currency.toUpperCase(),
                      }).format(item.amountTotal / 100)
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
          {formattedTotal && (
            <div className="flex justify-between px-4 py-2 text-sm font-bold text-white">
              <span>Total</span>
              <span className="text-volt">{formattedTotal}</span>
            </div>
          )}
        </div>
      )}

      <Link
        href="/orders"
        className="block w-full text-center bg-volt text-zinc-950 font-bold text-sm py-3 rounded-full uppercase tracking-widest hover:brightness-110 transition-all duration-200"
      >
        {isSuccess ? "View Your Orders" : "See Your Orders"}
      </Link>
    </div>
  );
};

export default ReturnPage;
