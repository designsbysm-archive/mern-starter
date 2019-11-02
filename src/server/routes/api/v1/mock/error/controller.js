import Boom from "@hapi/boom";

const boom = (req, res, next) => {
  const { code } = req.params;
  const { message } = req.body;

  next(
    new Boom(message, {
      statusCode: code,
    }),
  );
};

const json = (req, res) => {
  const { code } = req.params;

  res.status(code)
    .json(req.body);
};

const text = (req, res) => {
  const { code } = req.params;
  const { message } = req.body;

  res.status(code)
    .json(message);
};

export { boom, json, text };
