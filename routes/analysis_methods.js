var express = require('express');
const {v4: uuid} = require('uuid');
const router = express.Router();
const db = require('../db/queries');
const index = require('../routes/index');
router.get('/', (req, res) => {
    // console.log(users);
    if (index.isDebug() === true) {
        db.getAnalysisMethodListStub(req, res);
    } else {
        db.getAnalysisMethodList(req, res);
    }
})
router.post('/', (req, res) => {
    if (index.isDebug() === true) {
        db.createAnalysisMethodStub(req, res);
    } else {
        db.createAnalysisMethod(req, res);
    }
})
router.get('/:id', (req, res) => {
    if (index.isDebug() === true) {
        db.getAnalysisMethodStub(req, res);
    } else {
        db.getAnalysisMethod(req, res);
    }
});
router.delete('/:id', (req, res) => {
    if (index.isDebug() === true) {
        db.deleteAnalysisMethodStub(req, res);
    } else {
        db.deleteAnalysisMethod(req, res);
    }
});

router.patch('/:id', (req, res) => {
    if (index.isDebug() === true) {
        db.updateAnalysisMethodStub(req, res);
    } else {
        db.updateAnalysisMethod(req, res);
    }

});
module.exports = router;