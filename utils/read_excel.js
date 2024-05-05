const readXlsxFile = require('read-excel-file/node')

// Set up storage for uploaded files

const schema = {
    'date':{
        prop:'date',
        type:Date
    },
    'value':{
        prop:'value',
        type: Number,
        required: true
    },
    'region_code':{
        prop:'region_code',
        type: Number,
        required:true
    }
}

const getJsonFromExcell = (path) => {

// File path.
//     readXlsxFile(path).then((rows) => {
//         // `rows` is an array of rows
//         // each row being an array of cells.
//
//         for(let i = 0; i<rows.length;i++){
//             console.log(rows[i]);
//         }
//         //let value = 1+1;
//
//     })
    let jsonAnswer = '';
    readXlsxFile(path,{schema}).then(({rows, errors}) => {
        // `rows` is an array of rows
        // each row being an array of cells.


        // for(let i = 0; i<rows.length;i++){
        //     console.log(rows[i]);
        // }
        //let value = 1+1;

        jsonAnswer = JSON.stringify(rows);

    })
    return jsonAnswer ;
};

module.exports = {
    getJsonFromExcell,
};