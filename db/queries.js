const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'mixa',
    host: '127.0.0.1',
    database: 'NastyaDiplom',
    password: '12345',
    port: 5432
});

const getDtpChart = (request, response) => {

    let region_code = request.query.region_code;
    let start_date = request.query.start_date;
    let end_date = request.query.end_date;
    let victim = request.query.victim;
    let factor_dtp_id = request.query.factor_dtp_id;

    if (start_date === undefined || end_date === undefined) {
        end_date = Date.now();
        start_date = new Date(Date.now() - 604800000).toISOString();
        end_date = new Date(Date.now()).toISOString();

        start_date = '2022-01-01 00:00:00';
        end_date = '2022-01-14 00:00:00';
    }

    if (victim === undefined) {
        victim = '0';
    }

    let factor_dtp_additional = '';
    if (factor_dtp_id !== undefined) {
        factor_dtp_additional += 'and id in (select card_id from factor_ref where factor_id in (' + factor_dtp_id + '))';
    }


    // console.log("region_code: "+region_code);
    // console.log("start_date: "+start_date);
    // console.log("end_date: "+end_date);

    let victim_addtitional = '';
    if (victim === '0') { //all

    } else if (victim === '1') { //no injured
        victim_addtitional = 'and pog = 0 and ran = 0 ';
    } else if (victim === '2') { // injured but alive
        victim_addtitional = 'and pog = 0 and ran > 0 ';
    } else if (victim === '3') { // letal
        victim_addtitional = 'and pog > 0 ';
    }


    let query;
    if (region_code === undefined) {

        query = 'SELECT CAST(date As Date) as xCoords, COUNT(id) as yCoords  \n' +
            '\tFROM public."DTPCard"\n' +
            'where region_id in (select id from public."Regions")  ' + factor_dtp_additional + ' ' + victim_addtitional + 'and date between \'' + start_date + '\' and \'' + end_date + '\'\n';
    } else {
        query = 'SELECT CAST(date As Date) as xCoords, COUNT(id) as yCoords  \n' +
            '\tFROM public."DTPCard"\n' +
            'where region_id in (' + region_code + ')  ' + factor_dtp_additional + ' ' + victim_addtitional + ' and date between \'' + start_date + '\' and \'' + end_date + '\'\n';

    }


    query += 'GROUP BY CAST(date As Date);';

    console.log(query);


    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }

        let result = {
            isSuccess: true,
            message: "?",
            data: {
                coords: results.rows
            }
        };

        response.status(200).json(result);
    });
};

const getAnalysisFactorChart = (request, response) => {

    let analysis_factor_id = request.query.analysis_factor_id;
    let start_date = request.query.start_date;
    let end_date = request.query.end_date;


    if (analysis_factor_id === undefined) {
        let result = {
            isSuccess: false,
            message: "Can't create query! Need " + 'analysis_factor_id parameter',
        };
        response.status(500).json(result);
    } else if (start_date === undefined) {
        let result = {
            isSuccess: false,
            message: "Can't create query! Need " + 'start_date parameter',
        };
        response.status(500).json(result);
    } else if (end_date === undefined) {
        let result = {
            isSuccess: false,
            message: "Can't create query! Need " + 'end_date parameter',
        };
        response.status(500).json(result);
    } else {

        // let query = 'SELECT CAST(date as Date) as xCoords, origin_value as yCoords  \n' +
        //     '\tFROM public."factor_data"\n' +
        //     'where analysis_factor_id in (' + analysis_factor_id + ')  and date between \'' + start_date + '\' and \'' + end_date + '\'\n' +
        //     ';'

        let query = 'select xcoords, avg(ycoords) as ycoords from' +
            '(SELECT CAST(date as Date) as xCoords, origin_value as yCoords  \n' +
            '\tFROM public."factor_data"\n' +
            'where analysis_factor_id in (' + analysis_factor_id + ')  and date between \'' + start_date + '\' and \'' + end_date + '\'\n) as foo ' +
            'group by xcoords order by xcoords;'

        console.error(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error;
            }

            let result = {
                isSuccess: true,
                message: "???",
                data: {
                    coords: results.rows
                }
            };

            response.status(200).json(result);
        });
    }
};

const getAnalysisFactorChartStub = (request, response) => {

    let result =
        {
            "isSuccess": true,
            "message": "???",
            "data": {
                "coords": [{
                    "xcoords": "2021-12-31T21:00:00.000Z",
                    "ycoords": 5
                }, {"xcoords": "2022-01-01T21:00:00.000Z", "ycoords": 7}, {
                    "xcoords": "2022-01-02T21:00:00.000Z",
                    "ycoords": 3
                }, {"xcoords": "2022-01-03T21:00:00.000Z", "ycoords": 1}, {
                    "xcoords": "2022-01-04T21:00:00.000Z",
                    "ycoords": 8
                }]
            }
        };
    response.status(200).json(result);
};

