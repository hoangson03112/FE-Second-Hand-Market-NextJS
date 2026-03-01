import { use } from "react";
import CategoryPage from "@/components/feature/categories/CategoryPage";

type CategoryPageComponentProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function CategoryPageComponent({ params }: CategoryPageComponentProps) {
  const { slug } = use(params);

  return <CategoryPage slug={slug} />;
}
  