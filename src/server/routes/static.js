const express = require('express');
const router = express.Router();
const path = require('path');
const assetFolder = '/../client';

// serve up app files
router.use('/', express.static(`${__dirname}${assetFolder}/`));

// serve up pages
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, assetFolder, '/', 'index.html'));
});

module.exports = router;
