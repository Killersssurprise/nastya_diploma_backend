var factorRoutes = require('./analysis_factors');
var methodRoutes = require('./analysis_methods');
var correlationRoutes = require('./analysis_correlation');
var express = require('express');
var router = express.Router();
const db = require('../db/queries');
const upload = require('../utils/upload');
const rx = require('../utils/read_excel');
var path = require('path');
const apifiles = require('./files');

let debug = false;
exports.isDebug = () => debug;

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', {title: 'Express'});
    res.sendFile(path.join(__dirname, '/index.html'));
});

router.get('/api/regions', function (req, res, next) {
    if(debug === true){
        db.getRegionsStub(req, res, next);
    }else{
        db.getRegions(req, res, next);
    }
});

router.get('/api/dtp-chart', function (req, res, next) {
    if(debug){
        db.getDtpChartStub(req, res, next);
    }else{
        db.getDtpChart(req, res, next);
    }
});

router.get('/api/dtp-factor', function (req, res, next) {
    if(debug){
        db.getFactorListStub(req, res, next);
    }else{
        db.getFactorList(req, res, next);
    }
});

router.use('/api/analysis-factor', factorRoutes);
router.use('/api/analysis-methods', methodRoutes);
router.use('/api/analysis-correlation', correlationRoutes);
router.get('/api/injured-list', function (req, res, next) {
    //console.error(db.getVersion());
    //console.error("I in");
    db.getInjuredList(req, res, next);
});

router.get('/api/factor-chart', function (req, res, next) {
    //console.error(db.getVersion());
    //console.error("I in");
    if(debug === true){
        db.getAnalysisFactorChartStub(req, res, next);
    }else{
        db.getAnalysisFactorChart(req, res, next);
    }


});


// Set up a route for file uploads
router.post('/api/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    //let filepath = path.join(__dirname, '../uploads/' + req.file.filename);

    //rx.getJsonFromExcell(filepath, res);

    res.send("file uploaded succesfully")

});

router.use('/api/files', apifiles);

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