const getDtpChartStub = (request, response) => {

    let result =
        {
            "isSuccess": true, "message": "", "data": {
                "coords": [{
                    "xcoords": "2021-12-31T21:00:00.000Z",
                    "ycoords": "20"
                }, {"xcoords": "2022-01-01T21:00:00.000Z", "ycoords": "17"}, {
                    "xcoords": "2022-01-02T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-01-03T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-01-04T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-01-05T21:00:00.000Z", "ycoords": "15"}, {
                    "xcoords": "2022-01-06T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-01-07T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-01-08T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-01-09T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-01-10T21:00:00.000Z",
                    "ycoords": "15"
                }, {"xcoords": "2022-01-11T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-01-12T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-01-13T21:00:00.000Z", "ycoords": "19"}, {
                    "xcoords": "2022-01-14T21:00:00.000Z",
                    "ycoords": "17"
                }, {"xcoords": "2022-01-15T21:00:00.000Z", "ycoords": "15"}, {
                    "xcoords": "2022-01-16T21:00:00.000Z",
                    "ycoords": "14"
                }, {"xcoords": "2022-01-17T21:00:00.000Z", "ycoords": "17"}, {
                    "xcoords": "2022-01-18T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-01-19T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-01-20T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-01-21T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-01-22T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-01-23T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-01-24T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-01-25T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-01-26T21:00:00.000Z",
                    "ycoords": "4"
                }, {"xcoords": "2022-01-27T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-01-28T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-01-29T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-01-30T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-01-31T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-02-01T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-02-02T21:00:00.000Z", "ycoords": "9"}, {
                    "xcoords": "2022-02-03T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-02-04T21:00:00.000Z", "ycoords": "12"}, {
                    "xcoords": "2022-02-05T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-02-06T21:00:00.000Z", "ycoords": "5"}, {
                    "xcoords": "2022-02-07T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-02-08T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-02-09T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-02-10T21:00:00.000Z", "ycoords": "11"}, {
                    "xcoords": "2022-02-11T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-02-12T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-02-13T21:00:00.000Z",
                    "ycoords": "4"
                }, {"xcoords": "2022-02-14T21:00:00.000Z", "ycoords": "3"}, {
                    "xcoords": "2022-02-15T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-02-16T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-02-17T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-02-18T21:00:00.000Z", "ycoords": "12"}, {
                    "xcoords": "2022-02-19T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-02-20T21:00:00.000Z", "ycoords": "5"}, {
                    "xcoords": "2022-02-21T21:00:00.000Z",
                    "ycoords": "5"
                }, {"xcoords": "2022-02-22T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-02-23T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-02-24T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-02-25T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-02-26T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-02-27T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-02-28T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-03-01T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-03-02T21:00:00.000Z", "ycoords": "9"}, {
                    "xcoords": "2022-03-03T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-03-04T21:00:00.000Z", "ycoords": "4"}, {
                    "xcoords": "2022-03-05T21:00:00.000Z",
                    "ycoords": "3"
                }, {"xcoords": "2022-03-06T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-03-07T21:00:00.000Z",
                    "ycoords": "4"
                }, {"xcoords": "2022-03-08T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-03-09T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-03-10T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-03-11T21:00:00.000Z",
                    "ycoords": "5"
                }, {"xcoords": "2022-03-12T21:00:00.000Z", "ycoords": "5"}, {
                    "xcoords": "2022-03-13T21:00:00.000Z",
                    "ycoords": "10"
                }, {"xcoords": "2022-03-14T21:00:00.000Z", "ycoords": "9"}, {
                    "xcoords": "2022-03-15T21:00:00.000Z",
                    "ycoords": "10"
                }, {"xcoords": "2022-03-16T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-03-17T21:00:00.000Z",
                    "ycoords": "12"
                }, {"xcoords": "2022-03-18T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-03-19T21:00:00.000Z",
                    "ycoords": "5"
                }, {"xcoords": "2022-03-20T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-03-21T21:00:00.000Z",
                    "ycoords": "10"
                }, {"xcoords": "2022-03-22T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-03-23T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-03-24T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-03-25T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-03-26T21:00:00.000Z", "ycoords": "19"}, {
                    "xcoords": "2022-03-27T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-03-28T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-03-29T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-03-30T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-03-31T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-04-01T21:00:00.000Z", "ycoords": "13"}]
            }
        };
    response.status(200).json(result);
};


const getVersion = (request, response) => {
    pool.query('SELECT version()', (error, results) => {
        if (error) {
            throw error;
        }
        //console.log(results.rows);
        response.status(200).json(results.rows);
    });
};
const getRegions = (request, response) => {
    pool.query('SELECT * FROM public."Regions" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const getFactorList = (request, response) => {
    pool.query('SELECT * FROM public."factor" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};
const getAnalysisFactorList = (request, response) => {
    pool.query('SELECT * FROM public."analysis_factors" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const getAnalysisFactor = (request, response) => {
    const {id} = request.params;

    let query = 'SELECT * FROM public."analysis_factors" where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const getAnalysisFactorStub = (request, response) => {
    let result =
        {
            "isSuccess": true,
            "message": "",
            "data": [{
                "id": 1,
                "name": "Первый фактор",
                "formula_id": 0,
                "created_at": "2021-12-31T21:00:00.000Z",
                "updated_at": "2021-12-31T21:00:00.000Z",
                "deleted_at": null,
                "data_file_path": "somepath"
            }]
        };
    response.status(200).json(result);
};

const createAnalysisFactor = (request, response) => {
    const factor = request.body;

    let name = factor.name;

    if (name === undefined || name === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter name is wrong",
        };
        response.status(300).json(result);
    } else {
        let query = 'INSERT INTO public.analysis_factors(name, created_at, updated_at) ' +
            '\tVALUES (\'' + name + '\', CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);';
        console.log(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error;
            }
            let result = {
                isSuccess: true,
                message: "",
                data: results.rows
            };

            response.status(200).json(result);
        });
    }
};

const createAnalysisFactorStub = (request, response) => {
    const factor = request.body;

    let name = factor.name;

    if (name === undefined || name === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter name is wrong",
        };
        response.status(300).json(result);
    } else {

        let result = {
            isSuccess: true,
            message: "test ok",
        };

        response.status(200).json(result);
    }
};

const deleteAnalysisFactor = (request, response) => {
    const {id} = request.params;

    let query = 'DELETE FROM public."analysis_factors" where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const deleteAnalysisFactorStub = (request, response) => {
    const {id} = request.params;

    let result = {
        isSuccess: true,
        message: "Test delete ok"
    };

    response.status(200).json(result);

};

