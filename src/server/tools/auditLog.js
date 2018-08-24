const fs = require('fs');
const JSONexport = require('jsonexport');
const moment = require('moment');

module.exports = {
    log: (type, data, header) => {
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
    },
};
