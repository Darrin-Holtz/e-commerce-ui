const baseUrl = process.env.PRODUCT_SERVICE_URL ?? "http://localhost:8000";

let response;

try {
  response = await fetch(`${baseUrl}/categories`, {
    headers: {
      Accept: "application/json",
    },
  });
} catch (error) {
  console.error(`Could not reach product-service at ${baseUrl}`);
  console.error("Start the service with: pnpm --filter product-service dev");
  console.error(error);
  process.exit(1);
}

let payload;

try {
  payload = await response.json();
} catch {
  console.error("GET /categories did not return JSON");
  process.exit(1);
}

if (!response.ok) {
  console.error(`GET /categories failed with ${response.status}`);
  console.error(payload);
  process.exit(1);
}

if (!Array.isArray(payload)) {
  console.error("GET /categories returned a non-array payload");
  console.error(payload);
  process.exit(1);
}

console.log(`GET /categories returned ${payload.length} categories`);
console.log(JSON.stringify(payload, null, 2));