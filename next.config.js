const path = require("path");

const nextConfig = {
  output: "export",
  sassOptions: { includePaths: [path.join(__dirname, "styles")] },
  images: { unoptimized: true },
  trailingSlash: true,
  // productionBrowserSourceMaps: process.env.STAGE !== "prod",
};

module.exports = nextConfig;
