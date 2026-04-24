import { auth } from "@clerk/nextjs/server";

const fetchServiceResponse = async (url: string, token: string | null) => {
  try {
    const response = await fetch(url, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      body: {
        error: error instanceof Error ? error.message : "Unknown fetch error",
      },
    };
  }
};

const TestPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const [productResult, orderResult, paymentResult] = await Promise.all([
    fetchServiceResponse("http://localhost:8000/test", token),
    fetchServiceResponse("http://localhost:8001/test", token),
    fetchServiceResponse("http://localhost:8002/test", token),
  ]);

  return (
    <main className="mt-12 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Service Auth Test</h1>
        <p className="text-sm text-gray-500">Token present: {token ? "yes" : "no"}</p>
      </div>

      <section className="space-y-4">
        {(
          [
            ["Product Service", productResult],
            ["Order Service", orderResult],
            ["Payment Service", paymentResult],
          ] as const satisfies [string, Awaited<ReturnType<typeof fetchServiceResponse>>][]
        ).map(([label, result]) => (
          <div key={label} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-medium">{label}</h2>
              <span className="text-sm text-gray-500">
                Status: {result.status ?? "fetch failed"}
              </span>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-md bg-gray-50 p-3 text-xs">
              {JSON.stringify(result.body, null, 2)}
            </pre>
          </div>
        ))}
      </section>
    </main>
  );
};

export default TestPage;