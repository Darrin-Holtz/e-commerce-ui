"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteProducts = async (ids: number[]) => {
  const { getToken } = await auth();
  const token = await getToken();

  const results = await Promise.allSettled(
    ids.map((id) =>
      fetch(`${process.env.PRODUCT_SERVICE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    )
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) {
    throw new Error(`Failed to delete ${failed} product(s).`);
  }

  revalidatePath("/products");
};
