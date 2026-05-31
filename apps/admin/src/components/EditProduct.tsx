"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@e-commerce-ui/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@e-commerce-ui/ui";
import { Input } from "@e-commerce-ui/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@e-commerce-ui/ui";
import { Button } from "@e-commerce-ui/ui";
import { Textarea } from "@e-commerce-ui/ui";
import { Checkbox } from "@e-commerce-ui/ui";
import { ScrollArea } from "@e-commerce-ui/ui";
import {
  CategoryType,
  colors,
  ProductFormSchema,
  ProductType,
  sizes,
} from "@e-commerce-ui/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
  );
  if (!res.ok) throw new Error("Failed to fetch categories!");
  return await res.json();
};

interface EditProductProps {
  product: ProductType;
  onSuccess?: () => void;
}

const EditProduct = ({ product, onSuccess }: EditProductProps) => {
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: Number(product.price),
      categorySlug: product.categorySlug,
      sizes: product.sizes as z.infer<typeof ProductFormSchema>["sizes"],
      colors: product.colors as z.infer<typeof ProductFormSchema>["colors"],
      images: (product.images as Record<string, string>) ?? {},
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${product.id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to update product!");
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Edit Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {categoriesData && (
                  <FormField
                    control={form.control}
                    name="categorySlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoriesData.map((cat: CategoryType) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                id={`size-${size}`}
                                checked={field.value?.includes(size)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, size]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== size)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`size-${size}`}
                                className="text-xs"
                              >
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {colors.map((color) => (
                            <div
                              className="flex items-center gap-2"
                              key={color}
                            >
                              <Checkbox
                                id={`color-${color}`}
                                checked={field.value?.includes(color)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, color]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== color)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`color-${color}`}
                                className="text-xs flex items-center gap-2"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <div>
                          {form.watch("colors")?.map((color) => (
                            <div
                              className="mb-4 flex flex-col gap-2"
                              key={color}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full shrink-0"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-sm font-medium">
                                  {color}
                                </span>
                              </div>
                              {field.value?.[color] && (
                                <p className="text-xs text-muted-foreground truncate">
                                  Current: {field.value[color]}
                                </p>
                              )}
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const formData = new FormData();
                                      formData.append("file", file);
                                      formData.append(
                                        "upload_preset",
                                        "ecommerce"
                                      );
                                      const res = await fetch(
                                        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                        { method: "POST", body: formData }
                                      );
                                      const data = await res.json();
                                      if (!res.ok)
                                        throw new Error(
                                          data?.error?.message ||
                                            "Upload failed!"
                                        );
                                      if (data.secure_url) {
                                        form.setValue("images", {
                                          ...form.getValues("images"),
                                          [color]: data.secure_url,
                                        });
                                      }
                                    } catch {
                                      toast.error("Upload failed!");
                                    }
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a new image to replace the existing one.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default EditProduct;
