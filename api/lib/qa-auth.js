// QA Authentication Helper
// CommonJS module for serverless functions

module.exports.requireQASecret = function(req) {
  const want = process.env.QA_SECRET;
  const got = req.headers["x-qa-secret"] || (req.query && req.query.secret);
  
  if (!want || !got || want !== String(got)) {
    throw new Error("Forbidden");
  }
};