const updateAnalysisFactor = (request, response) => {
    const {id} = request.params;

    const factor = request.body;
    let name = factor.name;
    let formula_id = factor.formula_id;
    let data_file_path = factor.data_file_path;

    let query = 'UPDATE public.analysis_factors\n' +
        'SET updated_at=CURRENT_TIMESTAMP,\n';

    if (id === undefined || id === '') {
        let result = {
            isSuccess: true,
            message: "Wrong parameter id!",
        };
        response.status(300).json(result);
        return;
    }

    let additional = '';

    if (name !== undefined) {
        additional += 'name=\'' + name + '\',';
    }

    if (formula_id !== undefined) {
        additional += 'formula_id=\'' + formula_id + '\',';
    }

    if (data_file_path !== undefined) {
        additional += 'data_file_path=\'' + data_file_path + '\',';
    }

    if (additional.toString().endsWith(',')) {
        additional = additional.substring(0, additional.length - 1);
    }

    query += additional;
    query += '\t where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const updateAnalysisFactorStub = (request, response) => {
    const {id} = request.params;

    if (id === undefined || id === '') {
        let result = {
            isSuccess: true,
            message: "Wrong parameter id!",
        };
        response.status(300).json(result);
        return;
    }

    let result = {
        isSuccess: true,
        message: ""
    };

    response.status(200).json(result);

};

const getAnalysisFactorListStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [{
            "id": 1,
            "name": "Первый фактор",
            "formula_id": 0,
            "created_at": "2021-12-31T21:00:00.000Z",
            "updated_at": "2021-12-31T21:00:00.000Z",
            "deleted_at": null,
            "data_file_path": "somepath"
        }, {
            "id": 2,
            "name": "Второй фактор",
            "formula_id": 0,
            "created_at": "2021-12-31T21:00:00.000Z",
            "updated_at": "2021-12-31T21:00:00.000Z",
            "deleted_at": null,
            "data_file_path": "somepath"
        }, {
            "id": 3,
            "name": "Третий фактор",
            "formula_id": 0,
            "created_at": "2021-12-31T21:00:00.000Z",
            "updated_at": "2021-12-31T21:00:00.000Z",
            "deleted_at": null,
            "data_file_path": "somepath"
        }]
    };
    response.status(200).json(result);
};

const getFactorListStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [{
            "id": 1837,
            "title": "Оказание влияния на движение транспортного потока или отдельного транспортного средства, наличия или внезапного появления на проезжей части животных",
            "created_at": "2024-04-21T15:21:13.266Z",
            "updated_at": "2024-04-21T15:21:13.266Z",
            "deleted_at": null
        }, {
            "id": 1838,
            "title": "Сужение проезжей части вследствие проведения работ",
            "created_at": "2024-04-21T15:21:13.267Z",
            "updated_at": "2024-04-21T15:21:13.267Z",
            "deleted_at": null
        }, {
            "id": 1839,
            "title": "Участок, оборудованный искусственными неровностями",
            "created_at": "2024-04-21T15:21:13.267Z",
            "updated_at": "2024-04-21T15:21:13.267Z",
            "deleted_at": null
        }, {
            "id": 1840,
            "title": "Наличие на проезжей части неисправного ТС, мешающего движению",
            "created_at": "2024-04-21T15:21:13.268Z",
            "updated_at": "2024-04-21T15:21:13.268Z",
            "deleted_at": null
        }, {
            "id": 1841,
            "title": "Несоответствие габарита моста (путепровода) ширине проезжей части  на подходах к нему",
            "created_at": "2024-04-21T15:21:13.268Z",
            "updated_at": "2024-04-21T15:21:13.268Z",
            "deleted_at": null
        }, {
            "id": 1842,
            "title": "Режим движения изменён вследствие проведения спецмероприятия",
            "created_at": "2024-04-21T15:21:13.269Z",
            "updated_at": "2024-04-21T15:21:13.269Z",
            "deleted_at": null
        }, {
            "id": 1843,
            "title": "Режим движения нарушен вследствие ранее произошедшего ДТП",
            "created_at": "2024-04-21T15:21:13.269Z",
            "updated_at": "2024-04-21T15:21:13.269Z",
            "deleted_at": null
        }, {
            "id": 1844,
            "title": "Несоответствие параметров дороги, в т.ч. геометрических, её категории на месте ДТП или на подходах к нему (величина радиуса поворота, ширина полос движения, обочин, крутизна откосов насыпи, отсутствие разделительной полосы, отсутствие виража и т.д.)",
            "created_at": "2024-04-21T15:21:13.270Z",
            "updated_at": "2024-04-21T15:21:13.270Z",
            "deleted_at": null
        }, {
            "id": 1845,
            "title": "Проведение работ на тротуарах (пешеходных дорожках, обочинах),  затрудняющих движение пешеходов",
            "created_at": "2024-04-21T15:21:13.270Z",
            "updated_at": "2024-04-21T15:21:13.270Z",
            "deleted_at": null
        }, {
            "id": 1846,
            "title": "Конструктивное сужение проезжей части вследствие уменьшения количества полос движения",
            "created_at": "2024-04-21T15:21:13.271Z",
            "updated_at": "2024-04-21T15:21:13.271Z",
            "deleted_at": null
        }, {
            "id": 1847,
            "title": "Участок, оборудованный шумовыми полосами",
            "created_at": "2024-04-21T15:21:13.272Z",
            "updated_at": "2024-04-21T15:21:13.272Z",
            "deleted_at": null
        }, {
            "id": 1848,
            "title": "Сужение проезжей части припаркованным транспортом",
            "created_at": "2024-04-21T15:21:13.272Z",
            "updated_at": "2024-04-21T15:21:13.272Z",
            "deleted_at": null
        }, {
            "id": 1849,
            "title": "Проведение дорожных и прочих работ без сужения проезжей части",
            "created_at": "2024-04-21T15:21:13.272Z",
            "updated_at": "2024-04-21T15:21:13.272Z",
            "deleted_at": null
        }, {
            "id": 1850,
            "title": "Участок, контролируемый стационарными камерами автоматической фотовидеофиксации нарушений ПДД, обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-21T15:21:13.273Z",
            "updated_at": "2024-04-21T15:21:13.273Z",
            "deleted_at": null
        }, {
            "id": 1851,
            "title": "Участок, контролируемый стационарными камерами автоматической фотовидеофиксации нарушений ПДД, не обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-21T15:21:13.273Z",
            "updated_at": "2024-04-21T15:21:13.273Z",
            "deleted_at": null
        }, {
            "id": 1852,
            "title": "Наличие на проезжей части, обочине или тротуаре торгового или иного объекта, затрудняющего движение или парковку транспорта и (или) движение пешеходов",
            "created_at": "2024-04-21T15:21:13.274Z",
            "updated_at": "2024-04-21T15:21:13.274Z",
            "deleted_at": null
        }, {
            "id": 1853,
            "title": "Работа светофора на регулируемом перекрёстке или регулируемом пешеходном переходе в режиме 'жёлтого мигания'",
            "created_at": "2024-04-21T15:21:13.274Z",
            "updated_at": "2024-04-21T15:21:13.274Z",
            "deleted_at": null
        }, {
            "id": 1854,
            "title": "Оказание влияния на движение транспортного потока или отдельного транспортного средства, наличия или внезапного возникновения на проезжей части посторонних предметов (упавшее дерево или мачта освещения, осыпь камней, селевой вынос, груз с другого транспортного сред-ства или конструктивный элемент другого транспортного средства и т.д.)",
            "created_at": "2024-04-21T15:21:13.275Z",
            "updated_at": "2024-04-21T15:21:13.275Z",
            "deleted_at": null
        }, {
            "id": 1855,
            "title": "Изменение в режиме движения вследствие согласованного массового мероприятия",
            "created_at": "2024-04-21T15:21:13.275Z",
            "updated_at": "2024-04-21T15:21:13.275Z",
            "deleted_at": null
        }, {
            "id": 1856,
            "title": "Несоответствие категории дороги (фактических геометрических характеристик) интенсивности движения (исходя из требований СП 34.13330.2012 «Свод правил. Автомобильные дороги. Актуализированная редакция СНиП 2.05.02-85*»)",
            "created_at": "2024-04-21T15:21:13.275Z",
            "updated_at": "2024-04-21T15:21:13.275Z",
            "deleted_at": null
        }, {
            "id": 1857,
            "title": "Наличие на тротуарах (пешеходных дорожках, обочинах) припаркованного  транспорта,   затрудняющего движение пешеходов",
            "created_at": "2024-04-21T15:21:13.276Z",
            "updated_at": "2024-04-21T15:21:13.276Z",
            "deleted_at": null
        }, {
            "id": 1858,
            "title": "Сведения отсутствуют",
            "created_at": "2024-04-21T15:21:13.276Z",
            "updated_at": "2024-04-21T15:21:13.276Z",
            "deleted_at": null
        }, {
            "id": 1859,
            "title": "Неудовлетворительное состояние тротуара или пешеходной дорожки (в  т.ч. недостатки зимнего содержания), затрудняющие или препятствующие движению пешеходов",
            "created_at": "2024-04-21T15:21:13.276Z",
            "updated_at": "2024-04-21T15:21:13.276Z",
            "deleted_at": null
        }, {
            "id": 1886,
            "title": "Нарушение режима движения вследствие несогласованного массового мероприятия",
            "created_at": "2024-04-21T16:37:42.882Z",
            "updated_at": "2024-04-21T16:37:42.882Z",
            "deleted_at": null
        }, {
            "id": 1936,
            "title": "Отключение электроснабжения целиком или частично в муниципальном образовании (районе, городе, районе города, посёлке, селе, деревне, ауле и т.д.)",
            "created_at": "2024-04-22T09:18:39.074Z",
            "updated_at": "2024-04-22T09:18:39.074Z",
            "deleted_at": null
        }, {
            "id": 1940,
            "title": "Наличие пересечения (примыкания), не предусмотренного проектной документацией» (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.075Z",
            "updated_at": "2024-04-22T09:18:39.075Z",
            "deleted_at": null
        }, {
            "id": 1942,
            "title": "Отключение электроснабжения на данном элементе УДС (улице, дороге, площади, дворе и т.д.) в целом (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.075Z",
            "updated_at": "2024-04-22T09:18:39.075Z",
            "deleted_at": null
        }, {
            "id": 1945,
            "title": "Участок, оборудованный искусственными неровностями, не обозначенный соответствующими дорожными знаками и(или) разметкой (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.076Z",
            "updated_at": "2024-04-22T09:18:39.076Z",
            "deleted_at": null
        }, {
            "id": 1954,
            "title": "Отсутствие дополнительных полос для движения (в т.ч. переходно-скоростных полос) в необходимых местах (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.077Z",
            "updated_at": "2024-04-22T09:18:39.077Z",
            "deleted_at": null
        }, {
            "id": 1958,
            "title": "Отключение электроснабжения на данном элементе УДС (улице, дороге, площади, дворе и т.д.) в целом",
            "created_at": "2024-04-22T11:22:28.486Z",
            "updated_at": "2024-04-22T11:22:28.486Z",
            "deleted_at": null
        }, {
            "id": 1961,
            "title": "Наличие  пересечения (примыкания), не предусмотренного проектной документацией",
            "created_at": "2024-04-22T11:22:28.490Z",
            "updated_at": "2024-04-22T11:22:28.490Z",
            "deleted_at": null
        }, {
            "id": 1962,
            "title": "Участок, оборудованный искусственными неровностями и обозначенный соответствующими дорожными знаками и разметкой",
            "created_at": "2024-04-22T11:22:28.491Z",
            "updated_at": "2024-04-22T11:22:28.491Z",
            "deleted_at": null
        }, {
            "id": 1966,
            "title": "Участок, оборудованный искусственными неровностями, не обозначенный соответствующими дорожными знаками и (или) разметкой",
            "created_at": "2024-04-22T11:22:28.496Z",
            "updated_at": "2024-04-22T11:22:28.496Z",
            "deleted_at": null
        }, {
            "id": 1969,
            "title": "Отсутствие дополнительных полос для движения (в т.ч. переходно-скоростных полос) в необходимых местах",
            "created_at": "2024-04-22T11:22:28.499Z",
            "updated_at": "2024-04-22T11:22:28.499Z",
            "deleted_at": null
        }, {
            "id": 1974,
            "title": "Участок, контролируемый камерой автоматической фотовидеофиксации нарушений ПДД, обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-22T11:22:28.504Z",
            "updated_at": "2024-04-22T11:22:28.504Z",
            "deleted_at": null
        }, {
            "id": 1979,
            "title": "Несоответствие категории дороги (фактических геометрических характеристик) интенсивности движения (исходя из требований СНиП 2.05.02.-85 'Автомобильные дороги')",
            "created_at": "2024-04-22T11:22:28.509Z",
            "updated_at": "2024-04-22T11:22:28.509Z",
            "deleted_at": null
        }, {
            "id": 1980,
            "title": "Участок, контролируемый камерой автоматической фотовидеофиксации нарушений ПДД, не обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-22T11:22:28.511Z",
            "updated_at": "2024-04-22T11:22:28.511Z",
            "deleted_at": null
        }, {
            "id": 1981,
            "title": "Отключение электроснабжения целиком или частично в муниципальном образовании  (районе, городе, районе  города, посёлке, селе, деревне, ауле и т.д.)",
            "created_at": "2024-04-22T11:22:28.512Z",
            "updated_at": "2024-04-22T11:22:28.512Z",
            "deleted_at": null
        }]
    };
    response.status(200).json(result);
};


const getRegionsStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [{
            "id": 3501333,
            "region_code": 80,
            "region_name": "Республика Башкортостан",
            "created_at": "2024-04-21T15:21:16.467Z",
            "updated_at": "2024-04-21T15:21:16.467Z",
            "deleted_at": null
        }, {
            "id": 3504950,
            "region_code": 27,
            "region_name": "Калининградская область",
            "created_at": "2024-04-21T15:21:16.624Z",
            "updated_at": "2024-04-21T15:21:16.624Z",
            "deleted_at": null
        }, {
            "id": 3505951,
            "region_code": 17,
            "region_name": "Владимирская область",
            "created_at": "2024-04-21T15:21:16.665Z",
            "updated_at": "2024-04-21T15:21:16.665Z",
            "deleted_at": null
        }, {
            "id": 3507692,
            "region_code": 36,
            "region_name": "Самарская область",
            "created_at": "2024-04-21T15:21:16.744Z",
            "updated_at": "2024-04-21T15:21:16.744Z",
            "deleted_at": null
        }, {
            "id": 3510725,
            "region_code": 91,
            "region_name": "Карачаево-Черкесская Республика",
            "created_at": "2024-04-21T15:21:16.881Z",
            "updated_at": "2024-04-21T15:21:16.881Z",
            "deleted_at": null
        }, {
            "id": 3511138,
            "region_code": 57,
            "region_name": "Пермский край",
            "created_at": "2024-04-21T15:21:16.898Z",
            "updated_at": "2024-04-21T15:21:16.898Z",
            "deleted_at": null
        }, {
            "id": 3513194,
            "region_code": 20,
            "region_name": "Воронежская область",
            "created_at": "2024-04-21T15:21:16.992Z",
            "updated_at": "2024-04-21T15:21:16.992Z",
            "deleted_at": null
        }, {
            "id": 3515751,
            "region_code": 40,
            "region_name": "г. Санкт-Петербург",
            "created_at": "2024-04-21T15:21:17.114Z",
            "updated_at": "2024-04-21T15:21:17.114Z",
            "deleted_at": null
        }, {
            "id": 3519774,
            "region_code": 76,
            "region_name": "Забайкальский край",
            "created_at": "2024-04-21T15:21:17.287Z",
            "updated_at": "2024-04-21T15:21:17.287Z",
            "deleted_at": null
        }, {
            "id": 3520746,
            "region_code": 61,
            "region_name": "Рязанская область",
            "created_at": "2024-04-21T15:21:17.324Z",
            "updated_at": "2024-04-21T15:21:17.324Z",
            "deleted_at": null
        }, {
            "id": 3522243,
            "region_code": 68,
            "region_name": "Тамбовская область",
            "created_at": "2024-04-21T15:21:17.384Z",
            "updated_at": "2024-04-21T15:21:17.384Z",
            "deleted_at": null
        }, {
            "id": 3523336,
            "region_code": 52,
            "region_name": "Омская область",
            "created_at": "2024-04-21T15:21:17.428Z",
            "updated_at": "2024-04-21T15:21:17.428Z",
            "deleted_at": null
        }, {
            "id": 3526088,
            "region_code": 96,
            "region_name": "Чеченская Республика",
            "created_at": "2024-04-21T15:21:17.565Z",
            "updated_at": "2024-04-21T15:21:17.565Z",
            "deleted_at": null
        }, {
            "id": 3526256,
            "region_code": 92,
            "region_name": "Республика Татарстан",
            "created_at": "2024-04-21T15:21:17.572Z",
            "updated_at": "2024-04-21T15:21:17.572Z",
            "deleted_at": null
        }, {
            "id": 3529597,
            "region_code": 34,
            "region_name": "Костромская область",
            "created_at": "2024-04-21T15:21:17.712Z",
            "updated_at": "2024-04-21T15:21:17.712Z",
            "deleted_at": null
        }, {
            "id": 3530396,
            "region_code": 93,
            "region_name": "Республика Тыва",
            "created_at": "2024-04-21T15:21:17.747Z",
            "updated_at": "2024-04-21T15:21:17.747Z",
            "deleted_at": null
        }, {
            "id": 3530902,
            "region_code": 12,
            "region_name": "Астраханская область",
            "created_at": "2024-04-21T15:21:17.769Z",
            "updated_at": "2024-04-21T15:21:17.769Z",
            "deleted_at": null
        }, {
            "id": 3531805,
            "region_code": 71100,
            "region_name": "Ханты-Мансийский АО",
            "created_at": "2024-04-21T15:21:17.812Z",
            "updated_at": "2024-04-21T15:21:17.812Z",
            "deleted_at": null
        }, {
            "id": 3533094,
            "region_code": 30,
            "region_name": "Камчатский край",
            "created_at": "2024-04-21T15:21:17.864Z",
            "updated_at": "2024-04-21T15:21:17.864Z",
            "deleted_at": null
        }, {
            "id": 3533470,
            "region_code": 22,
            "region_name": "Нижегородская область",
            "created_at": "2024-04-21T15:21:17.881Z",
            "updated_at": "2024-04-21T15:21:17.881Z",
            "deleted_at": null
        }, {
            "id": 3538137,
            "region_code": 44,
            "region_name": "Магаданская область",
            "created_at": "2024-04-21T15:21:18.095Z",
            "updated_at": "2024-04-21T15:21:18.095Z",
            "deleted_at": null
        }, {
            "id": 3538314,
            "region_code": 10011,
            "region_name": "Ненецкий АО",
            "created_at": "2024-04-21T15:21:18.104Z",
            "updated_at": "2024-04-21T15:21:18.104Z",
            "deleted_at": null
        }, {
            "id": 3538328,
            "region_code": 85,
            "region_name": "Республика Калмыкия",
            "created_at": "2024-04-21T15:21:18.105Z",
            "updated_at": "2024-04-21T15:21:18.105Z",
            "deleted_at": null
        }, {
            "id": 3538861,
            "region_code": 78,
            "region_name": "Ярославская область",
            "created_at": "2024-04-21T15:21:18.131Z",
            "updated_at": "2024-04-21T15:21:18.131Z",
            "deleted_at": null
        }, {
            "id": 3540289,
            "region_code": 73,
            "region_name": "Ульяновская область",
            "created_at": "2024-04-21T15:21:18.197Z",
            "updated_at": "2024-04-21T15:21:18.197Z",
            "deleted_at": null
        }, {
            "id": 3541322,
            "region_code": 5,
            "region_name": "Приморский край",
            "created_at": "2024-04-21T15:21:18.240Z",
            "updated_at": "2024-04-21T15:21:18.240Z",
            "deleted_at": null
        }, {
            "id": 3543627,
            "region_code": 19,
            "region_name": "Вологодская область",
            "created_at": "2024-04-21T15:21:18.335Z",
            "updated_at": "2024-04-21T15:21:18.335Z",
            "deleted_at": null
        }, {
            "id": 3544918,
            "region_code": 1,
            "region_name": "Алтайский край",
            "created_at": "2024-04-21T15:21:18.391Z",
            "updated_at": "2024-04-21T15:21:18.391Z",
            "deleted_at": null
        }, {
            "id": 3547167,
            "region_code": 77,
            "region_name": "Чукотский автономный округ",
            "created_at": "2024-04-21T15:21:18.494Z",
            "updated_at": "2024-04-21T15:21:18.494Z",
            "deleted_at": null
        }, {
            "id": 3547180,
            "region_code": 79,
            "region_name": "Республика Адыгея",
            "created_at": "2024-04-21T15:21:18.495Z",
            "updated_at": "2024-04-21T15:21:18.495Z",
            "deleted_at": null
        }, {
            "id": 3547619,
            "region_code": 101,
            "region_name": "Сириус",
            "created_at": "2024-04-21T15:21:18.512Z",
            "updated_at": "2024-04-21T15:21:18.512Z",
            "deleted_at": null
        }, {
            "id": 3547672,
            "region_code": 87,
            "region_name": "Республика Коми",
            "created_at": "2024-04-21T15:21:18.514Z",
            "updated_at": "2024-04-21T15:21:18.514Z",
            "deleted_at": null
        }, {
            "id": 3548532,
            "region_code": 54,
            "region_name": "Орловская область",
            "created_at": "2024-04-21T15:21:18.550Z",
            "updated_at": "2024-04-21T15:21:18.550Z",
            "deleted_at": null
        }, {
            "id": 3549193,
            "region_code": 99,
            "region_name": "Еврейская автономная область",
            "created_at": "2024-04-21T15:21:18.577Z",
            "updated_at": "2024-04-21T15:21:18.577Z",
            "deleted_at": null
        }, {
            "id": 3549411,
            "region_code": 32,
            "region_name": "Кемеровская область - Кузбасс",
            "created_at": "2024-04-21T15:21:18.587Z",
            "updated_at": "2024-04-21T15:21:18.587Z",
            "deleted_at": null
        }, {
            "id": 3551915,
            "region_code": 10,
            "region_name": "Амурская область",
            "created_at": "2024-04-21T15:21:18.712Z",
            "updated_at": "2024-04-21T15:21:18.712Z",
            "deleted_at": null
        }, {
            "id": 3553066,
            "region_code": 18,
            "region_name": "Волгоградская область",
            "created_at": "2024-04-21T15:21:18.770Z",
            "updated_at": "2024-04-21T15:21:18.770Z",
            "deleted_at": null
        }, {
            "id": 3555505,
            "region_code": 98,
            "region_name": "Республика Саха (Якутия)",
            "created_at": "2024-04-21T15:21:18.886Z",
            "updated_at": "2024-04-21T15:21:18.886Z",
            "deleted_at": null
        }, {
            "id": 3556311,
            "region_code": 71140,
            "region_name": "Ямало-Ненецкий АО",
            "created_at": "2024-04-21T15:21:18.921Z",
            "updated_at": "2024-04-21T15:21:18.921Z",
            "deleted_at": null
        }, {
            "id": 3556578,
            "region_code": 26,
            "region_name": "Республика Ингушетия",
            "created_at": "2024-04-21T15:21:18.932Z",
            "updated_at": "2024-04-21T15:21:18.932Z",
            "deleted_at": null
        }, {
            "id": 3556773,
            "region_code": 63,
            "region_name": "Саратовская область",
            "created_at": "2024-04-21T15:21:18.943Z",
            "updated_at": "2024-04-21T15:21:18.943Z",
            "deleted_at": null
        }, {
            "id": 3559428,
            "region_code": 8,
            "region_name": "Хабаровский край",
            "created_at": "2024-04-21T15:21:19.065Z",
            "updated_at": "2024-04-21T15:21:19.065Z",
            "deleted_at": null
        }, {
            "id": 3560753,
            "region_code": 64,
            "region_name": "Сахалинская область",
            "created_at": "2024-04-21T15:21:19.123Z",
            "updated_at": "2024-04-21T15:21:19.123Z",
            "deleted_at": null
        }, {
            "id": 3561181,
            "region_code": 33,
            "region_name": "Кировская область",
            "created_at": "2024-04-21T15:21:19.145Z",
            "updated_at": "2024-04-21T15:21:19.145Z",
            "deleted_at": null
        }, {
            "id": 3562762,
            "region_code": 65,
            "region_name": "Свердловская область",
            "created_at": "2024-04-21T15:21:19.222Z",
            "updated_at": "2024-04-21T15:21:19.222Z",
            "deleted_at": null
        }, {
            "id": 3565571,
            "region_code": 11,
            "region_name": "Архангельская область",
            "created_at": "2024-04-21T15:21:19.347Z",
            "updated_at": "2024-04-21T15:21:19.347Z",
            "deleted_at": null
        }, {
            "id": 3566338,
            "region_code": 29,
            "region_name": "Калужская область",
            "created_at": "2024-04-21T15:21:19.385Z",
            "updated_at": "2024-04-21T15:21:19.385Z",
            "deleted_at": null
        }, {
            "id": 3567495,
            "region_code": 35,
            "region_name": "Республика Крым",
            "created_at": "2024-04-21T15:21:19.444Z",
            "updated_at": "2024-04-21T15:21:19.444Z",
            "deleted_at": null
        }, {
            "id": 3568934,
            "region_code": 60,
            "region_name": "Ростовская область",
            "created_at": "2024-04-21T15:21:19.507Z",
            "updated_at": "2024-04-21T15:21:19.507Z",
            "deleted_at": null
        }, {
            "id": 3571723,
            "region_code": 86,
            "region_name": "Республика Карелия",
            "created_at": "2024-04-21T15:21:19.621Z",
            "updated_at": "2024-04-21T15:21:19.621Z",
            "deleted_at": null
        }, {
            "id": 3572299,
            "region_code": 3,
            "region_name": "Краснодарский край",
            "created_at": "2024-04-21T15:21:19.647Z",
            "updated_at": "2024-04-21T15:21:19.647Z",
            "deleted_at": null
        }, {
            "id": 3578454,
            "region_code": 7,
            "region_name": "Ставропольский край",
            "created_at": "2024-04-21T15:21:19.910Z",
            "updated_at": "2024-04-21T15:21:19.910Z",
            "deleted_at": null
        }, {
            "id": 3580957,
            "region_code": 49,
            "region_name": "Новгородская область",
            "created_at": "2024-04-21T15:21:20.017Z",
            "updated_at": "2024-04-21T15:21:20.017Z",
            "deleted_at": null
        }, {
            "id": 3581627,
            "region_code": 4,
            "region_name": "Красноярский край",
            "created_at": "2024-04-21T15:21:20.047Z",
            "updated_at": "2024-04-21T15:21:20.047Z",
            "deleted_at": null
        }, {
            "id": 3584586,
            "region_code": 71,
            "region_name": "Тюменская область",
            "created_at": "2024-04-21T15:21:20.181Z",
            "updated_at": "2024-04-21T15:21:20.181Z",
            "deleted_at": null
        }, {
            "id": 3587442,
            "region_code": 69,
            "region_name": "Томская область",
            "created_at": "2024-04-21T15:21:20.313Z",
            "updated_at": "2024-04-21T15:21:20.313Z",
            "deleted_at": null
        }, {
            "id": 3587852,
            "region_code": 53,
            "region_name": "Оренбургская область",
            "created_at": "2024-04-21T15:21:20.332Z",
            "updated_at": "2024-04-21T15:21:20.332Z",
            "deleted_at": null
        }, {
            "id": 3589197,
            "region_code": 89,
            "region_name": "Республика Мордовия",
            "created_at": "2024-04-21T15:21:20.396Z",
            "updated_at": "2024-04-21T15:21:20.396Z",
            "deleted_at": null
        }, {
            "id": 3589768,
            "region_code": 82,
            "region_name": "Республика Дагестан",
            "created_at": "2024-04-21T15:21:20.422Z",
            "updated_at": "2024-04-21T15:21:20.422Z",
            "deleted_at": null
        }, {
            "id": 3591446,
            "region_code": 24,
            "region_name": "Ивановская область",
            "created_at": "2024-04-21T15:21:20.499Z",
            "updated_at": "2024-04-21T15:21:20.499Z",
            "deleted_at": null
        }, {
            "id": 3592502,
            "region_code": 41,
            "region_name": "Ленинградская область",
            "created_at": "2024-04-21T15:21:20.546Z",
            "updated_at": "2024-04-21T15:21:20.546Z",
            "deleted_at": null
        }, {
            "id": 3594345,
            "region_code": 42,
            "region_name": "Липецкая область",
            "created_at": "2024-04-21T15:21:20.619Z",
            "updated_at": "2024-04-21T15:21:20.619Z",
            "deleted_at": null
        }, {
            "id": 3595544,
            "region_code": 45,
            "region_name": "г. Москва",
            "created_at": "2024-04-21T15:21:20.671Z",
            "updated_at": "2024-04-21T15:21:20.671Z",
            "deleted_at": null
        }, {
            "id": 3603662,
            "region_code": 75,
            "region_name": "Челябинская область",
            "created_at": "2024-04-21T15:21:21.011Z",
            "updated_at": "2024-04-21T15:21:21.011Z",
            "deleted_at": null
        }, {
            "id": 3607351,
            "region_code": 25,
            "region_name": "Иркутская область",
            "created_at": "2024-04-21T15:21:21.181Z",
            "updated_at": "2024-04-21T15:21:21.181Z",
            "deleted_at": null
        }, {
            "id": 3609655,
            "region_code": 83,
            "region_name": "Кабардино-Балкарская Республика",
            "created_at": "2024-04-21T15:21:21.276Z",
            "updated_at": "2024-04-21T15:21:21.276Z",
            "deleted_at": null
        }, {
            "id": 3610294,
            "region_code": 94,
            "region_name": "Удмуртская Республика",
            "created_at": "2024-04-21T15:21:21.305Z",
            "updated_at": "2024-04-21T15:21:21.305Z",
            "deleted_at": null
        }, {
            "id": 3611596,
            "region_code": 28,
            "region_name": "Тверская область",
            "created_at": "2024-04-21T15:21:21.358Z",
            "updated_at": "2024-04-21T15:21:21.358Z",
            "deleted_at": null
        }, {
            "id": 3613045,
            "region_code": 47,
            "region_name": "Мурманская область",
            "created_at": "2024-04-21T15:21:21.424Z",
            "updated_at": "2024-04-21T15:21:21.424Z",
            "deleted_at": null
        }, {
            "id": 3613676,
            "region_code": 37,
            "region_name": "Курганская область",
            "created_at": "2024-04-21T15:21:21.451Z",
            "updated_at": "2024-04-21T15:21:21.451Z",
            "deleted_at": null
        }, {
            "id": 3614491,
            "region_code": 38,
            "region_name": "Курская область",
            "created_at": "2024-04-21T15:21:21.484Z",
            "updated_at": "2024-04-21T15:21:21.484Z",
            "deleted_at": null
        }, {
            "id": 3615527,
            "region_code": 46,
            "region_name": "Московская область",
            "created_at": "2024-04-21T15:21:21.528Z",
            "updated_at": "2024-04-21T15:21:21.528Z",
            "deleted_at": null
        }, {
            "id": 3619484,
            "region_code": 67,
            "region_name": "г. Севастополь",
            "created_at": "2024-04-21T15:21:21.703Z",
            "updated_at": "2024-04-21T15:21:21.703Z",
            "deleted_at": null
        }, {
            "id": 3620001,
            "region_code": 88,
            "region_name": "Республика Марий Эл",
            "created_at": "2024-04-21T15:21:21.726Z",
            "updated_at": "2024-04-21T15:21:21.726Z",
            "deleted_at": null
        }, {
            "id": 3620664,
            "region_code": 66,
            "region_name": "Смоленская область",
            "created_at": "2024-04-21T15:21:21.752Z",
            "updated_at": "2024-04-21T15:21:21.752Z",
            "deleted_at": null
        }, {
            "id": 3621603,
            "region_code": 95,
            "region_name": "Республика Хакасия",
            "created_at": "2024-04-21T15:21:21.791Z",
            "updated_at": "2024-04-21T15:21:21.791Z",
            "deleted_at": null
        }, {
            "id": 3622126,
            "region_code": 15,
            "region_name": "Брянская область",
            "created_at": "2024-04-21T15:21:21.812Z",
            "updated_at": "2024-04-21T15:21:21.812Z",
            "deleted_at": null
        }, {
            "id": 3622754,
            "region_code": 56,
            "region_name": "Пензенская область",
            "created_at": "2024-04-21T15:21:21.839Z",
            "updated_at": "2024-04-21T15:21:21.839Z",
            "deleted_at": null
        }, {
            "id": 3624309,
            "region_code": 97,
            "region_name": "Чувашская Республика",
            "created_at": "2024-04-21T15:21:21.903Z",
            "updated_at": "2024-04-21T15:21:21.903Z",
            "deleted_at": null
        }, {
            "id": 3625191,
            "region_code": 14,
            "region_name": "Белгородская область",
            "created_at": "2024-04-21T15:21:21.941Z",
            "updated_at": "2024-04-21T15:21:21.941Z",
            "deleted_at": null
        }, {
            "id": 3626297,
            "region_code": 84,
            "region_name": "Республика Алтай",
            "created_at": "2024-04-21T15:21:21.988Z",
            "updated_at": "2024-04-21T15:21:21.988Z",
            "deleted_at": null
        }, {
            "id": 3626633,
            "region_code": 81,
            "region_name": "Республика Бурятия",
            "created_at": "2024-04-21T15:21:22.003Z",
            "updated_at": "2024-04-21T15:21:22.003Z",
            "deleted_at": null
        }, {
            "id": 3627706,
            "region_code": 90,
            "region_name": "Республика Северная Осетия - Алания",
            "created_at": "2024-04-21T15:21:22.053Z",
            "updated_at": "2024-04-21T15:21:22.053Z",
            "deleted_at": null
        }, {
            "id": 3628588,
            "region_code": 58,
            "region_name": "Псковская область",
            "created_at": "2024-04-21T15:21:22.091Z",
            "updated_at": "2024-04-21T15:21:22.091Z",
            "deleted_at": null
        }, {
            "id": 3629275,
            "region_code": 70,
            "region_name": "Тульская область",
            "created_at": "2024-04-21T15:21:22.119Z",
            "updated_at": "2024-04-21T15:21:22.119Z",
            "deleted_at": null
        }, {
            "id": 3760691,
            "region_code": 50,
            "region_name": "Новосибирская область",
            "created_at": "2024-04-21T16:37:44.609Z",
            "updated_at": "2024-04-21T16:37:44.609Z",
            "deleted_at": null
        }]
    };
    response.status(200).json(result);
};

