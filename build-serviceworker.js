const {build} = require("esbuild");
const {injectManifest} = require("workbox-build");

build({
    entryPoints: ["src/service-worker.js"],
    outfile: "public/service-worker.js",
    bundle: true,
    define: {
        "process.env.PUBLIC_URL": `""`
    }
}).then(async () => {
    await injectManifest({...workboxConfig});
});