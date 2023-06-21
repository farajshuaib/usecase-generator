module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/usecase-generator/" : "/",
  outputDir: "dist",
};
