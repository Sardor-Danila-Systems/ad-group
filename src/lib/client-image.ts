/**
 * Shrinks photos in the browser before upload. Serverless hosts cap request bodies (about 4.5 MB on Vercel),
 * so a form with several camera photos would fail without this. The server still validates and re-encodes everything.
 */
export async function shrinkImages(files: File[], maxSide = 2000, quality = 0.84): Promise<File[]> {
  return Promise.all(
    files.map(async (file) => {
      if (!file.type.startsWith("image/") || file.size < 500 * 1024) return file;
      try {
        const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
        if (!blob || blob.size >= file.size) return file;
        return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
      } catch {
        return file; // unsupported format in this browser: let the server handle it
      }
    }),
  );
}

/** Replaces the files of an <input type="file"> with their shrunk versions. */
export async function shrinkInput(input: HTMLInputElement) {
  const original = Array.from(input.files ?? []);
  if (original.length === 0) return;
  const shrunk = await shrinkImages(original);
  const dt = new DataTransfer();
  shrunk.forEach((f) => dt.items.add(f));
  input.files = dt.files;
}
