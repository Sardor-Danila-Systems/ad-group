"use client";

import dynamic from "next/dynamic";
import { useSite } from "@/components/site/site-provider";
import type { Project } from "@/lib/types";

// The viewer touches window and WebGL, so it is only ever loaded in the browser.
const ShowroomViewer = dynamic(() => import("@/components/site/showroom-viewer"), {
  ssr: false,
  loading: () => <Loading />,
});

function Loading() {
  const { t } = useSite();
  return (
    <div className="fixed inset-0 grid place-items-center bg-ink text-white" role="status">
      <p className="font-display text-xl text-white/80">{t("showroom.loading")}</p>
    </div>
  );
}

export function ShowroomView({ project }: { project: Project }) {
  const { lang } = useSite();
  return <ShowroomViewer scenes={project.showroom ?? []} projectName={project.name[lang]} backHref={`/projects/${project.id}`} />;
}
