const { build } = require("esbuild");

build({
    entryPoints: ["src/service-worker.js"],
    outfile: "public/service-worker.js",
    bundle: true,
    define: {
        "process.env.PUBLIC_URL": `""`
    }
})