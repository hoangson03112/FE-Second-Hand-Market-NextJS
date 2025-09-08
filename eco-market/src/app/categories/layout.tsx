import { Suspense } from "react";
import CategoryLoading from "./[id]/loading";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      {children}
    </Suspense>
  );
}




