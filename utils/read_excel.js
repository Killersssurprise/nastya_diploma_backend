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

const getJsonFromExcell = async (path, res) => {

    //TODO make validation

    let jsonAnswer = '';
    readXlsxFile(path, {schema}).then(({rows, errors}) => {
        // `rows` is an array of rows
        // each row being an array of cells.


        // for (let i = 0; i < rows.length; i++) {
        //     console.log(rows[i]);
        // }
        //let value = 1+1;

        // jsonAnswer = JSON.stringify(rows);
        let result = {
            isSuccess: true,
            message: "File uploaded successfully!",
        };

        res.status(200).json(result);

    })
};

module.exports = {
    getJsonFromExcell,
};