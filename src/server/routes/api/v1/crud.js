const router = require('express').Router({ mergeParams: true });
const dbModels = require('../../../tools/dbModels');
const dbTools = require('../../../tools/dbTools');
const jsonStream = require('JSONStream');
const mongoose = require('mongoose');

router.delete('/', (req, res, next) => {
    if (!req.checkAuthRole('admin')) {
        return res.sendStatus(401);
    }

    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);

    Model.remove({}).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        next(err);
    });
});

router.delete('/:id', (req, res, next) => {
    if (!req.checkAuthRole('admin')) {
        return res.sendStatus(401);
    }

    const id = req.params.id;
    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);

    Model.remove({ _id: id }).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        next(err);
    });
});

router.get('/', (req, res, next) => {
    if (!req.checkAuthRole('*')) {
        return res.sendStatus(401);
    }

    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);

    // set the content type
    res.type('json');

    // find the docs and stream the result
    Model.find({})
        .cursor()
        .pipe(jsonStream.stringify())
        .pipe(res);
});

router.get('/:id', (req, res, next) => {
    if (!req.checkAuthRole('*')) {
        return res.sendStatus(401);
    }

    const id = req.params.id;
    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);

    Model.findOne({ _id: id }).then(doc => {
        res.json(doc);
    }).catch(err => {
        next(err);
    });
});

router.post('/', (req, res, next) => {
    if (!req.checkAuthRole('super')) {
        return res.sendStatus(401);
    }
    if (!req.body) {
        return next({ status: 'error', code: 'noRequestData' });
    }

    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);
    const item = new Model(
        req.body,
    );

    item.save().then(doc => {
        res.send(doc._id);
    }).catch(err => {
        next(err);
    });
});

router.put('/', (req, res, next) => {
    if (!req.checkAuthRole('super')) {
        return res.sendStatus(401);
    }

    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);
    const bulk = Model.collection.initializeOrderedBulkOp();
    const updates = req.body;
    // console.log(req.body);

    updates.forEach(update => {
        update = dbTools.convertUpdateFields(update);
        bulk.find({ _id: mongoose.Types.ObjectId(update.id) }).update(update.updates);
    });

    if (bulk.length > 0) {
        bulk.execute((err, result) => {
            if (err) {
                return next(err);
            }
            res.send(result);
        });
    }
});

router.put('/:id', (req, res, next) => {
    if (!req.checkAuthRole('super')) {
        return res.sendStatus(401);
    }

    const id = req.params.id;
    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);

    Model.findOneAndUpdate({ _id: id }, req.body, { upsert: true }).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        next(err);
    });
});

router.post('/import', (req, res, next) => {
    if (!req.checkAuthRole('super')) {
        return res.sendStatus(401);
    }
    if (!req.body) {
        return next({ status: 'error', code: 'noRequestData' });
    }

    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);
    const queue = [];

    // console.log(req.body);

    // add one at a time (make sure added & updated properties add included)
    req.body.forEach(item => {
        const create = new Model(
            item,
        );

        queue.push(create.save());
    });

    Promise.all(queue).then(docs => {
        res.send(docs);
    }).catch(err => {
        next(err);
    });
});

router.post('/query', (req, res, next) => {
    if (!req.checkAuthRole('*')) {
        return res.sendStatus(401);
    }

    const kind = req.params.kind;
    const Model = dbModels.getModel(kind);
    const query = dbTools.parseFindQuery(req.body);

    // set the content type
    res.type('json');

    // find the docs and stream the result
    Model.find(query.find)
        .limit(query.limit)
        .sort(query.sort)
        .cursor()
        .pipe(jsonStream.stringify())
        .pipe(res);
});

module.exports = router;
