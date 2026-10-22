import "server-only";
import { hasDatabase } from "@/lib/server/db";
import { fileStore } from "@/lib/server/file-store";
import { UploadError } from "@/lib/server/images";
import { pgStore } from "@/lib/server/pg-store";
import type { Store } from "@/lib/server/types";

/**
 * The single entry point for data. With DATABASE_URL set (Neon) everything lives in Postgres;
 * without it the site falls back to local files in DATA_DIR, which is handy for development.
 */
const impl = (): Store => (hasDatabase() ? pgStore : fileStore);

export { UploadError };
export type { Content } from "@/lib/server/types";

export const loadContent: Store["loadContent"] = () => impl().loadContent();
export const saveProject: Store["saveProject"] = (p) => impl().saveProject(p);
export const deleteProject: Store["deleteProject"] = (id) => impl().deleteProject(id);
export const saveNews: Store["saveNews"] = (n) => impl().saveNews(n);
export const deleteNews: Store["deleteNews"] = (id) => impl().deleteNews(id);
export const saveVacancy: Store["saveVacancy"] = (v) => impl().saveVacancy(v);
export const deleteVacancy: Store["deleteVacancy"] = (id) => impl().deleteVacancy(id);
export const saveSettings: Store["saveSettings"] = (s) => impl().saveSettings(s);
export const listLeads: Store["listLeads"] = () => impl().listLeads();
export const addLead: Store["addLead"] = (l) => impl().addLead(l);
export const deleteLead: Store["deleteLead"] = (id) => impl().deleteLead(id);
export const saveImage: Store["saveImage"] = (f, k) => impl().saveImage(f, k);
export const removeUploads: Store["removeUploads"] = (s) => impl().removeUploads(s);
export const readUpload: Store["readUpload"] = (n) => impl().readUpload(n);
