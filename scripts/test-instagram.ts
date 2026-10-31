/** Checks the Instagram link normaliser. Run: npm run test:instagram */
import { strict as assert } from "node:assert";
import { instagramHandle, instagramUrl } from "../src/lib/instagram";

const ok: [string, string][] = [
  ["@ad.group", "https://www.instagram.com/ad.group/"],
  ["ad_group", "https://www.instagram.com/ad_group/"],
  ["instagram.com/vatan.residence", "https://www.instagram.com/vatan.residence/"],
  ["https://www.instagram.com/vatan.residence/?igsh=abc", "https://www.instagram.com/vatan.residence/"],
  ["http://instagram.com/ADGroup", "https://www.instagram.com/ADGroup/"],
  ["https://m.instagram.com/ad.logistics/reels/", "https://www.instagram.com/ad.logistics/"],
];
for (const [i, o] of ok) assert.equal(instagramUrl(i), o, i);
for (const bad of ["", "https://evil.com/ad.group", "https://instagram.com.evil.com/x", "javascript:alert(1)", "https://www.instagram.com/p/Cx123/", "https://www.instagram.com/", "two words", "a..b", "https://t.me/ad"]) {
  assert.equal(instagramUrl(bad), null, bad);
}
assert.equal(instagramHandle("https://www.instagram.com/ad.group/"), "@ad.group");
console.log("instagram: all passed");
