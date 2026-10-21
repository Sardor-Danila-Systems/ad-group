import type { Metadata } from "next";
import { DirectionsView } from "@/components/site/directions-view";

export const metadata: Metadata = {
  title: "Направления — AD Group",
  description: "Строительство, сервис и услуги (рестораны и отели), логистика: направления бизнеса AD Group.",
};

export default function DirectionsPage() {
  return <DirectionsView />;
}
