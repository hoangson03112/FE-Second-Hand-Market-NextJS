import { use } from "react";
import SubCategoryPage from "@/features/categories/SubCategoryPage";

type SubCategoryPageComponentProps = {
  params: Promise<{
    slug: string;
    subId: string;
  }>;
};

export default function SubCategoryPageComponent({ params }: SubCategoryPageComponentProps) {
  const { slug, subId } = use(params);

  return <SubCategoryPage slug={slug} subId={subId} />;
}


