import Boom from "@hapi/boom";
import Model from "../models/option";

const readOption = key => {
  return Model.findOne({ key })
    .then(doc => {
      if (!doc) {
        return Boom.notFound(`${key}: not found`);
      }

      return doc.metadata;
    })
    .catch(err =>
      Boom.boomify(err, {
        statusCode: 400,
      }),
    );
};

const updateOption = (key, metadata) => {
  return Model.findOneAndUpdate({ key }, { metadata }, { upsert: true })
    .then(() => true)
    .catch(err =>
      Boom.boomify(err, {
        statusCode: 400,
      }),
    );
};

export { readOption, updateOption };
