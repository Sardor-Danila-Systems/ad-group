/** Checks the video link parser. Run: npm run test:video */
import { strict as assert } from "node:assert";
import { embedUrl, parseVideo } from "../src/lib/video";

const yt = (id: string) => ({ kind: "youtube", id });
const ok: [string, unknown][] = [
  ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", yt("dQw4w9WgXcQ")],
  ["https://youtu.be/dQw4w9WgXcQ?si=abc", yt("dQw4w9WgXcQ")],
  ["https://youtube.com/shorts/dQw4w9WgXcQ", yt("dQw4w9WgXcQ")],
  ["https://www.youtube.com/embed/dQw4w9WgXcQ", yt("dQw4w9WgXcQ")],
  ["https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=10s", yt("dQw4w9WgXcQ")],
  ["youtu.be/dQw4w9WgXcQ", yt("dQw4w9WgXcQ")],
  ["https://vimeo.com/123456789", { kind: "vimeo", id: "123456789", hash: undefined }],
  ["https://vimeo.com/123456789/abcdef1234", { kind: "vimeo", id: "123456789", hash: "abcdef1234" }],
  ["https://player.vimeo.com/video/123456789?h=abcdef1234", { kind: "vimeo", id: "123456789", hash: "abcdef1234" }],
  ["https://cdn.example.com/tours/vatan.mp4", { kind: "file", src: "https://cdn.example.com/tours/vatan.mp4" }],
];
for (const [input, expected] of ok) assert.deepEqual(parseVideo(input), expected, input);

const bad = [
  "", "   ", "javascript:alert(1)", "http://youtu.be/dQw4w9WgXcQ", "https://evil.com/youtube.com/watch?v=dQw4w9WgXcQ",
  "https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/watch?v=short", "https://example.com/page", "data:text/html,<script>1</script>",
  "https://vimeo.com/channels/staffpicks", "https://example.com/video.mp4.html",
];
for (const input of bad) assert.equal(parseVideo(input), null, input);

assert.match(embedUrl(yt("dQw4w9WgXcQ") as never)!, /^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ\?/);
assert.equal(embedUrl({ kind: "file", src: "https://x.com/a.mp4" }), null);
console.log("video parser: all passed");
