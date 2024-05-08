var express = require('express');
const {v4: uuid} = require('uuid');
const router = express.Router();
const db = require('../db/queries');
const index = require('../routes/index');
router.get('/', (req, res) => {
    // console.log(users);
    if (index.isDebug() === true) {
        db.getAnalysisFactorListStub(req, res);
    } else {
        db.getAnalysisFactorList(req, res);
    }
})
router.post('/', (req, res) => {
    if (index.isDebug() === true) {
        db.createAnalysisFactorStub(req, res);
    } else {
        db.createAnalysisFactor(req, res);
    }
})
router.get('/:id', (req, res) => {
    if (index.isDebug() === true) {
        db.getAnalysisFactorStub(req, res);
    } else {
        db.getAnalysisFactor(req, res);
    }
});
router.delete('/:id', (req, res) => {
    if (index.isDebug() === true) {
        db.deleteAnalysisFactorStub(req, res);
    } else {
        db.deleteAnalysisFactor(req, res);
    }
});

router.patch('/:id', (req, res) => {
    if (index.isDebug() === true) {
        db.updateAnalysisFactorStub(req, res);
    } else {
        db.updateAnalysisFactor(req, res);
    }

});
module.exports = router;