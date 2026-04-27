import Link from "next/link";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return <div>No session id found!</div>;
  }

  let data: { status?: string; paymentStatus?: string; error?: string } = {};
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

  return (
    <div className="">
      <h1>Payment {data.status}</h1>
      <p>Payment status: {data.paymentStatus}</p>
      <Link href="/orders">See your orders</Link>
    </div>
  );
};

export default ReturnPage;