const getInjuredList = (request, response) => {
    // pool.query('SELECT * FROM public."Regions" ORDER BY id ASC', (error, results) => {
    //     if (error) {
    //         throw error;
    //     }
    let result = {
        isSuccess: true,
        message: "",
        data: [
            {
                id: 0,
                title: 'Все'
            },
            {
                id: 1,
                title: 'Без пострадавших'
            },
            {
                id: 2,
                title: 'С пострадавшими без погибших'
            },
            {
                id: 3,
                title: 'С летальным исходом'
            }
        ]
    };

    response.status(200).json(result);
    // });
};

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const createUser = (request, response) => {
    const {name, email} = request.body;

    pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        }
    );
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const {name, email} = request.body;

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    );
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getRegions,
    getVersion,
    getDtpChart,
    getInjuredList,
    getFactorList,
    getDtpChartStub,
    getRegionsStub,
    getFactorListStub,
    getAnalysisFactorList,
    getAnalysisFactorListStub,
    getAnalysisFactorChart,
    getAnalysisFactorChartStub,
    getAnalysisFactor,
    getAnalysisFactorStub,
    createAnalysisFactorStub,
    createAnalysisFactor,
    deleteAnalysisFactor,
    deleteAnalysisFactorStub,
    updateAnalysisFactorStub,
    updateAnalysisFactor
};