import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@e-commerce-ui/types";

const fetchOrders = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(
    `${process.env.ORDER_SERVICE_URL}/user-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: OrderType[] = await res.json();
  return data;
};

const OrdersPage = async () => {
  const orders = await fetchOrders();

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium">No orders found</p>
        <p className="text-sm mt-1">Your completed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-medium mb-6">Your Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-4"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wide">Order ID</span>
                <span className="text-sm font-mono text-gray-700">{order._id}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Date</span>
                  <span className="text-gray-700">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Total</span>
                  <span className="font-semibold text-gray-800">${(order.amount / 100).toFixed(2)}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status === "success" ? "Successful" : "Failed"}
                </span>
              </div>
            </div>
            {/* Products */}
            {order.products?.length > 0 && (
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                {order.products.map((product, i) => (
                  <div key={i} className="flex items-center justify-between text-sm text-gray-600">
                    <span>{product.name}</span>
                    <span className="text-gray-400">
                      x{product.quantity} &mdash; ${(product.price / 100 * product.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;