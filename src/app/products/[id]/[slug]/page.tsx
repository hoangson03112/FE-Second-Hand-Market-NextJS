"use client";

import Product from '@/components/feature/product/Product'
import { useParams } from 'next/navigation';
import React from 'react'



export default function ProductPage() {
  const { id } = useParams<{ id: string; slug: string }>()

  return (
    <Product id={id} />
  )
}
