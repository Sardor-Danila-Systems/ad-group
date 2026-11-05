/** Checks the Matterport link parser. Run: npm run test:matterport */
import { strict as assert } from "node:assert";
import { matterportEmbed, matterportId, matterportLink } from "../src/lib/matterport";

for (const ok of ["https://my.matterport.com/show/?m=F81totvRM7Q", "my.matterport.com/show?m=F81totvRM7Q&play=1", "F81totvRM7Q", "  https://my.matterport.com/show/?m=F81totvRM7Q  "]) {
  assert.equal(matterportId(ok), "F81totvRM7Q", ok);
}
for (const bad of ["", "https://evil.com/show/?m=F81totvRM7Q", "https://my.matterport.com.evil.com/show/?m=F81totvRM7Q", "javascript:alert(1)", "https://my.matterport.com/show/?m=short", "https://my.matterport.com/show/?m=F81totvRM7Q<x", "/show/?m=F81totvRM7Q"]) {
  assert.equal(matterportId(bad), null, bad);
}
assert.equal(matterportLink("F81totvRM7Q"), "https://my.matterport.com/show/?m=F81totvRM7Q");
assert.equal(matterportEmbed("F81totvRM7Q", "uz"), "https://my.matterport.com/show/?m=F81totvRM7Q&play=1&qs=1&brand=0&help=0&lang=ru");
assert.ok(matterportEmbed("F81totvRM7Q", "en").endsWith("lang=en"));
console.log("matterport: all passed");
