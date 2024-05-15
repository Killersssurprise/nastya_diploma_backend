var express = require('express');
const {v4: uuid} = require('uuid');
const router = express.Router();
const db = require('../db/queries');
const index = require('../routes/index');
const upload = require("../utils/upload");
var path = require('path');
router.get('/', (req, res) => {
    let filePath = path.join(__dirname, "../files/shablon.xlsx");
    res.download(filePath);
})
// router.get('/:id', (req, res) => {
//     if (index.isDebug() === true) {
//         db.getAnalysisFactorStub(req, res);
//     } else {
//         db.getAnalysisFactor(req, res);
//     }
// });
router.delete('/:id', (req, res) => {
    if (index.isDebug() === true) {
        db.deleteFactorDataStub(req, res);
    } else {
        db.deleteFactorData(req, res);
    }
});

// router.patch('/:id', (req, res) => {
//     if (index.isDebug() === true) {
//         db.updateAnalysisFactorStub(req, res);
//     } else {
//         db.updateAnalysisFactor(req, res);
//     }
//
// });

router.post('/upload/:id', upload.single('file'), (req, res) => {
    let filepath = path.join(__dirname, '../uploads/' + req.file.filename);

    if (index.isDebug() === true) {
        db.writeDataFromFileStub(req, res, filepath,);
    } else {
        db.writeDataFromFile(req, res, filepath,);
    }



});

module.exports = router;