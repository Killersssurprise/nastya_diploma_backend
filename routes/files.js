var express = require('express');
const {v4: uuid} = require('uuid');
const router = express.Router();
const db = require('../db/queries');
const index = require('../routes/index');
const upload = require("../utils/upload");
router.get('/', (req, res) => {
    // console.log(users);
    if (index.isDebug() === true) {
        db.getFilesListStub(req, res);
    } else {
        db.getFilesList(req, res);
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

router.post('/upload/:id', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    let filepath = path.join(__dirname, '../uploads/' + req.file.filename);

    db.writeDataFromFile(req, res, filepath);
    //rx.getJsonFromExcell(filepath, res);

    //res.send("file uploaded succesfully")

});

module.exports = router;