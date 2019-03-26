import Model from "../../../../models/Option";
import { readOption, updateOption } from "../../../../tools/options";

const read = async (req, res, next) => {
  const { key } = req.params;
  const result = await readOption(key);

  if (result.isBoom) {
    return next(result);
  }

  res.send(result);
};

const update = async (req, res, next) => {
  const { key } = req.params;
  const result = await updateOption(key, req.body);

  if (result.isBoom) {
    return next(result);
  }

  res.sendStatus(200);
};

export { read, update };
