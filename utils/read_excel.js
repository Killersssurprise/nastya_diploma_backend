const readXlsxFile = require('read-excel-file/node')

// Set up storage for uploaded files

const schema = {
    'date': {
        prop: 'date',
        type: Date,
        required: true
    },
    'value': {
        prop: 'value',
        type: Number,
        required: true
    },
    'region_code': {
        prop: 'region_code',
        type: Number,
        required: false
    }
}
function convertDateExcel (excelDate) {
    // Get the number of milliseconds from Unix epoch.
    const unixTime = (excelDate - 25569) * 86400 * 1000;
    return new Date(unixTime);
}
const getJsonFromExcell = async (req, res, path, db) => {
    const {id} = req.params;
    let jsonAnswer = '';
    readXlsxFile(path, {schema}).then(({rows, errors}) => {

        jsonAnswer = JSON.stringify(rows);
        let resultss = {
            isSuccess: true,
            message: "File uploaded successfully!",
            json:jsonAnswer
        };
        //21498
        let query = 'INSERT INTO public.factor_data(' +
        'origin_value, value, analysis_factor_id, date, created_at, updated_at) VALUES ';

        let values = '';
        for (let i = 0; i < rows.length; i++) {
            values+='(\''+rows[i].value+'\',\''+rows[i].value+'\',\''+id+'\',\''+rows[i].date.toUTCString()+'\', CURRENT_TIMESTAMP,CURRENT_TIMESTAMP), ';
        }

        values = values.substring(0, values.length - 1);
        values = values.substring(0, values.length - 1);
        query +=values+';'

        db.getPool().query(query, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(resultss);
        });



    })
};

module.exports = {
    getJsonFromExcell,
};