"use client";

import { useParams } from 'next/navigation';
import Product from "@/components/feature/product";

export default function ProductPage() {
  const { id } = useParams<{ id: string; slug: string }>();

  return <Product id={id} />;
}
