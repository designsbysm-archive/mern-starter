import auditLog from "../auditLog";

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

  if (body.password) {
    body.password = "*****";
  }

  const buff = Buffer.from(JSON.stringify(body));
  const base64data = buff.toString("base64");

  auditLog("api", {
    body: base64data,
    code,
    method,
    timestamp: new Date()
      .toISOString(),
    url,
    username,
  });
};
