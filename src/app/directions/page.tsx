import type { Metadata } from "next";
import { DirectionsView } from "@/components/site/directions-view";
import { getSettings } from "@/lib/content-source";

export const metadata: Metadata = {
  title: "Направления — AD Group",
  description: "Строительство, сервис и услуги (рестораны и отели), логистика: направления бизнеса AD Group.",
};

export default async function DirectionsPage() {
  const { ceo } = await getSettings();
  return <DirectionsView ceo={ceo} />;
}
