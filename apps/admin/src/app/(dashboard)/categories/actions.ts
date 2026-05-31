"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteCategory = async (id: number) => {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(
    `${process.env.PRODUCT_SERVICE_URL}/categories/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete category: ${res.status}`);
  }

  revalidatePath("/categories");
};
