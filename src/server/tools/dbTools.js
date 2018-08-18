const mongoose = require('mongoose');

module.exports = {
    convertUpdateFields: update => {
        const set = update.updates.$set;

        for (const key in set) {
            if (set.hasOwnProperty(key)) {
                if (
                    key === 'date'
                ) {
                    set[key] = new Date(set[key]);
                }

                if (
                    key === 'post' ||
                    key === 'pre'
                ) {
                    set[key] = mongoose.Types.ObjectId(set[key]);
                }

            }
        }

        return update;
    },

    parseFindQuery: body => {
        const find = body.find || {};
        const limit = body.limit || null;
        const sort = body.sort || {};

        return {
            find: find,
            limit: limit,
            sort: sort,
        };
    },
};
