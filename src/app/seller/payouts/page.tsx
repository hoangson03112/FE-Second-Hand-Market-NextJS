import { redirect } from "next/navigation";

export default function SellerPayoutsPage() {
  redirect("/profile?tab=bank");
}
