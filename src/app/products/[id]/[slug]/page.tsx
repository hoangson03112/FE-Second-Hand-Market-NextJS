"use client";

import { useParams } from "next/navigation";
import Product from "@/features/product/Product";

export default function ProductPage() {
  const params = useParams<{ id: string; slug: string }>();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  if (!id) return null;

  return <Product id={id} />;
}
