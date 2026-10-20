import { readUpload } from "@/lib/server/store";

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  const data = await readUpload(name);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/webp",
      // File names are random and never reused, so they can be cached forever.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
