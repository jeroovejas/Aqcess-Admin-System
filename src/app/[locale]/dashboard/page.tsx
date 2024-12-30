import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Closed Gate Communities | Dashboard",
  description: "Closed Gate Communities Dashboard Page",
};

export default function Home() {
  return (
    <>
        <ECommerce />
    </>
  );
}
