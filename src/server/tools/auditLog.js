module.exports = {
    log: (type, data) => {
        let Model = null;
        switch (type) {
            case  'api':
                Model = require('../models/AuditAPI');
                break;

            case  'authentication':
                Model = require('../models/AuditAuthentication');
                break;

            case  'error':
                Model = require('../models/AuditError');
                break;
        }

        const item = new Model(data);
        item.save();
    },
};
