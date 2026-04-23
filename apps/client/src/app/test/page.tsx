import { auth } from "@clerk/nextjs/server"

const TestPage = async () => {
    const testEndpoint = process.env.PRODUCT_TEST_URL ?? "http://localhost:8000/test"
  const { getToken, userId } = await auth()
    const token = await getToken()

    const res = await fetch(testEndpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
      redirect: "manual",
    })

    const contentType = res.headers.get("content-type") ?? "(none)"

    const raw = await res.text()
    let data: unknown = null

    if (raw.trim().length > 0) {
      try {
        data = JSON.parse(raw)
      } catch {
        data = { raw }
      }
    }

    const hasToken = Boolean(token)
    const apiRejectedAuth = res.status === 401 || res.status === 403
    const isAuthenticated = hasToken && !apiRejectedAuth
    const payload = data && typeof data === "object" ? (data as Record<string, unknown>) : null

    const directUserId = payload?.userId
    const nestedUser = payload?.user
    const nestedUserId =
      nestedUser && typeof nestedUser === "object"
        ? (nestedUser as Record<string, unknown>).id
        : null

    const apiUserId =
      typeof directUserId === "string"
        ? directUserId
        : typeof nestedUserId === "string"
          ? nestedUserId
          : null

  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Auth Test</h1>
      <p>
        Authenticated: <strong>{isAuthenticated ? "YES" : "NO"}</strong>
      </p>
      <p>Token present: {hasToken ? "YES" : "NO"}</p>
      <p>Clerk userId: {userId ?? "(none)"}</p>
      <p>API userId: {apiUserId ?? "(not found in response)"}</p>
      <p>Endpoint: {testEndpoint}</p>
      <p>Response status: {res.status}</p>
      <p>Response ok: {res.ok ? "true" : "false"}</p>
      <p>Content-Type: {contentType}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}

export default TestPage