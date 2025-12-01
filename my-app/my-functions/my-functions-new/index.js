// my-functions-new/index.js
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// サンプルの HTTP 関数（onRequest と logger をちゃんと使う）
exports.helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", {structuredData: true});

  res.send("Hello from Firebase!");
});
