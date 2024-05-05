var express = require('express');
var router = express.Router();
const db = require('../db/queries');
const upload = require('../utils/upload');
const read_excel = require('../utils/read_excel');
var path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', {title: 'Express'});
    res.sendFile(path.join(__dirname, '/index.html'));
});

router.get('/api/regions', function (req, res, next) {
    //console.error(db.getVersion());
    //console.error("I in");
    db.getRegionsStub(req, res, next);
});

router.get('/api/dtp-chart', function (req, res, next) {
    //console.error(db.getVersion());
    //console.error("I in");
    db.getDtpChartStub(req, res, next);
});

router.get('/api/injured-list', function (req, res, next) {
    //console.error(db.getVersion());
    //console.error("I in");
    db.getInjuredList(req, res, next);
});

router.get('/api/dtp-factor', function (req, res, next) {
    //console.error(db.getVersion());
    //console.error("I in");
    db.getFactorListStub(req, res, next);
});

router.get('/api/analysis-factor', function (req, res, next) {
    //console.error(db.getVersion());
    //console.error("I in");
    db.getAnalysisFactorListStub(req, res, next);
});


// Set up a route for file uploads
router.post('/api/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    let filepath=path.join(__dirname, '../uploads/'+req.file.filename);
    let output = read_excel.getJsonFromExcell(filepath);
    res.json({message: 'File uploaded successfully!'+output+" "+filepath});
});

function paginatedResults(model) {
    // middleware function
    return (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        // calculating the starting and ending index
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        if (endIndex < model.length) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.results = model.slice(startIndex, endIndex);

        res.paginatedResults = results;
        next();
    };
}

module.exports = router;