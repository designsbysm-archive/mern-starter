import Logger from "../tools/fileLogger";
const logger = Logger("api");

export default (tokens, req, res) => {
  const body = req.body || {};
  const code = res.statusCode;
  const method = req.method;
  const url = req.originalUrl;
  const username = req.user ? req.user.username : "unknown";

  // only log api calls (except sessions)
  if (!url.startsWith("/api/") || url.includes("/sessions/")) {
    return;
  }

  logger.log({
    body,
    code,
    level: "info",
    method,
    timestamp: new Date(),
    url,
    username,
  });
};
