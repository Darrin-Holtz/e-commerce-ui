import CategoryBar from "./CategoryBar";

const fetchCategories = async () => {
  try {
    const res = await fetch(`${process.env.PRODUCT_SERVICE_URL}/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const Categories = async () => {
  const categories = await fetchCategories();
  return <CategoryBar categories={categories} />;
};

export default Categories;
