const User = require('../models/User');

module.exports = {
    getModel: kind => {
        let model = null;

        switch (kind) {
            case 'users':
                model = User;
                break;
        }

        if (!model) {
            throw new Error(`model not found: ${kind}`);
        }

        return model;
    },
};
