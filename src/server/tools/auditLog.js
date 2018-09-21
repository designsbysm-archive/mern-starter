const fs = require('fs');
const JSONexport = require('jsonexport');
const moment = require('moment');

module.exports = {
    log: (type, data) => {
        let header = null;
        // let Model = null;
        switch (type) {
            case  'api':
                header = [
                    'timestamp',
                    'username',
                    'method',
                    'url',
                    'body',
                    'code',
                ];
                // Model = require('../models/AuditAPI');
                break;

            case  'authentication':
                header = [
                    'timestamp',
                    'username',
                    'method',
                    'action',
                ];
                // Model = require('../models/AuditAuthentication');
                break;

            case  'error':
                header = [
                    'timestamp',
                    'code',
                    'status',
                    'message',
                ];
                // Model = require('../models/AuditError');
                break;
        }

        // make sure the audit folder exists
        const dirAduit = './audit';
        if (!fs.existsSync(dirAduit)) {
            fs.mkdirSync(dirAduit);
        }

        // make sure the audit type exists
        const dirType = `${dirAduit}/${type}`;
        if (!fs.existsSync(dirType)) {
            fs.mkdirSync(dirType);
        }

        // see if the day files exists
        const file = `${dirType}/${moment().format('YYYY-MM-DD')}.csv`;
        let includeHeader = true;
        if (fs.existsSync(file)) {
            includeHeader = false;
        }

        // append the log for today
        JSONexport([data], {
            headers: header,
            includeHeaders: includeHeader,
        }, (err, csv) => {
            if (err) {
                next(err);
            }

            const csvStream = fs.createWriteStream(file, { 'flags': 'a' });
            csvStream.write(csv + '\n');
        });

        // const item = new Model(data);
        // item.save();
    },
};
